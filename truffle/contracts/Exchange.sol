pragma solidity ^0.4.22;

import 'openzeppelin-solidity/contracts/math/SafeMath.sol';
import 'openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol';
import './RedBlackTree.sol';

contract Exchange {
	using SafeMath for uint;
	using RedBlackTree for RedBlackTree.Tree;

	struct Token {
		string name;
		string symbol;
	}

	struct Balance {
        uint reserved;
        uint available;
    }

    address public owner;

    mapping (address => Token) public tokens;
    mapping (address => mapping (address => Balance)) public balances;

    event Deposit(address token, address user, uint amount, uint balance);
	event Withdraw(address token, address user, uint amount, uint balance);

	modifier isOwner {
		require(msg.sender == owner);
		_;
	}

	constructor() public {
		owner = msg.sender;
		tokens[0].name = 'Ethereum';
		tokens[0].symbol = 'ETH';
	}

	function addToken(address _address, string _name, string _symbol) public isOwner {
		tokens[_address].name = _name;
		tokens[_address].symbol = _symbol;
	}

	function removeToken(address _address) public isOwner {
		delete tokens[_address];
	}
}

