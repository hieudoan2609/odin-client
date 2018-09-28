import {
	EXCHANGE_LOGIN,
	EXCHANGE_MARKET_LOADED,
	EXCHANGE_ACCOUNT_LOADED,
	EXCHANGE_LOAD_BUYBOOK,
	EXCHANGE_LOAD_SELLBOOK,
	EXCHANGE_LOAD_TRADES,
	EXCHANGE_LOAD_TICKS,
	EXCHANGE_FILTER_ASSETS,
	EXCHANGE_RELOAD,
	EXCHANGE_NEW_MARKET_PRICES,
	EXCHANGE_INSTALL_METAMASK,
	EXCHANGE_UNLOCK_METAMASK,
	EXCHANGE_GO_BACK,
	EXCHANGE_SET_INTERVAL,
	EXCHANGE_LOGOUT
} from "../actions/types";

const INITIAL_STATE = {
	assets: {},
	marketPrices: {},
	assetsFiltered: {},
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
	marketLoading: true,
	accountLoading: true,
	reloading: true,
	user: "",
	unlockMetamask: false,
	installMetamask: false,
	interval: 0,
	orders: [],
	myOrders: []
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case EXCHANGE_LOGOUT:
			return {
				...state,
				user: "",
				unlockMetamask: false,
				installMetamask: false,
				interval: 0
			};
		case EXCHANGE_SET_INTERVAL:
			return {
				...state,
				interval: action.payload
			};
		case EXCHANGE_GO_BACK:
			return {
				...state,
				unlockMetamask: false,
				installMetamask: false
			};
		case EXCHANGE_INSTALL_METAMASK:
			return {
				...state,
				installMetamask: true
			};
		case EXCHANGE_UNLOCK_METAMASK:
			return {
				...state,
				user: "",
				unlockMetamask: true
			};
		case EXCHANGE_NEW_MARKET_PRICES:
			return {
				...state,
				marketPrices: action.payload
			};
		case EXCHANGE_RELOAD:
			return {
				...state,
				reloading: true
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
			return {
				...state,
				user: action.payload,
				unlockMetamask: false,
				installMetamask: false
			};
		case EXCHANGE_ACCOUNT_LOADED:
			return {
				...state,
				accountLoading: false,
				reloading: false,
				assets: action.payload,
				assetsFiltered: action.payload
			};
		case EXCHANGE_MARKET_LOADED:
			return {
				...state,
				marketLoading: false,
				reloading: false,
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
