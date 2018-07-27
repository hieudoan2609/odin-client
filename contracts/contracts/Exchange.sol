pragma solidity ^0.4.22;

import 'openzeppelin-solidity/contracts/math/SafeMath.sol';
import 'openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol';

contract Exchange {
  using SafeMath for uint;

  struct Order {
    address owner;
    address token;
    uint price;
    uint amount;
    uint timestamp;
    uint id;
    bool sell;
    uint next;
    uint prev;
  }

  struct Price {
    uint orderCount;
    uint higher;
    uint lower;
    mapping (uint => Order) orders;
    uint firstOrder;
    uint lastOrder;
  }

  struct OrderBook {
    uint bid;
    uint ask;
    mapping (uint => Price) prices;
    uint highest;
    uint lowest;
  }

  struct Token {
    string name;
    string symbol;
    bool initialized;
  }

  address public owner;
  uint private lastOrderId;
  uint public feeMake;
  uint public feeTake;

  mapping (address => OrderBook) public orderBooks;
  mapping (address => Token) public tokens; // list of official tokens managed by owner
  mapping (address => mapping (address => uint)) public balances;

  event Deposit(address token, address user, uint amount, uint balance);
  event Withdraw(address token, address user, uint amount, uint balance);
  event NewOrder(address indexed token, address indexed owner, uint id, bool sell, uint price, uint amount, uint timestamp);
  event NewTrade(address indexed token, uint indexed bidId, uint indexed askId, bool side, uint amount, uint price, uint timestamp);

  constructor(uint _feeMake, uint _feeTake) public {
    owner = msg.sender;
    tokens[0].name = 'Ethereum';
    tokens[0].symbol = 'ETH';
    feeMake = _feeMake;
    feeTake = _feeTake;
  }

  modifier requireOwner {
    require(msg.sender == owner);
    _;
  }

  function addToken(address _address, string _name, string _symbol) public requireOwner {
    require(!tokens[_address].initialized);
    tokens[_address].name = _name;
    tokens[_address].symbol = _symbol;
    tokens[_address].initialized = true;
  }

  function removeToken(address _address) public requireOwner {
    require(tokens[_address].initialized);
    delete tokens[_address];
  }

  function setFeeMake(uint _feeMake) public requireOwner {
    feeMake = _feeMake;
  }

  function setFeeTake(uint _feeTake) public requireOwner {
    feeTake = _feeTake;
  }

  function setOwner(address _owner) public requireOwner {
    owner = _owner;
  }

  function deposit(address _token, uint _amount) public payable {
    if (_token == 0) {
      require(msg.value == _amount);
      balances[0][msg.sender] = balances[0][msg.sender].add(msg.value);
    } else {
      require(msg.value == 0);
      balances[_token][msg.sender] = balances[_token][msg.sender].add(_amount);
      require(StandardToken(_token).transferFrom(msg.sender, this, _amount)); // need to call approve() on the token contract first
    }
    emit Deposit(_token, msg.sender, _amount, balances[_token][msg.sender]);
  }

  function withdraw(address _token, uint _amount) public {
    require(balances[_token][msg.sender] >= _amount);
    balances[_token][msg.sender] = balances[_token][msg.sender].sub(_amount);
    if (_token == 0) {
      require(msg.sender.send(_amount));
    } else {
      require(StandardToken(_token).transfer(msg.sender, _amount));
    }
    emit Withdraw(_token, msg.sender, _amount, balances[_token][msg.sender]);
  }

  function balance() public constant requireOwner returns (uint) {
    return address(this).balance;
  }

  function createOrder(address _token, uint _price, uint _amount, bool _sell) public {
    /* balance checks */
    if (_sell == true) {
      require(balances[_token][msg.sender] >= _amount);
      balances[_token][msg.sender] = balances[_token][msg.sender].sub(_amount);
    } else {
      uint etherAmount = (_price.mul(_amount)).div(1 ether);
      require(etherAmount > 0);
      require(balances[0][msg.sender] >= etherAmount);
      balances[0][msg.sender] = balances[0][msg.sender].sub(etherAmount);
    }

    /* assign the order to temporary memory */
    Order memory order;
    order.token = _token;
    order.owner = msg.sender;
    order.id = lastOrderId.add(1);
    order.sell = _sell;
    order.price = _price;
    order.amount = _amount;
    order.timestamp = now;
    orderBooks[order.token].prices[order.price].orders[order.id] = order;
    orderBooks[order.token].prices[order.price].orderCount++;
    lastOrderId = lastOrderId.add(1);

    matchOrders(order);
  }

  function matchOrders(Order order) private {
    if (order.sell == true) {
      /* sell order's matches are higher buy orders */
      uint currentBuyPrice = orderBooks[order.token].ask;
      while (currentBuyPrice >= order.price && order.amount != 0) {
        /* while there is a satisfied price */
        /* loop through every order belongs to this price & filling them until order.amount == 0 */
        uint buyOrderId = orderBooks[order.token].prices[currentBuyPrice].firstOrder;
        while (orderBooks[order.token].prices[currentBuyPrice].orderCount != 0 && order.amount != 0) {
          Order storage buyOrder = orderBooks[order.token].prices[currentBuyPrice].orders[buyOrderId];
          tradeOrders(buyOrder, order);
          buyOrderId = orderBooks[order.token].prices[currentBuyPrice].orders[buyOrderId].next;
        }

        if (orderBooks[order.token].prices[currentBuyPrice].orderCount == 0) {
          /* price is gone, update new ask, higher, lower, highest, lowest */
          /* orderBooks[order.token].ask = orderBooks[order.token].prices[currentBuyPrice].lower; */
          orderBooks[order.token].prices[orderBooks[order.token].prices[currentBuyPrice].higher].lower = orderBooks[order.token].prices[currentBuyPrice].lower;
          /* orderBooks[order.token].prices[orderBooks[order.token].prices[currentBuyPrice].lower].higher = orderBooks[order.token].prices[currentBuyPrice].higher; */
        }

        /* update next matchPrice */
        currentBuyPrice = orderBooks[order.token].prices[currentBuyPrice].lower;
      }
    } else {
      /* buy order's matches are lower sell orders */
      uint currentSellPrice = orderBooks[order.token].bid;
      while (currentSellPrice != 0 && currentSellPrice <= order.price && order.amount != 0) {
        /* while there is a satisfied price */
        /* loop through every order belongs to this price & filling them until order.amount == 0 */
        uint sellOrderId = orderBooks[order.token].prices[currentSellPrice].firstOrder;
        while (orderBooks[order.token].prices[currentSellPrice].orderCount != 0 && order.amount != 0) {
          Order storage sellOrder = orderBooks[order.token].prices[currentSellPrice].orders[sellOrderId];
          tradeOrders(order, sellOrder);
          sellOrderId = orderBooks[order.token].prices[currentSellPrice].orders[sellOrderId].next;
        }

        /* update next matchPrice */
        currentSellPrice = orderBooks[order.token].prices[currentSellPrice].higher;

        if (order.amount != 0 && orderBooks[order.token].prices[currentSellPrice].orderCount == 0) {
          /* price is gone, update new bid, higher, lower, highest, lowest */
          /* orderBooks[order.token].prices[orderBooks[order.token].prices[currentBuyPrice].higher].lower = orderBooks[order.token].prices[currentBuyPrice].lower; */
          /* orderBooks[order.token].prices[orderBooks[order.token].prices[currentBuyPrice].lower].higher = orderBooks[order.token].prices[currentBuyPrice].higher; */
          orderBooks[order.token].bid = orderBooks[order.token].prices[currentSellPrice].higher;
        }
      }
    }

    /* place a rest order if there is still an amount */
    if (order.amount != 0) {
      placeOrder(order);
    }
  }

  function tradeOrders(Order buyOrder, Order sellOrder) private {
    if (buyOrder.amount > sellOrder.amount) {
      /* buyer gets his token */
      balances[buyOrder.token][buyOrder.owner] = balances[buyOrder.token][buyOrder.owner].add(sellOrder.amount);
      /* seller gets his eth */
      balances[0][sellOrder.owner] = balances[0][sellOrder.owner].add((sellOrder.price.mul(sellOrder.amount)).div(1 ether));
      /* buy order's amount decreased */
      buyOrder.amount = buyOrder.amount.sub(sellOrder.amount);
      /* orderCount decreased */
      orderBooks[sellOrder.token].prices[sellOrder.price].orderCount--;
      /* sell order deleted */
      delete sellOrder;
    } else if (buyOrder.amount < sellOrder.amount) {
      /* buyer gets his token */
      balances[buyOrder.token][buyOrder.owner] = balances[buyOrder.token][buyOrder.owner].add(buyOrder.amount);
      /* seller gets his eth */
      balances[0][sellOrder.owner] = balances[0][sellOrder.owner].add((buyOrder.price.mul(buyOrder.amount)).div(1 ether));
      /* sell order's amount decreased */
      sellOrder.amount = sellOrder.amount.sub(buyOrder.amount);
      /* orderCount decreased */
      orderBooks[buyOrder.token].prices[buyOrder.price].orderCount--;
      /* sell order deleted */
      delete buyOrder;
    } else {
      /* just to be on the safe side */
      require(buyOrder.amount == sellOrder.amount);
      /* buyer gets his token */
      balances[buyOrder.token][buyOrder.owner] = balances[buyOrder.token][buyOrder.owner].add(buyOrder.amount);
      /* seller gets his eth */
      balances[0][sellOrder.owner] = balances[0][sellOrder.owner].add((buyOrder.price.mul(buyOrder.amount)).div(1 ether));
      /* orderCount decreased */
      orderBooks[sellOrder.token].prices[sellOrder.price].orderCount--;
      orderBooks[buyOrder.token].prices[buyOrder.price].orderCount--;
      /* both orders are deleted */
      delete sellOrder;
      delete buyOrder;
    }
  }

  function placeOrder(Order order) private {
    /* updating bid & ask */
    if (order.sell == true) {
      if (orderBooks[order.token].bid == 0) {
        orderBooks[order.token].bid = order.price;
      }

      if (orderBooks[order.token].bid > order.price) {
        orderBooks[order.token].bid = order.price;
      }
    } else {
      if (orderBooks[order.token].ask == 0) {
        orderBooks[order.token].ask = order.price;
      }

      if (orderBooks[order.token].ask < order.price) {
        orderBooks[order.token].ask = order.price;
      }
    }

    /* update higher, lower, highest, lowest, firstOrder & lastOrder */
    if (order.price > orderBooks[order.token].highest) {
      if (orderBooks[order.token].highest == 0) {
        /* this is the first order */
        orderBooks[order.token].prices[order.price].higher = 0;
        orderBooks[order.token].prices[order.price].lower = 0;
      } else {
        /* this is the new highest */
        orderBooks[order.token].prices[order.price].higher = 0;
        orderBooks[order.token].prices[order.price].lower = orderBooks[order.token].highest;
        /* previous highests higher becomes this orders price */
        orderBooks[order.token].prices[orderBooks[order.token].highest].higher = order.price;
        if (orderBooks[order.token].prices[orderBooks[order.token].highest].lower == 0) {
          /* if previous highest doesn't have a lower order, it is now the lowest */
          orderBooks[order.token].lowest = orderBooks[order.token].highest;
        }
      }
      /* this order becomes the highest */
      orderBooks[order.token].highest = order.price;
      /* this is the first order of the price */
      orderBooks[order.token].prices[order.price].firstOrder = order.id;
      orderBooks[order.token].prices[order.price].lastOrder = order.id;
      orderBooks[order.token].prices[order.price].orders[order.id].prev = 0;
      orderBooks[order.token].prices[order.price].orders[order.id].next = 0;
    } else if (order.price < orderBooks[order.token].lowest) {
      /* this is the lowest */
      orderBooks[order.token].prices[order.price].higher = orderBooks[order.token].lowest;
      orderBooks[order.token].prices[order.price].lower = 0;
      /* previous lowests lower becomes this order */
      orderBooks[order.token].prices[orderBooks[order.token].lowest].lower = order.price;
      /* this order becomes the lowest */
      orderBooks[order.token].lowest = order.price;
      /* this is the first order of the price */
      orderBooks[order.token].prices[order.price].firstOrder = order.id;
      orderBooks[order.token].prices[order.price].lastOrder = order.id;
      orderBooks[order.token].prices[order.price].orders[order.id].prev = 0;
      orderBooks[order.token].prices[order.price].orders[order.id].next = 0;
    } else {
      /* it's somewhere in the middle */
      if (orderBooks[order.token].prices[order.price].orderCount != 0) {
        /* there are already existing orders for the price */
        /* attach this order to the end of the price mapping */
        orderBooks[order.token].prices[order.price].orders[orderBooks[order.token].prices[order.price].lastOrder].next = order.id;
        orderBooks[order.token].prices[order.price].orders[order.id].next = 0;
        orderBooks[order.token].prices[order.price].orders[order.id].prev = orderBooks[order.token].prices[order.price].lastOrder;
        orderBooks[order.token].prices[order.price].lastOrder = order.id;
      } else {
        /* price doesn't exist yet */
        uint pointer = orderBooks[order.token].highest;
        bool found = false;
        while (found == false) {
          if (order.price >= orderBooks[order.token].prices[pointer].lower) {
            orderBooks[order.token].prices[order.price].higher = pointer;
            orderBooks[order.token].prices[order.price].lower = orderBooks[order.token].prices[pointer].lower;
            /* pointer's lower becomes this order's price */
            orderBooks[order.token].prices[pointer].lower = order.price;
            /* pointer's lower's higher becomes this order's price */
            orderBooks[order.token].prices[orderBooks[order.token].prices[pointer].lower].higher = order.price;
            found = true;
          } else {
            pointer = orderBooks[order.token].prices[pointer].lower;
          }
        }

        orderBooks[order.token].prices[order.price].firstOrder = order.id;
        orderBooks[order.token].prices[order.price].lastOrder = order.id;
        orderBooks[order.token].prices[order.price].orders[order.id].prev = 0;
        orderBooks[order.token].prices[order.price].orders[order.id].next = 0;
      }
    }

    emit NewOrder(order.token, order.owner, order.id, order.sell, order.price, order.amount, order.timestamp);
  }

  function cancelOrder(address _token, uint _price, uint _id) public {
    Order memory order = orderBooks[_token].prices[_price].orders[_id];
    require(order.owner == msg.sender);
    delete orderBooks[_token].prices[_price].orders[_id];
    orderBooks[order.token].prices[order.price].orderCount--;

    /* updating ask/ bid */
    if (order.sell == true) {
      balances[order.token][msg.sender] = balances[order.token][msg.sender].add(order.amount);

      /* update bid price */
      if (order.price == orderBooks[_token].bid && orderBooks[_token].prices[order.price].orderCount == 0) {
        if (orderBooks[_token].prices[order.price].higher != 0) {
          orderBooks[_token].bid = orderBooks[_token].prices[order.price].higher;
        } else {
          orderBooks[_token].bid = 0;
        }
      }
    } else {
      uint etherAmount = (order.price.mul(order.amount)).div(1 ether);
      require(etherAmount > 0);
      balances[0][msg.sender] = balances[0][msg.sender].add(etherAmount);

      /* update ask price */
      if (order.price == orderBooks[_token].ask && orderBooks[_token].prices[order.price].orderCount == 0) {
        if (orderBooks[_token].prices[order.price].lower != 0) {
          orderBooks[_token].ask = orderBooks[_token].prices[order.price].lower;
        } else {
          orderBooks[_token].ask = 0;
        }
      }
    }

    /* update higher, lower, highest, lowest */
    if (order.price == orderBooks[order.token].highest) {
      if (orderBooks[order.token].prices[order.price].orderCount == 0) {
        /* this is the last order of its price */
        orderBooks[order.token].prices[orderBooks[order.token].prices[order.price].lower].higher = 0;
        orderBooks[order.token].highest = orderBooks[order.token].prices[order.price].lower;
      }
    } else if (order.price < orderBooks[order.token].lowest) {
      if (orderBooks[order.token].prices[order.price].orderCount == 0) {
        /* this is the last order of its price */
        orderBooks[order.token].prices[orderBooks[order.token].prices[order.price].higher].lower = 0;
        orderBooks[order.token].lowest = orderBooks[order.token].prices[order.price].higher;
      }
    } else {
      orderBooks[order.token].prices[orderBooks[order.token].prices[order.price].higher].lower = orderBooks[order.token].prices[order.price].lower;
      orderBooks[order.token].prices[orderBooks[order.token].prices[order.price].lower].higher = orderBooks[order.token].prices[order.price].higher;
    }
  }

  function getOrder(address _token, uint _price, uint _id) public constant returns (address owner_, address token_, uint price_, uint amount_, uint timestamp_, uint id_, bool sell_) {
    Order memory order = orderBooks[_token].prices[_price].orders[_id];
    owner_ = order.owner;
    token_ = order.token;
    price_ = order.price;
    amount_ = order.amount;
    timestamp_ = order.timestamp;
    id_ = order.id;
    sell_ = order.sell;
  }

  function getOrderBookInfo(address _token) public constant returns (uint bid_, uint ask_, uint highest_, uint lowest_) {
    OrderBook memory orderBook = orderBooks[_token];
    bid_ = orderBook.bid;
    ask_ = orderBook.ask;
    highest_ = orderBook.highest;
    lowest_ = orderBook.lowest;
  }

  function getPriceInfo(address _token, uint _price) public constant returns (uint orderCount_, uint higher_, uint lower_) {
    Price memory price = orderBooks[_token].prices[_price];
    orderCount_ = price.orderCount;
    higher_ = price.higher;
    lower_ = price.lower;
  }
}

/* TODOS */
/*
  return remaining/ exceeding ether upon order completions
  emit NewTrade events
  update after order executions {
    next
    prev
    higher
    lower
    ask
    bid
    firstOrder
    lastOrder
    highest
    lowest
  }
*/
