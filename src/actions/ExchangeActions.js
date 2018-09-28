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
	EXCHANGE_SET_INTERVAL,
	EXCHANGE_LOGOUT
} from "./types";
import io from "socket.io-client";
import axios from "axios";
import { round, roundFixed } from "../helpers";
import moment from "moment";
import { tsvParse } from "d3-dsv";
import store from "../store";

var infura = process.env.INFURA
	? process.env.INFURA
	: "https://rinkeby.infura.io/pVTvEWYTqXvSRvluzCCe";
const web3 = new Web3(Web3.givenProvider || infura);

export const login = user => {
	return async dispatch => {
		if (!Web3.givenProvider || !Web3.givenProvider.isMetaMask) {
			// metamask not installed
			dispatch({
				type: EXCHANGE_INSTALL_METAMASK
			});
		} else {
			var accounts = await web3.eth.getAccounts();
			if (accounts.length === 0) {
				// metamask installed but locked
				listenForMetamask(dispatch);
				dispatch({
					type: EXCHANGE_UNLOCK_METAMASK
				});
			} else {
				// metamask is installed and unlocked
				var user = accounts[0];
				console.log("load user data");
				listenForMetamask(dispatch);
				dispatch({
					type: EXCHANGE_LOGIN,
					payload: user
				});
			}
		}
	};
};

export const logout = interval => {
	return async dispatch => {
		clearInterval(interval);

		dispatch({
			type: EXCHANGE_LOGOUT
		});
	};
};

export const listenForMetamask = dispatch => {
	var interval = setInterval(async function() {
		var user = store.getState().exchange.user;
		var accounts = await web3.eth.getAccounts();

		if (accounts.length > 0) {
			if (!user) {
				console.log("load user data");
				user = accounts[0];
				dispatch({
					type: EXCHANGE_LOGIN,
					payload: user
				});
			}
		} else {
			dispatch({
				type: EXCHANGE_UNLOCK_METAMASK
			});
		}
	}, 3000);

	dispatch({
		type: EXCHANGE_SET_INTERVAL,
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
		var assets = (await axios.get("/assets.json")).data;
		for (let asset in assets) {
			assets[asset].availableBalance = 0;
			assets[asset].reserveBalance = 0;
		}
		dispatch({
			type: EXCHANGE_ACCOUNT_LOADED,
			payload: assets
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

		socket.on(market, async res => {
			let buyBook, sellBook, trades, ticks;
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
					dispatch({
						type: EXCHANGE_LOAD_BUYBOOK,
						payload: buyBook
					});
					console.log("new buy orders", res);
					break;
				case "sellOrders":
					sellBook = await processSellBook(res.market);
					dispatch({
						type: EXCHANGE_LOAD_SELLBOOK,
						payload: sellBook
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
					buyBook = await processBuyBook(res.market.buyOrders);
					sellBook = await processSellBook(res.market.sellOrders);
					trades = await processTrades(res.market.trades);
					ticks = await getChartData(market);
					var marketPrices = {};
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
					}
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
							ticks
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
				"YYYY-MM-D HH:mm:ss"
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
		let filteredAssets = {};

		for (let asset in assets) {
			if (regex.test(assets[asset].symbol) || regex.test(assets[asset].name)) {
				filteredAssets[asset] = assets[asset];
			}
		}

		dispatch({
			type: EXCHANGE_FILTER_ASSETS,
			payload: { filteredAssets, search }
		});
	};
};

export const reload = dispatch => {
	dispatch({
		type: EXCHANGE_RELOAD
	});
};
