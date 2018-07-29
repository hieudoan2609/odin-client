const INITIAL_STATE = {
  pairs: [
    'USD_BTC',
    'LTC_BTC',
    'XRP_BTC',
    'ETH_BTC',
    'XMR_BTC',
    'NANO_BTC',
    'NEO_BTC',
    'NEM_BTC',
    'BCH_BTC',
    'EOS_BTC',
    'XML_BTC',
    'IOTA_BTC'
  ]
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    default:
      return state;
  }
};
