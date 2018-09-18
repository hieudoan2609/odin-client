import {
	EXCHANGE_LOGIN,
	EXCHANGE_CURRENT_MARKET,
	EXCHANGE_LOADED,
	EXCHANGE_LOAD_SELLBOOK,
	EXCHANGE_LOAD_BUYBOOK
} from "../actions/types";

const INITIAL_STATE = {
	assets: {
		MKR: {
			symbol: "MKR",
			name: "Maker",
			address: "0x76a86b8172886DE0810E61A75aa55EE74a26e76f",
			balance: {
				available: 0,
				reserve: 0
			}
		},
		BNB: {
			symbol: "BNB",
			name: "Binance",
			address: "0xA39071f60fa2eC4b03749dBA262dCA7f68a43D1B",
			balance: {
				available: 0,
				reserve: 0
			}
		},
		VEN: {
			symbol: "VEN",
			name: "Vechain",
			address: "0x5d8357648858a69b40024A059a880a80fA91221E",
			balance: {
				available: 0,
				reserve: 0
			}
		},
		OMG: {
			symbol: "OMG",
			name: "OmiseGO",
			address: "0xae9DB274a5a797730aCF444540D72d966c9571D7",
			balance: {
				available: 0,
				reserve: 0
			}
		},
		ZRX: {
			symbol: "ZRX",
			name: "0x",
			address: "0xCDA2497F18469b13aDfa3400FBF962667cEd3EB5",
			balance: {
				available: 0,
				reserve: 0
			}
		},
		ZIL: {
			symbol: "ZIL",
			name: "Zilliqa",
			address: "0xD372b24B82Ba42450aF69386F2aDc78e1D300Bc8",
			balance: {
				available: 0,
				reserve: 0
			}
		},
		ICX: {
			symbol: "ICX",
			name: "ICON",
			address: "0x3eb611A29C43393C2DCADEdb28B354F0Cb535253",
			balance: {
				available: 0,
				reserve: 0
			}
		},
		AE: {
			symbol: "AE",
			name: "Aeternity",
			address: "0x1618B59953f0401Ef63C79C16d59546bB6DA4764",
			balance: {
				available: 0,
				reserve: 0
			}
		},
		NPXS: {
			symbol: "NPXS",
			name: "Pundi X",
			address: "0x9D871ef438E67720a0dAFD652646879A5a29c989",
			balance: {
				available: 0,
				reserve: 0
			}
		},
		BAT: {
			symbol: "BAT",
			name: "Basic Attention Token",
			address: "0xc001B0Fd61C2f6159C5eDc5DAB1c597c2ECA7ba1",
			balance: {
				available: 0,
				reserve: 0
			}
		}
	},
	user: "",
	currentMarket: "",
	buyBook: {
		prices: {},
		total: 0
	},
	sellBook: {
		prices: {},
		total: 0
	},
	updateInterval: "",
	loading: true
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case EXCHANGE_LOAD_BUYBOOK:
			return { ...state, buyBook: action.payload };
		case EXCHANGE_LOAD_SELLBOOK:
			return { ...state, sellBook: action.payload };
		case EXCHANGE_CURRENT_MARKET:
			return { ...state, currentMarket: action.payload };
		case EXCHANGE_LOGIN:
			return { ...state, user: action.payload };
		case EXCHANGE_LOADED:
			return { ...state, loading: false };
		default:
			return state;
	}
};
