import {
	EXCHANGE_LOGIN,
	EXCHANGE_MARKET_LOADED,
	EXCHANGE_ACCOUNT_LOADED,
	EXCHANGE_LOAD_BUYBOOK,
	EXCHANGE_LOAD_SELLBOOK,
	EXCHANGE_LOAD_TRADES,
	EXCHANGE_LOAD_TICKS,
	EXCHANGE_FILTER_ASSETS,
	EXCHANGE_LEAVE_PAGE,
	EXCHANGE_NEW_MARKET_PRICES
} from "../actions/types";

const INITIAL_STATE = {
	assets: {},
	marketPrices: {},
	assetsFiltered: {},
	user: "",
	buyBook: {
		prices: {},
		total: 0
	},
	sellBook: {
		prices: {},
		total: 0
	},
	trades: [],
	socket: {},
	ticks: [],
	search: "",
	currentMarket: "",
	loading: true
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case EXCHANGE_NEW_MARKET_PRICES:
			return {
				...state,
				marketPrices: action.payload
			};
		case EXCHANGE_LEAVE_PAGE:
			return {
				...state,
				loading: true
			};
		case EXCHANGE_FILTER_ASSETS:
			return {
				...state,
				assetsFiltered: action.payload.filteredAssets,
				search: action.payload.search
			};
		case EXCHANGE_LOAD_TICKS:
			return { ...state, ticks: action.payload };
		case EXCHANGE_LOAD_BUYBOOK:
			return { ...state, buyBook: action.payload };
		case EXCHANGE_LOAD_SELLBOOK:
			return { ...state, sellBook: action.payload };
		case EXCHANGE_LOAD_TRADES:
			return {
				...state,
				trades: action.payload
			};
		case EXCHANGE_LOGIN:
			return { ...state, user: action.payload };
		case EXCHANGE_ACCOUNT_LOADED:
			return {
				...state,
				loading: false,
				assets: action.payload
			};
		case EXCHANGE_MARKET_LOADED:
			return {
				...state,
				loading: false,
				socket: action.payload.socket,
				assets: action.payload.assets,
				assetsFiltered: action.payload.assets,
				sellBook: action.payload.sellBook,
				buyBook: action.payload.buyBook,
				trades: action.payload.trades,
				ticks: action.payload.ticks,
				currentMarket: action.payload.market,
				marketPrices: action.payload.marketPrices
			};
		default:
			return state;
	}
};
