require('dotenv').config();
const helpers = require('./helpers.js');
const Exchange = artifacts.require('Exchange');
const Crowdsale = artifacts.require('Crowdsale');
const {} = require('./helpers');

contract('Exchange', accounts => {
  let exchange;
  let token;
  const etherAddress = '0x0000000000000000000000000000000000000000';
  const feeMake = 100000000000000000;
  const feeTake = 200000000000000000;
  const tokenName = process.env.TOKEN_NAME;
  const tokenSymbol = process.env.TOKEN_SYMBOL;
  const tokenTotalSupply = 1000000000000000000000000000;
  const tokenUnitsOneEthCanBuy = 10000;

  assertPrice = async (token, price, attr, value) => {
    const priceInfo = await exchange.getPriceInfo(token, price);

    if (attr == 'orderCount') {
      assert.equal(priceInfo[0].toNumber(), value);
    } else if (attr == 'higher') {
      assert.equal(priceInfo[1].toNumber(), value);
    } else {
      assert.equal(priceInfo[2].toNumber(), value);
    }
  };

  assertContractEtherBalance = async number => {
    const contractBalance = web3.fromWei((await exchange.balance()).toNumber());
    assert.equal(
      contractBalance,
      number,
      'contract balance is different than expected'
    );
  };

  assertUserBalance = async (token, user, expected) => {
    const userBalance = web3.fromWei(
      (await exchange.balances.call(token, user)).toNumber()
    );
    assert.equal(
      userBalance,
      expected,
      'users balance is not what you expect it to be'
    );
  };

  assertOrderBook = async (token, attr, value) => {
    const orderBookInfo = await exchange.getOrderBookInfo(token);
    if (attr == 'bid') {
      assert.equal(
        web3.fromWei(orderBookInfo[0].toNumber()),
        value,
        `${attr} is different`
      );
    } else if (attr == 'ask') {
      assert.equal(
        web3.fromWei(orderBookInfo[1].toNumber()),
        value,
        `${attr} is different`
      );
    } else if (attr == 'highest') {
      assert.equal(
        web3.fromWei(orderBookInfo[2].toNumber()),
        value,
        `${attr} is different`
      );
    } else {
      assert.equal(
        web3.fromWei(orderBookInfo[3].toNumber()),
        value,
        `${attr} is different`
      );
    }
  };

  beforeEach(async () => {
    exchange = await Exchange.new(feeMake, feeTake);
    token = await Crowdsale.new(
      tokenName,
      tokenSymbol,
      tokenUnitsOneEthCanBuy,
      tokenTotalSupply
    );
  });

  it('should initialize properly', async () => {
    assert.equal(await exchange.owner.call(), accounts[0]);
    assert.equal((await exchange.feeMake.call()).toNumber(), feeMake);
    assert.equal((await exchange.feeTake.call()).toNumber(), feeTake);

    const ETH = await exchange.tokens.call(etherAddress);

    assert.equal(ETH[0], 'Ethereum');
    assert.equal(ETH[1], 'ETH');
  });

  describe('should add and remove tokens if is admin', () => {
    let newToken;

    beforeEach(async () => {
      await exchange.addToken(token.address, tokenName, tokenSymbol);
      newToken = await exchange.tokens.call(token.address);
    });

    it('should add if is admin', async () => {
      assert.equal(newToken[0], tokenName);
      assert.equal(newToken[1], tokenSymbol);
    });

    it('should remove if is admin', async () => {
      await exchange.removeToken(token.address);

      newToken = await exchange.tokens.call(token.address);

      assert.isEmpty(newToken[0]);
      assert.isEmpty(newToken[1]);
    });

    it('should not add duplicated tokens', async () => {
      try {
        assert.fail(
          await exchange.addToken(token.address, tokenName, tokenSymbol)
        );
      } catch (err) {
        assert.equal(
          err.message,
          'VM Exception while processing transaction: revert'
        );
      }
    });

    it('should not remove non-existing tokens', async () => {
      try {
        assert.fail(await exchange.removeToken(accounts[0]));
      } catch (err) {
        assert.equal(
          err.message,
          'VM Exception while processing transaction: revert'
        );
      }
    });
  });

  it('should not add tokens if isnt admin', async () => {
    try {
      assert.fail(
        await exchange.addToken(token.address, tokenName, tokenSymbol, {
          from: accounts[1]
        })
      );
    } catch (err) {
      assert.equal(
        err.message,
        'VM Exception while processing transaction: revert'
      );
    }
  });

  it('should not remove tokens if isnt admin', async () => {
    await exchange.addToken(token.address, tokenName, tokenSymbol);

    try {
      assert.fail(
        await exchange.removeToken(token.address, {
          from: accounts[1]
        })
      );
    } catch (err) {
      assert.equal(
        err.message,
        'VM Exception while processing transaction: revert'
      );
    }
  });

  it('should set new fee if is admin', async () => {
    await exchange.setFeeMake(1231231231);
    await exchange.setFeeTake(6969696969);

    const newMakeFee = await exchange.feeMake.call();
    const newTakeFee = await exchange.feeTake.call();

    assert.equal(newMakeFee, 1231231231);
    assert.equal(newTakeFee, 6969696969);
  });

  it('should not set new fee if is not admin', async () => {
    try {
      assert.fail(await exchange.setFeeMake(1231231231, { from: accounts[1] }));
    } catch (err) {
      assert.equal(
        err.message,
        'VM Exception while processing transaction: revert'
      );
    }

    try {
      assert.fail(await exchange.setFeeTake(1231231231, { from: accounts[1] }));
    } catch (err) {
      assert.equal(
        err.message,
        'VM Exception while processing transaction: revert'
      );
    }
  });

  it('should change ownership if is admin', async () => {
    let owner;

    owner = await exchange.owner.call();
    assert.equal(owner, accounts[0]);

    await exchange.setOwner(accounts[1]);

    owner = await exchange.owner.call();
    assert.notEqual(owner, accounts[0]);
    assert.equal(owner, accounts[1]);
  });

  it('should not change ownership if is not admin', async () => {
    try {
      assert.fail(await exchange.setOwner(accounts[1], { from: accounts[1] }));
    } catch (err) {
      assert.equal(
        err.message,
        'VM Exception while processing transaction: revert'
      );
    }
  });

  it('should retrieve balance', async () => {
    const balance = (await exchange.balances.call(
      etherAddress,
      accounts[0]
    )).toNumber();

    assert.equal(balance, 0);
  });

  it('should deposit eth successfully', async () => {
    const depositWatcher = exchange.Deposit();

    await assertContractEtherBalance(0);

    const oldBalance = (await exchange.balances.call(
      etherAddress,
      accounts[0]
    )).toNumber();
    assert.equal(oldBalance, 0);

    await exchange.deposit(0, web3.toWei(0.5), { value: web3.toWei(0.5) });

    const newBalance = (await exchange.balances.call(
      etherAddress,
      accounts[0]
    )).toNumber();
    assert.equal(web3.fromWei(newBalance), 0.5);

    await assertContractEtherBalance(0.5);

    const depositEvent = depositWatcher.get()[0].args;
    assert.equal(depositEvent.token, etherAddress);
    assert.equal(depositEvent.user, accounts[0]);
    assert.equal(web3.fromWei(depositEvent.amount.toNumber()), 0.5);
  });

  it('should not deposit eth if there is not enough balance', async () => {
    try {
      assert.fail(await exchange.deposit(0, 0, { value: web3.toWei(999999) }));
    } catch (err) {
      assert(
        err.message.includes("sender doesn't have enough funds to send tx")
      );
    }
  });

  it('should deposit tokens successfully', async () => {
    const depositWatcher = exchange.Deposit();

    await assertUserBalance(token.address, accounts[0], 0);

    // approve the exchange to execute transferFrom
    await token.approve(exchange.address, web3.toWei(3));
    const allowance = (await token.allowance(
      accounts[0],
      exchange.address
    )).toNumber();
    assert(allowance, web3.toWei(3));

    await exchange.deposit(token.address, web3.toWei(3));

    await assertUserBalance(token.address, accounts[0], 3);

    const depositEvent = depositWatcher.get()[0].args;
    assert.equal(depositEvent.token, token.address);
    assert.equal(depositEvent.user, accounts[0]);
    assert.equal(web3.fromWei(depositEvent.amount.toNumber()), 3);
    assert.equal(web3.fromWei(depositEvent.balance.toNumber()), 3);
  });

  it('should not deposit tokens if transferFrom() fails', async () => {
    const oldBalance = (await exchange.balances.call(
      token.address,
      accounts[0]
    )).toNumber();
    assert.equal(oldBalance, 0);

    try {
      assert.fail(await exchange.deposit(token.address, web3.toWei(3)));
    } catch (err) {
      assert.equal(
        err.message,
        'VM Exception while processing transaction: revert'
      );
    }

    const newBalance = (await exchange.balances.call(
      token.address,
      accounts[0]
    )).toNumber();
    assert.equal(newBalance, 0);
  });

  it('reject deposit if eth is sent along', async () => {
    await token.approve(exchange.address, web3.toWei(3));

    try {
      assert.fail(
        await exchange.deposit(token.address, web3.toWei(3), {
          value: web3.toWei(10)
        })
      );
    } catch (err) {
      assert.equal(
        err.message,
        'VM Exception while processing transaction: revert'
      );
    }
  });

  it('should reject deposit if msg.value != amount', async () => {
    try {
      assert.fail(
        await exchange.deposit(etherAddress, web3.toWei(1), {
          value: web3.toWei(2)
        })
      );
    } catch (err) {
      assert.equal(
        err.message,
        'VM Exception while processing transaction: revert'
      );
    }
  });

  describe('withdrawal', () => {
    beforeEach(async () => {
      await token.approve(exchange.address, web3.toWei(100));
      // deposit token
      await exchange.deposit(token.address, web3.toWei(100));
      const tokenBalance = web3.fromWei(
        (await exchange.balances.call(token.address, accounts[0])).toNumber()
      );
      assert.equal(tokenBalance, 100);

      // deposit eth
      await exchange.deposit(etherAddress, web3.toWei(1), {
        from: accounts[1],
        value: web3.toWei(1)
      });
      const etherBalance = web3.fromWei(
        (await exchange.balances.call(etherAddress, accounts[1])).toNumber()
      );
      assert.equal(etherBalance, 1);
    });

    it('should withdraw eth with enough balance', async () => {
      const withdrawWatcher = exchange.Withdraw();

      await assertContractEtherBalance(1);

      await exchange.withdraw(etherAddress, web3.toWei(0.5), {
        from: accounts[1]
      });

      await assertContractEtherBalance(0.5);

      const etherBalance = web3.fromWei(
        (await exchange.balances.call(etherAddress, accounts[1])).toNumber()
      );

      assert.equal(etherBalance, 0.5);
      const withdrawEvent = withdrawWatcher.get()[0].args;
      assert.equal(withdrawEvent.token, etherAddress);
      assert.equal(withdrawEvent.user, accounts[1]);
      assert.equal(web3.fromWei(withdrawEvent.amount.toNumber()), 0.5);
      assert.equal(web3.fromWei(withdrawEvent.balance.toNumber()), 0.5);
    });

    it('should not withdraw eth without enough balance', async () => {
      try {
        assert.fail(
          await exchange.withdraw(etherAddress, web3.toWei(5), {
            from: accounts[1]
          })
        );
      } catch (err) {
        assert.equal(
          err.message,
          'VM Exception while processing transaction: revert'
        );
      }
    });

    it('should withdraw tokens with enough balance', async () => {
      await assertUserBalance(token.address, accounts[0], 100);

      const withdrawWatcher = exchange.Withdraw();

      await assertContractEtherBalance(1);

      await exchange.withdraw(token.address, web3.toWei(70));
      const tokenBalance = web3.fromWei(
        (await exchange.balances.call(token.address, accounts[0])).toNumber()
      );
      assert.equal(tokenBalance, 30);

      await assertUserBalance(token.address, accounts[0], 30);

      await assertContractEtherBalance(1);

      const withdrawEvent = withdrawWatcher.get()[0].args;
      assert.equal(withdrawEvent.token, token.address);
      assert.equal(withdrawEvent.user, accounts[0]);
      assert.equal(web3.fromWei(withdrawEvent.amount.toNumber()), 70);
      assert.equal(web3.fromWei(withdrawEvent.balance.toNumber()), 30);
    });

    it('should not withdraw tokens without enough balance', async () => {
      try {
        assert.fail(await exchange.withdraw(token.address, web3.toWei(700)));
      } catch (err) {
        assert.equal(
          err.message,
          'VM Exception while processing transaction: revert'
        );
      }
    });
  });

  describe('orders', () => {
    beforeEach(async () => {
      await token.approve(exchange.address, web3.toWei(10000));
      await exchange.deposit(token.address, web3.toWei(10000));
      await exchange.deposit(0, web3.toWei(1), {
        from: accounts[2],
        value: web3.toWei(1)
      });
    });

    it('should take token when creating orders and reimburse when cancelling', async () => {
      await assertUserBalance(token.address, accounts[0], 10000);

      const orderWatcher = exchange.NewOrder();

      await exchange.createOrder(
        token.address,
        web3.toWei(1800),
        web3.toWei(20),
        true
      );

      await assertUserBalance(token.address, accounts[0], 9980);

      const orderEvent = orderWatcher.get()[0].args;
      assert.equal(orderEvent.token, token.address);
      assert.equal(orderEvent.owner, accounts[0]);
      assert.equal(orderEvent.id.toNumber(), 1);
      assert.equal(orderEvent.sell, true);
      assert.equal(web3.fromWei(orderEvent.price.toNumber()), 1800);
      assert.equal(web3.fromWei(orderEvent.amount.toNumber()), 20);

      await exchange.cancelOrder(
        token.address,
        web3.toWei(1800),
        orderEvent.id
      );

      await assertUserBalance(token.address, accounts[0], 10000);

      // an order cannot be cancelled twice
      try {
        assert.fail(
          await exchange.cancelOrder(
            token.address,
            web3.toWei(1800),
            orderEvent.id
          )
        );
      } catch (err) {
        assert.equal(
          err.message,
          'VM Exception while processing transaction: revert'
        );
      }

      await assertUserBalance(token.address, accounts[0], 10000);
    });

    it('should not create sell orders without enough token', async () => {
      try {
        assert.fail(
          await exchange.createOrder(
            token.address,
            web3.toWei(1800),
            web3.toWei(20000),
            true
          )
        );
      } catch (err) {
        assert.equal(
          err.message,
          'VM Exception while processing transaction: revert'
        );
      }
    });

    it('should take ether when creating buy orders and reimburse when cancelling', async () => {
      await assertUserBalance(0, accounts[2], 1);
      await assertPrice(token.address, web3.toWei(0.002), 'orderCount', 0);

      const orderWatcher = exchange.NewOrder();

      await exchange.createOrder(
        token.address,
        web3.toWei(0.0018),
        web3.toWei(100),
        false,
        { from: accounts[2] }
      );
      await assertPrice(token.address, web3.toWei(0.0018), 'higher', 0);
      await assertPrice(token.address, web3.toWei(0.0018), 'lower', 0);
      await assertOrderBook(token.address, 'bid', 0);
      await assertOrderBook(token.address, 'ask', 0.0018);
      await assertOrderBook(token.address, 'highest', 0.0018);
      await assertOrderBook(token.address, 'lowest', 0);

      await exchange.createOrder(
        token.address,
        web3.toWei(0.0019),
        web3.toWei(100),
        false,
        { from: accounts[2] }
      );
      await assertPrice(
        token.address,
        web3.toWei(0.0018),
        'higher',
        web3.toWei(0.0019)
      );
      await assertPrice(token.address, web3.toWei(0.0018), 'lower', 0);
      await assertPrice(token.address, web3.toWei(0.0019), 'higher', 0);
      await assertPrice(
        token.address,
        web3.toWei(0.0019),
        'lower',
        web3.toWei(0.0018)
      );
      await assertOrderBook(token.address, 'bid', 0);
      await assertOrderBook(token.address, 'ask', 0.0019);
      await assertOrderBook(token.address, 'highest', 0.0019);
      await assertOrderBook(token.address, 'lowest', 0.0018);

      await exchange.createOrder(
        token.address,
        web3.toWei(0.002),
        web3.toWei(100),
        false,
        { from: accounts[2] }
      );
      await assertPrice(
        token.address,
        web3.toWei(0.0018),
        'higher',
        web3.toWei(0.0019)
      );
      await assertPrice(token.address, web3.toWei(0.0018), 'lower', 0);
      await assertPrice(
        token.address,
        web3.toWei(0.0019),
        'higher',
        web3.toWei(0.002)
      );
      await assertPrice(
        token.address,
        web3.toWei(0.0019),
        'lower',
        web3.toWei(0.0018)
      );
      await assertPrice(token.address, web3.toWei(0.002), 'higher', 0);
      await assertPrice(
        token.address,
        web3.toWei(0.002),
        'lower',
        web3.toWei(0.0019)
      );
      await assertOrderBook(token.address, 'bid', 0);
      await assertOrderBook(token.address, 'ask', 0.002);
      await assertOrderBook(token.address, 'highest', 0.002);
      await assertOrderBook(token.address, 'lowest', 0.0018);

      await assertPrice(token.address, web3.toWei(0.002), 'orderCount', 1);

      await assertUserBalance(0, accounts[2], 0.43);

      const orderEvent = orderWatcher.get()[0].args;
      assert.equal(orderEvent.token, token.address);
      assert.equal(orderEvent.owner, accounts[2]);
      assert.equal(orderEvent.id.toNumber(), 3);
      assert.equal(orderEvent.sell, false);
      assert.equal(web3.fromWei(orderEvent.price.toNumber()), 0.002);
      assert.equal(web3.fromWei(orderEvent.amount.toNumber()), 100);

      await exchange.cancelOrder(
        token.address,
        web3.toWei(0.002),
        orderEvent.id,
        { from: accounts[2] }
      );
      await assertOrderBook(token.address, 'bid', 0);
      await assertOrderBook(token.address, 'ask', 0.0019);
      await assertOrderBook(token.address, 'highest', 0.0019);
      await assertOrderBook(token.address, 'lowest', 0.0018);
      await assertPrice(token.address, web3.toWei(0.0019), 'higher', 0);
      await assertPrice(
        token.address,
        web3.toWei(0.0019),
        'lower',
        web3.toWei(0.0018)
      );

      await assertPrice(token.address, web3.toWei(0.002), 'orderCount', 0);

      await assertUserBalance(0, accounts[2], 0.63);

      // an order cannot be cancelled twice
      try {
        assert.fail(
          await exchange.cancelOrder(
            token.address,
            web3.toWei(0.002),
            orderEvent.id,
            { from: accounts[2] }
          )
        );
      } catch (err) {
        assert.equal(
          err.message,
          'VM Exception while processing transaction: revert'
        );
      }

      await assertUserBalance(0, accounts[2], 0.63);

      await exchange.createOrder(
        token.address,
        web3.toWei(0.002),
        web3.toWei(100),
        false,
        { from: accounts[2] }
      );
      await exchange.cancelOrder(token.address, web3.toWei(0.0019), 2, {
        from: accounts[2]
      });
      await assertOrderBook(token.address, 'bid', 0);
      await assertOrderBook(token.address, 'ask', 0.002);
      await assertOrderBook(token.address, 'highest', 0.002);
      await assertOrderBook(token.address, 'lowest', 0.0018);
      await assertPrice(
        token.address,
        web3.toWei(0.0018),
        'higher',
        web3.toWei(0.002)
      );
      await assertPrice(
        token.address,
        web3.toWei(0.002),
        'lower',
        web3.toWei(0.0018)
      );
    });

    it('should not cancel if msg.sender != owner', async () => {
      await exchange.createOrder(
        token.address,
        web3.toWei(0.002),
        web3.toWei(100),
        false,
        { from: accounts[2] }
      );

      try {
        assert.fail(
          await exchange.cancelOrder(token.address, web3.toWei(0.002), 1, {
            from: accounts[3]
          })
        );
      } catch (err) {
        assert.equal(
          err.message,
          'VM Exception while processing transaction: revert'
        );
      }
    });
  });

  describe('matching engine', () => {
    beforeEach(async () => {
      await token.approve(exchange.address, web3.toWei(10000));
      await exchange.deposit(token.address, web3.toWei(10000));
      await exchange.deposit(0, web3.toWei(1), {
        from: accounts[2],
        value: web3.toWei(1)
      });
    });

    it('should match one or multiple', async () => {
      const orderWatcher = exchange.NewOrder();
      let orderEvent;
      let order;
      await assertUserBalance(token.address, accounts[0], 10000);

      // create sell orders & assert the orders were created with the right input
      await exchange.createOrder(
        token.address,
        web3.toWei(0.0003),
        web3.toWei(20),
        true
      );
      orderEvent = orderWatcher.get()[0].args;
      assert.equal(orderEvent.id.toNumber(), 1);
      order = await exchange.getOrder(
        orderEvent.token,
        orderEvent.price.toNumber(),
        orderEvent.id.toNumber()
      );
      assert.equal(order[5].toNumber(), 1);

      await exchange.createOrder(
        token.address,
        web3.toWei(0.0004),
        web3.toWei(20),
        true
      );
      orderEvent = orderWatcher.get()[0].args;
      assert.equal(orderEvent.id.toNumber(), 2);

      await exchange.createOrder(
        token.address,
        web3.toWei(0.0005),
        web3.toWei(20),
        true
      );
      orderEvent = orderWatcher.get()[0].args;
      assert.equal(orderEvent.id.toNumber(), 3);

      await assertUserBalance(token.address, accounts[0], 9940);
      await assertUserBalance(0, accounts[2], 1);

      await assertOrderBook(token.address, 'bid', 0.0003);
      await assertOrderBook(token.address, 'ask', 0);

      // create a buy order, assert its input, fill up existing sell orders
      await exchange.createOrder(
        token.address,
        web3.toWei(0.001),
        web3.toWei(100),
        false,
        { from: accounts[2] }
      );
      orderEvent = orderWatcher.get()[0].args;
      assert.equal(orderEvent.id.toNumber(), 4);

      await assertUserBalance(0, accounts[2], 0.9);
      // await assertOrderBook(token.address, 'ask', 0.001);
      // await assertOrderBook(token.address, 'bid', 0);

      // create another sell order, filling up remaining amount in previous buy order
      await exchange.createOrder(
        token.address,
        web3.toWei(0.0005),
        web3.toWei(100),
        true
      );
      orderEvent = orderWatcher.get()[0].args;
      assert.equal(orderEvent.id.toNumber(), 5);
      // await assertOrderBook(token.address, 'ask', 0);
      // await assertOrderBook(token.address, 'bid', 0.0005);
    });
  });
});
