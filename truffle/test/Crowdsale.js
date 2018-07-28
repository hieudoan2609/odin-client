require('dotenv').config();
const helpers = require('./helpers.js');
const Crowdsale = artifacts.require('Crowdsale');

contract('Crowdsale', accounts => {
  const name = process.env.TOKEN_NAME;
  const symbol = process.env.TOKEN_SYMBOL;
  const totalSupply = 1000000000000000000000000000;
  const unitsOneEthCanBuy = 10000;
  let crowdsale;

  beforeEach(async () => {
    crowdsale = await Crowdsale.new(
      name,
      symbol,
      unitsOneEthCanBuy,
      totalSupply
    );
  });

  it('should instantiate correctly', async () => {
    assert.equal(await crowdsale.owner.call(), accounts[0]);
    assert.equal(await crowdsale.name.call(), name);
    assert.equal(await crowdsale.symbol.call(), symbol);
    assert.equal((await crowdsale.totalSupply.call()).toNumber(), totalSupply);
    assert.equal(
      (await crowdsale.unitsOneEthCanBuy.call()).toNumber(),
      unitsOneEthCanBuy
    );
    assert.equal(
      (await crowdsale.balanceOf(accounts[0])).toNumber(),
      totalSupply
    );
  });

  it('should return the crowdsale token upon receiving eth', async () => {
    let contractEthBalance = (await crowdsale.totalEthInWei.call()).toNumber();
    let buyerTokenBalance = (await crowdsale.balanceOf(accounts[1])).toNumber();
    let adminTokenBalance = (await crowdsale.balanceOf(accounts[0])).toNumber();
    const adminEthBalance = (await web3.eth.getBalance(accounts[0])).toNumber();
    assert.equal(contractEthBalance, 0);
    assert.equal(buyerTokenBalance, 0);
    assert.equal(adminTokenBalance, totalSupply);

    await web3.eth.sendTransaction({
      from: accounts[1],
      to: crowdsale.address,
      value: web3.toWei(3)
    });

    contractEthBalance = (await crowdsale.totalEthInWei.call()).toNumber();
    buyerTokenBalance = (await crowdsale.balanceOf(accounts[1])).toNumber();
    adminTokenBalance = (await crowdsale.balanceOf(accounts[0])).toNumber();
    const adminEthBalance2 = (await web3.eth.getBalance(
      accounts[0]
    )).toNumber();
    assert.equal(
      contractEthBalance,
      web3.toWei(3),
      'contracts eth balance isnt 3 eth'
    );
    assert.equal(
      buyerTokenBalance,
      web3.toWei(3) * unitsOneEthCanBuy,
      'buyers token balance isnt ether * 10'
    );
    assert.equal(
      adminTokenBalance,
      totalSupply - web3.toWei(3) * unitsOneEthCanBuy,
      'admins token balance hasnt reduced by ether * 10'
    );
    assert.equal(adminEthBalance + parseFloat(web3.toWei(3)), adminEthBalance2);
  });

  it('should not accept eth if there isnt enough token to return', async () => {
    const buyerInitalEthBalance = (await web3.eth.getBalance(
      accounts[1]
    )).toNumber();

    await crowdsale.transfer(accounts[2], totalSupply);

    try {
      await web3.eth.sendTransaction({
        from: accounts[1],
        to: crowdsale.address,
        value: web3.toWei(3)
      });
    } catch (err) {
      assert.equal(
        err.message,
        'VM Exception while processing transaction: revert'
      );
    }

    const buyerAfterEthBalance = (await web3.eth.getBalance(
      accounts[1]
    )).toNumber();

    assert(
      buyerAfterEthBalance >= buyerInitalEthBalance - 100000,
      'final balance has gone down significantly'
    );
  });
});
