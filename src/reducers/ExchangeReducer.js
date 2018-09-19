import {
	EXCHANGE_LOGIN,
	EXCHANGE_CURRENT_MARKET,
	EXCHANGE_LOADED,
	EXCHANGE_LOAD_SELLBOOK,
	EXCHANGE_LOAD_BUYBOOK
} from "../actions/types";

const INITIAL_STATE = {
	assets: "",
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
	socket: "",
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
			return {
				...state,
				loading: false,
				socket: action.payload.socket,
				currentMarket: action.payload.market,
				assets: action.payload.assets
			};
		default:
			return state;
	}
};
