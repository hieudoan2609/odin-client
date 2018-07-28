require('dotenv').config();
const Crowdsale = artifacts.require('Crowdsale');

module.exports = function(deployer) {
  const name = process.env.TOKEN_NAME;
  const symbol = process.env.TOKEN_SYMBOL;
  const totalSupply = 1000000000000000000000000000;
  const unitsOneEthCanBuy = 10000;

  deployer.deploy(Crowdsale, name, symbol, unitsOneEthCanBuy, totalSupply);
};
