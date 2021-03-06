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
	EXCHANGE_SET_METAMASK_INTERVAL,
	EXCHANGE_LOGOUT,
	EXCHANGE_WRONG_NETWORK,
	EXCHANGE_INITIALIZE
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
	wrongNetwork: false,
	networkId: 0,
	exchangeAddress: "",
	exchangeInstance: {},
	web3: {},
	metamaskInterval: 0,
	fetchBalanceInterval: 0,
	sellOrders: [],
	buyOrders: [],
	myOrders: [],
	baseAsset: {
		symbol: "ETH",
		name: "Ethereum",
		address: "0x0000000000000000000000000000000000000000",
		availableBalance: 0,
		reserveBalance: 0
	},
	fee: 0,
	assetWeb3Instances: {}
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case EXCHANGE_INITIALIZE:
			return {
				...state,
				web3: action.payload.web3
			};
		case EXCHANGE_WRONG_NETWORK:
			return {
				...state,
				wrongNetwork: true
			};
		case EXCHANGE_LOGOUT:
			return {
				...state,
				user: "",
				unlockMetamask: false,
				installMetamask: false,
				wrongNetwork: false,
				metamaskInterval: 0,
				fetchBalanceInterval: 0,
				assets: action.payload.assets,
				assetsFiltered: action.payload.assetsFiltered,
				baseAsset: action.payload.baseAsset
			};
		case EXCHANGE_SET_METAMASK_INTERVAL:
			return {
				...state,
				metamaskInterval: action.payload
			};
		case EXCHANGE_GO_BACK:
			return {
				...state,
				unlockMetamask: false,
				installMetamask: false,
				wrongNetwork: false
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
				assetsFiltered: action.payload.assetsFiltered,
				search: action.payload.search
			};
		case EXCHANGE_LOAD_TICKS:
			return { ...state, ticks: action.payload };
		case EXCHANGE_LOAD_BUYBOOK:
			return {
				...state,
				buyBook: action.payload.buyBook,
				myOrders: action.payload.myOrders,
				buyOrders: action.payload.buyOrders
			};
		case EXCHANGE_LOAD_SELLBOOK:
			return {
				...state,
				sellBook: action.payload.sellBook,
				myOrders: action.payload.myOrders,
				sellOrders: action.payload.sellOrders
			};
		case EXCHANGE_LOAD_TRADES:
			return {
				...state,
				trades: action.payload
			};
		case EXCHANGE_LOGIN:
			return {
				...state,
				user: action.payload.user,
				fetchBalanceInterval: action.payload.fetchBalanceInterval,
				exchangeInstance: action.payload.exchangeInstance,
				unlockMetamask: false,
				installMetamask: false,
				wrongNetwork: false
			};
		case EXCHANGE_ACCOUNT_LOADED:
			return {
				...state,
				accountLoading: false,
				reloading: false,
				assets: action.payload.assets,
				assetsFiltered: action.payload.assetsFiltered,
				networkId: action.payload.networkId,
				exchangeAddress: action.payload.exchangeAddress,
				assetWeb3Instances: action.payload.assetWeb3Instances
			};
		case EXCHANGE_MARKET_LOADED:
			console.log(action.payload.networkId);
			return {
				...state,
				marketLoading: false,
				reloading: false,
				socket: action.payload.socket,
				assets: action.payload.assets,
				assetsFiltered: action.payload.assetsFiltered,
				sellBook: action.payload.sellBook,
				buyBook: action.payload.buyBook,
				trades: action.payload.trades,
				ticks: action.payload.ticks,
				currentMarket: action.payload.market,
				marketPrices: action.payload.marketPrices,
				networkId: action.payload.networkId,
				exchangeAddress: action.payload.exchangeAddress,
				myOrders: action.payload.myOrders,
				buyOrders: action.payload.buyOrders,
				sellOrders: action.payload.sellOrders,
				exchangeInstance: action.payload.exchangeInstance,
				fee: action.payload.fee
			};
		default:
			return state;
	}
};
