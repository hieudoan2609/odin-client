require("dotenv").config();
const Migrations = artifacts.require("./Migrations.sol");
const Token = artifacts.require("./Token.sol");
const Exchange = artifacts.require("./Exchange.sol");

module.exports = function(deployer) {
	deployer.deploy(Migrations);

	// Token initial arguments
	const name = process.env.TOKEN_NAME;
	const symbol = process.env.TOKEN_SYMBOL;
	const totalSupply = 1000000000000000000000000000;
	const unitsOneEthCanBuy = 10000;
	deployer.deploy(Token, name, symbol, unitsOneEthCanBuy, totalSupply);

	deployer.deploy(Exchange);
};
