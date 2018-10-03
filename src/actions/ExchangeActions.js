import Web3 from "web3";
import {
	EXCHANGE_ACCOUNT_LOADED,
	EXCHANGE_MARKET_LOADED,
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
	EXCHANGE_LOGIN,
	EXCHANGE_SET_METAMASK_INTERVAL,
	EXCHANGE_LOGOUT,
	EXCHANGE_WRONG_NETWORK,
	EXCHANGE_INITIALIZE
} from "./types";
import io from "socket.io-client";
import axios from "axios";
import { round, roundFixed } from "../helpers";
import moment from "moment";
import { tsvParse } from "d3-dsv";
import store from "../store";
import exchangeAbi from "../contracts/ExchangePure.json";
import tokenAbi from "../contracts/Token.json";

const initializeWeb3 = () => {
	const infura = process.env.INFURA
		? process.env.INFURA
		: "https://rinkeby.infura.io/pVTvEWYTqXvSRvluzCCe";
	const web3 = new Web3(Web3.givenProvider || infura);

	if (web3.currentProvider.publicConfigStore) {
		web3.currentProvider.publicConfigStore.on("update", data => {
			updateWeb3Account(store.dispatch, data);
		});
	}

	return web3;
};
const web3 = initializeWeb3();

const updateWeb3Account = (dispatch, data) => {
	var {
		user,
		metamaskInterval,
		fetchBalanceInterval
	} = store.getState().exchange;
	var { selectedAddress } = data;
	if (
		user &&
		user.toLowerCase().trim() !== selectedAddress.toLowerCase().trim()
	) {
		logout();
	}
};

export const login = user => {
	return async dispatch => {
		if (!Web3.givenProvider || !Web3.givenProvider.isMetaMask) {
			// metamask not installed
			dispatch({
				type: EXCHANGE_INSTALL_METAMASK
			});
		} else {
			var { networkId } = store.getState().exchange;
			var currentNetworkId = await web3.eth.net.getId();
			var accounts = await web3.eth.getAccounts();

			if (accounts.length === 0) {
				// metamask installed but locked
				listenForMetamask(dispatch);
				dispatch({
					type: EXCHANGE_UNLOCK_METAMASK
				});
			} else if (networkId !== currentNetworkId) {
				// metamask installed but on the wrong network
				listenForMetamask(dispatch);
				dispatch({
					type: EXCHANGE_WRONG_NETWORK
				});
			} else {
				// metamask is installed and unlocked
				var user = accounts[0];
				var reload = true;
				listenForMetamask(dispatch);
				fetchAccountWithUser(dispatch, user, reload);
			}
		}
	};
};

const fetchAccountWithUser = async (dispatch, user, reload) => {
	if (reload) {
		dispatch({
			type: EXCHANGE_RELOAD
		});
	}

	var {
		exchangeAddress,
		assets,
		networkId,
		baseAsset
	} = store.getState().exchange;
	var exchangeInstance = new web3.eth.Contract(exchangeAbi, exchangeAddress);
	await fetchBalance(
		dispatch,
		user,
		assets,
		baseAsset,
		exchangeInstance,
		networkId,
		exchangeAddress
	);
	var fetchBalanceInterval = setInterval(
		fetchBalance,
		10000,
		dispatch,
		user,
		assets,
		baseAsset,
		exchangeInstance,
		networkId,
		exchangeAddress
	);

	dispatch({
		type: EXCHANGE_LOGIN,
		payload: { user, fetchBalanceInterval, exchangeInstance }
	});
};

const fetchBalance = (
	dispatch,
	user,
	assets,
	baseAsset,
	exchangeInstance,
	networkId,
	exchangeAddress
) => {
	return new Promise(async (resolve, reject) => {
		var assetsFiltered = {};
		for (let asset in assets) {
			var balances = await exchangeInstance.methods
				.getBalance(assets[asset].address, user)
				.call();

			assets[asset].availableBalance = web3.utils.fromWei(
				balances.available.toString()
			);
			assets[asset].reserveBalance = web3.utils.fromWei(
				balances.reserved.toString()
			);
			assetsFiltered[asset] = assets[asset];
		}

		var baseAssetBalances = await exchangeInstance.methods
			.getBalance(baseAsset.address, user)
			.call();
		baseAsset.availableBalance = web3.utils.fromWei(
			baseAssetBalances.available.toString()
		);
		baseAsset.reserveBalance = web3.utils.fromWei(
			baseAssetBalances.reserved.toString()
		);
		assetsFiltered[baseAsset.symbol] = baseAsset;

		var assetWeb3Instances = {};
		for (var asset in assetsFiltered) {
			assetWeb3Instances[asset] = new web3.eth.Contract(
				tokenAbi,
				assetsFiltered[asset].address
			);
		}

		dispatch({
			type: EXCHANGE_ACCOUNT_LOADED,
			payload: {
				assets,
				networkId,
				exchangeAddress,
				assetsFiltered,
				baseAsset,
				assetWeb3Instances
			}
		});

		resolve();
	});
};

export const logout = () => {
	var { metamaskInterval, fetchBalanceInterval } = store.getState().exchange;

	clearInterval(metamaskInterval);
	clearInterval(fetchBalanceInterval);

	var { assets } = store.getState().exchange;
	var assetsFiltered = {};
	for (let asset in assets) {
		assets[asset].availableBalance = 0;
		assets[asset].reserveBalance = 0;
		assetsFiltered[asset] = assets[asset];
	}
	var { baseAsset } = store.getState().exchange;
	baseAsset.availableBalance = 0;
	baseAsset.reserveBalance = 0;
	assetsFiltered[baseAsset.symbol] = baseAsset;

	store.dispatch({
		type: EXCHANGE_LOGOUT,
		payload: { assets, assetsFiltered, baseAsset }
	});
};

export const listenForMetamask = dispatch => {
	var interval = setInterval(async function() {
		var { user, reloading, networkId } = store.getState().exchange;
		var currentNetworkId = await web3.eth.net.getId();
		var accounts = await web3.eth.getAccounts();

		if (accounts.length === 0) {
			dispatch({
				type: EXCHANGE_UNLOCK_METAMASK
			});
		} else if (networkId !== currentNetworkId) {
			dispatch({
				type: EXCHANGE_WRONG_NETWORK
			});
		} else {
			if (!user && !reloading) {
				user = accounts[0];
				var reload = true;
				fetchAccountWithUser(dispatch, user, reload);
			}
		}
	}, 3000);

	dispatch({
		type: EXCHANGE_SET_METAMASK_INTERVAL,
		payload: interval
	});
};

export const goBack = interval => {
	clearInterval(interval);

	return {
		type: EXCHANGE_GO_BACK
	};
};

export const fetchAccount = () => {
	return async dispatch => {
		var state = store.getState().exchange;
		var networkId = state.networkId;
		var exchangeAddress = state.exchangeAddress;
		if (!networkId || !exchangeAddress) {
			var constants = (await axios.get(
				process.env.ADDRESSES ||
					"https://raw.githubusercontent.com/odintrade/odin-trade/master/public/constants.json"
			)).data;
			networkId = constants.networkId;
			exchangeAddress = constants.exchangeAddress;
		}
		var assets = (await axios.get("/assets.json")).data;
		var assetsFiltered = {};
		for (let asset in assets) {
			assets[asset].availableBalance = 0;
			assets[asset].reserveBalance = 0;
			assetsFiltered[asset] = assets[asset];
		}
		var { baseAsset } = store.getState().exchange;
		assetsFiltered[baseAsset.symbol] = baseAsset;

		if (!state.accountLoading) {
			assets = state.assets;
			assetsFiltered = state.assetsFiltered;
		}

		var assetWeb3Instances = {};
		for (var asset in assetsFiltered) {
			assetWeb3Instances[asset] = new web3.eth.Contract(
				tokenAbi,
				assetsFiltered[asset].address
			);
		}

		dispatch({
			type: EXCHANGE_ACCOUNT_LOADED,
			payload: {
				assets,
				networkId,
				exchangeAddress,
				assetsFiltered,
				assetWeb3Instances
			}
		});
	};
};

export const fetchMarket = (market, assets, socket) => {
	return async dispatch => {
		if (!Object.keys(socket).length) {
			socket = io(
				process.env.REACT_APP_SOCKET_URL || "https://socket.odin.trade"
			);
		}

		socket.removeAllListeners();

		var state = store.getState().exchange;
		var myOrders, orders, user, networkId, exchangeAddress;

		socket.on(market, async res => {
			let buyOrders, sellOrders, buyBook, sellBook, trades, ticks;
			switch (res.type) {
				case "trades":
					trades = await processTrades(res.market);
					dispatch({
						type: EXCHANGE_LOAD_TRADES,
						payload: trades
					});
					console.log("new trades", res);
					break;
				case "buyOrders":
					buyBook = await processBuyBook(res.market);

					({ myOrders, user } = store.getState().exchange);
					sellOrders = myOrders.filter(order => order.sell);
					orders = res.market;
					myOrders = filterMyOrders(orders, user);
					myOrders = myOrders.concat(sellOrders);
					sortOrders(myOrders);

					if (!user) {
						myOrders = [];
					}

					buyOrders = res.market.buyOrders;

					dispatch({
						type: EXCHANGE_LOAD_BUYBOOK,
						payload: { buyBook, myOrders, buyOrders }
					});
					console.log("new buy orders", res);
					break;
				case "sellOrders":
					sellBook = await processSellBook(res.market);

					({ myOrders, user } = store.getState().exchange);
					buyOrders = myOrders.filter(order => !order.sell);
					orders = res.market;
					myOrders = filterMyOrders(orders, user);
					myOrders = myOrders.concat(buyOrders);
					sortOrders(myOrders);

					if (!user) {
						myOrders = [];
					}

					sellOrders = res.market.sellOrders;

					dispatch({
						type: EXCHANGE_LOAD_SELLBOOK,
						payload: { sellBook, myOrders, sellOrders }
					});
					console.log("new sell orders", res);
					break;
				case "tick":
					ticks = await getChartData(market);
					dispatch({
						type: EXCHANGE_LOAD_TICKS,
						payload: ticks
					});
					console.log(`new tick for ${market}`, res);
					break;
				default:
					({ networkId, exchangeAddress, user } = store.getState().exchange);

					if (!networkId || !exchangeAddress) {
						var constants = (await axios.get(
							process.env.ADDRESSES ||
								"https://raw.githubusercontent.com/odintrade/odin-trade/master/public/constants.json"
						)).data;
						networkId = constants.networkId;
						exchangeAddress = constants.exchangeAddress;
					}

					buyBook = await processBuyBook(res.market.buyOrders);
					sellBook = await processSellBook(res.market.sellOrders);
					trades = await processTrades(res.market.trades);
					ticks = await getChartData(market);
					var marketPrices = {};

					var assetsFiltered = {};
					for (let asset in assets) {
						marketPrices[asset] = {};
						marketPrices[asset].currentPrice = roundFixed(
							web3.utils.fromWei(res.markets[asset].currentPrice.toString())
						);
						marketPrices[asset].previousPrice = roundFixed(
							web3.utils.fromWei(res.markets[asset].previousPrice.toString())
						);
						assets[asset].availableBalance = 0;
						assets[asset].reserveBalance = 0;
						assetsFiltered[asset] = assets[asset];
					}
					var { baseAsset } = store.getState().exchange;
					assetsFiltered[baseAsset.symbol] = baseAsset;

					if (!state.accountLoading) {
						assets = state.assets;
						assetsFiltered = state.assetsFiltered;
					}

					orders = res.market.buyOrders.concat(res.market.sellOrders);
					myOrders = filterMyOrders(orders, user);
					sortOrders(myOrders);

					if (!user) {
						myOrders = [];
					}

					var exchangeInstance = new web3.eth.Contract(
						exchangeAbi,
						exchangeAddress
					);
					var fee = web3.utils.fromWei(
						await exchangeInstance.methods.fees(0).call()
					);

					buyOrders = res.market.buyOrders;
					sellOrders = res.market.sellOrders;

					dispatch({
						type: EXCHANGE_MARKET_LOADED,
						payload: {
							socket,
							market,
							assets,
							marketPrices,
							sellBook,
							buyBook,
							trades,
							ticks,
							networkId,
							exchangeAddress,
							assetsFiltered,
							myOrders,
							buyOrders,
							sellOrders,
							exchangeInstance,
							fee
						}
					});
			}
		});

		socket.on("prices", async res => {
			console.log("new prices", res);
			for (let asset in assets) {
				assets[asset].currentPrice = roundFixed(
					web3.utils.fromWei(res[asset].currentPrice.toString())
				);
				assets[asset].previousPrice = roundFixed(
					web3.utils.fromWei(res[asset].previousPrice.toString())
				);
			}
			dispatch({
				type: EXCHANGE_NEW_MARKET_PRICES,
				payload: assets
			});
		});

		socket.emit("getMarket", { market });
	};
};

const sortOrders = orders => {
	orders.sort((a, b) => {
		return parseFloat(b.price) - parseFloat(a.price);
	});
};

const filterMyOrders = (orders, user) => {
	return orders.filter(
		order => order.user.toLowerCase().trim() === user.toLowerCase().trim()
	);
};

const processBuyBook = orders => {
	return new Promise(async (resolve, reject) => {
		let buyBook = {
			prices: {},
			total: 0
		};
		orders.forEach(order => {
			const price = round(parseFloat(web3.utils.fromWei(order.price)));
			const prevAmount = buyBook.prices[price]
				? parseFloat(buyBook.prices[price].amount)
				: 0;
			const amount = parseFloat(web3.utils.fromWei(order.amount)) + prevAmount;
			const total = price * amount;
			buyBook.prices[price] = { amount, total };
		});
		for (const price in buyBook.prices) {
			buyBook.total += parseFloat(buyBook.prices[price].amount);
		}
		resolve(buyBook);
	});
};

const processSellBook = async orders => {
	return new Promise(async (resolve, reject) => {
		let sellBook = {
			prices: {},
			total: 0
		};
		orders.forEach(order => {
			const price = round(parseFloat(web3.utils.fromWei(order.price)));
			const prevAmount = sellBook.prices[price]
				? parseFloat(sellBook.prices[price].amount)
				: 0;
			const amount = parseFloat(web3.utils.fromWei(order.amount)) + prevAmount;
			const total = price * amount;
			sellBook.prices[price] = { amount, total };
		});
		for (const price in sellBook.prices) {
			sellBook.total += parseFloat(sellBook.prices[price].amount);
		}
		resolve(sellBook);
	});
};

const processTrades = async trades => {
	return new Promise(async (resolve, reject) => {
		trades.sort((a, b) => {
			return b.timestamp - a.timestamp;
		});
		let processedTrades = [];
		for (let trade of trades) {
			const type = trade.sell ? "sell" : "buy";
			const date = moment(new Date(trade.timestamp * 1000)).format(
				"YYYY-MM-DD HH:mm:ss"
			);
			const price = web3.utils.fromWei(trade.price);
			const amount = web3.utils.fromWei(trade.amount);
			const total = round(price * amount);
			processedTrades.push({ type, date, price, amount, total });
		}
		resolve(processedTrades);
	});
};

const getChartData = async market => {
	return new Promise(async (resolve, reject) => {
		const dataUrl =
			process.env.CHART_DATA_URL ||
			`https://socket.odin.trade/marketData/${market}.tsv`;

		let res;
		try {
			res = await axios.get(dataUrl);
		} catch (err) {
			resolve();
			return;
		}

		const ticks = tsvParse(res.data, parseData());

		resolve(ticks);
	});
};

function parseData() {
	return function(d) {
		const date = new Date(parseInt(d.date, 10));
		d.date = date;
		d.open = +web3.utils.fromWei(d.open);
		d.high = +web3.utils.fromWei(d.high);
		d.low = +web3.utils.fromWei(d.low);
		d.close = +web3.utils.fromWei(d.close);
		d.volume = +d.volume;

		return d;
	};
}

export const filterAssets = (e, assets) => {
	return async dispatch => {
		let search = e.target.value;
		let regex = new RegExp(search, "gmi");
		var { baseAsset } = store.getState().exchange;

		var assetsWithBaseAssetIncluded = {};
		for (let asset in assets) {
			assetsWithBaseAssetIncluded[asset] = assets[asset];
		}
		assetsWithBaseAssetIncluded[baseAsset.symbol] = baseAsset;

		let assetsFiltered = {};
		for (let asset in assetsWithBaseAssetIncluded) {
			if (
				regex.test(assetsWithBaseAssetIncluded[asset].symbol) ||
				regex.test(assetsWithBaseAssetIncluded[asset].name)
			) {
				assetsFiltered[asset] = assetsWithBaseAssetIncluded[asset];
			}
		}

		dispatch({
			type: EXCHANGE_FILTER_ASSETS,
			payload: { assetsFiltered, search }
		});
	};
};

export const reload = () => {
	store.dispatch({
		type: EXCHANGE_RELOAD
	});
};

export const initialize = () => {
	return async dispatch => {
		dispatch({
			type: EXCHANGE_INITIALIZE,
			payload: { web3 }
		});
	};
};
