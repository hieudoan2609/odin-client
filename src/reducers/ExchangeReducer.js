import {
	EXCHANGE_LOGIN,
	EXCHANGE_CURRENT_MARKET,
	EXCHANGE_LOADED,
	EXCHANGE_LOAD_BUYBOOK,
	EXCHANGE_LOAD_SELLBOOK,
	EXCHANGE_LOAD_TRADES,
	EXCHANGE_LOAD_TICKS,
	EXCHANGE_FILTER_ASSETS
} from "../actions/types";

const INITIAL_STATE = {
	assets: {},
	assetsFiltered: {},
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
	trades: [],
	socket: {},
	ticks: [],
	search: "",
	loading: true
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
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
				trades: action.payload.trades,
				assets: action.payload.assets
			};
		case EXCHANGE_CURRENT_MARKET:
			return { ...state, currentMarket: action.payload };
		case EXCHANGE_LOGIN:
			return { ...state, user: action.payload };
		case EXCHANGE_LOADED:
			return {
				...state,
				loading: false,
				socket: action.payload.socket,
				currentMarket: action.payload.market,
				assets: action.payload.assets,
				assetsFiltered: action.payload.assets,
				sellBook: action.payload.sellBook,
				buyBook: action.payload.buyBook,
				trades: action.payload.trades,
				ticks: action.payload.ticks
			};
		default:
			return state;
	}
};
