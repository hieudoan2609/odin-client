import Web3 from "web3";
import {
	EXCHANGE_CURRENT_MARKET,
	EXCHANGE_LOADED,
	EXCHANGE_LOAD_BUYBOOK,
	EXCHANGE_LOAD_SELLBOOK,
	EXCHANGE_LOAD_TRADES,
	EXCHANGE_LOAD_TICKS
} from "./types";
import io from "socket.io-client";
import axios from "axios";
import { round } from "../helpers";
import moment from "moment";
import { tsvParse } from "d3-dsv";
import { timeParse } from "d3-time-format";

const web3 = new Web3(
	Web3.givenProvider || "https://rinkeby.infura.io/pVTvEWYTqXvSRvluzCCe"
);

export const connectSocket = () => {
	return async dispatch => {
		const assets = (await axios.get("/assets.json")).data;
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
					ticks = await getChartData();
					dispatch({
						type: EXCHANGE_LOAD_TICKS,
						payload: ticks
					});
					console.log("new tick");
					break;
				default:
					buyBook = await processBuyBook(data.buyOrders);
					sellBook = await processSellBook(data.sellOrders);
					trades = await processTrades(data.trades);
					ticks = await getChartData();
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

const getChartData = async () => {
	return new Promise(async (resolve, reject) => {
		const res = await axios.get(
			"https://cdn.rawgit.com/rrag/react-stockcharts/master/docs/data/MSFT.tsv"
		);

		const ticks = tsvParse(res.data, parseData(parseDate));

		resolve(ticks);
	});
};

function parseData(parse) {
	return function(d) {
		d.date = parse(d.date);
		d.open = +d.open;
		d.high = +d.high;
		d.low = +d.low;
		d.close = +d.close;
		d.volume = +d.volume;

		return d;
	};
}

const parseDate = timeParse("%Y-%m-%d");

export const setCurrentMarket = market => {
	return {
		type: EXCHANGE_CURRENT_MARKET,
		payload: market
	};
};
