require('dotenv').config();
const HDWalletProvider = require('truffle-hdwallet-provider');

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*'
    },
    'rinkeby-infura': {
      provider: () =>
        new HDWalletProvider(
          process.env.RINKEBY_MNEMONIC,
          'https://rinkeby.infura.io/pVTvEWYTqXvSRvluzCCe'
        ),
      network_id: '4',
      gas: 4700000
    }
  }
};
