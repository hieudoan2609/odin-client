import Web3 from "web3";
import {
	EXCHANGE_CURRENT_MARKET,
	EXCHANGE_LOADED,
	EXCHANGE_LOAD_BUYBOOK,
	EXCHANGE_LOAD_SELLBOOK,
	EXCHANGE_LOAD_TRADES,
	EXCHANGE_LOAD_TICKS,
	EXCHANGE_FILTER_ASSETS
} from "./types";
import io from "socket.io-client";
import axios from "axios";
import { round } from "../helpers";
import moment from "moment";
import { tsvParse } from "d3-dsv";

const web3 = new Web3(
	Web3.givenProvider || "https://rinkeby.infura.io/pVTvEWYTqXvSRvluzCCe"
);

export const connectSocket = () => {
	return async dispatch => {
		var assets = (await axios.get("/assets.json")).data;
		const market = Object.keys(assets)[0];

		const socket = io(
			process.env.REACT_APP_SOCKET_URL || "https://socket.odin.trade"
		);

		socket.on(market, async ({ data, type }) => {
			let buyBook, sellBook, trades, ticks;
			switch (type) {
				case "trades":
					trades = await processTrades(data);
					dispatch({
						type: EXCHANGE_LOAD_TRADES,
						payload: trades
					});
					console.log("new trades", data);
					break;
				case "buyOrders":
					buyBook = await processBuyBook(data);
					dispatch({
						type: EXCHANGE_LOAD_BUYBOOK,
						payload: buyBook
					});
					console.log("new buy orders", data);
					break;
				case "sellOrders":
					sellBook = await processSellBook(data);
					dispatch({
						type: EXCHANGE_LOAD_SELLBOOK,
						payload: sellBook
					});
					console.log("new sell orders", data);
					break;
				case "tick":
					ticks = await getChartData(market);
					dispatch({
						type: EXCHANGE_LOAD_TICKS,
						payload: ticks
					});
					console.log("new tick", ticks);
					break;
				default:
					buyBook = await processBuyBook(data.buyOrders);
					sellBook = await processSellBook(data.sellOrders);
					trades = await processTrades(data.trades);
					ticks = await getChartData(market);
					for (let asset in assets) {
						assets[asset].currentPrice = 0;
						assets[asset].previousPrice = 0;
						assets[asset].availableBalance = 0;
						assets[asset].reserveBalance = 0;
					}
					dispatch({
						type: EXCHANGE_LOADED,
						payload: {
							socket,
							market,
							assets,
							sellBook,
							buyBook,
							trades,
							ticks
						}
					});
			}
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

export const setCurrentMarket = market => {
	return {
		type: EXCHANGE_CURRENT_MARKET,
		payload: market
	};
};

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
