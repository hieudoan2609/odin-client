import Web3 from "web3";
import exchangeAbi from "../contracts/ExchangePureAbi.json";
import {
	EXCHANGE_CURRENT_MARKET,
	EXCHANGE_LOADED,
	EXCHANGE_LOAD_SELLBOOK,
	EXCHANGE_LOAD_BUYBOOK
} from "./types";
import { round } from "../helpers.js";

const web3 = new Web3(
	Web3.givenProvider || "https://rinkeby.infura.io/pVTvEWYTqXvSRvluzCCe"
);
const exchangeAddress = "0x54a298eE9fcCBF0aD8e55Bc641D3086b81a48c41";
const exchange = new web3.eth.Contract(exchangeAbi, exchangeAddress);
const nullAddress = "0x0000000000000000000000000000000000000000";

export const getMarket = (market, marketAddress) => {
	return async dispatch => {
		setCurrentMarket(dispatch, market);
		await loadBuyBook(dispatch, marketAddress);
		await loadSellBook(dispatch, marketAddress);
		// const updateInterval = setInterval(
		// 	this.props.getMarket,
		// 	3000,
		// 	defaultMarket,
		// 	defaultMarketAddress
		// );
		// await loadMarketTrades(dispatch, )
		dispatch({
			type: EXCHANGE_LOADED
		});
	};
};

const loadBuyBook = (dispatch, marketAddress) => {
	return new Promise(async (resolve, reject) => {
		let buyBook = {
			prices: {},
			total: 0
		};
		let orders = [];
		const { ask } = await exchange.methods.getMarketInfo(marketAddress).call();
		let order = await exchange.methods.getOrder(marketAddress, ask).call();
		let currentId = ask;
		while (order.user !== nullAddress) {
			const prevId = order.prev;
			order.id = currentId;
			orders.push(order);
			order = await exchange.methods.getOrder(marketAddress, prevId).call();
			currentId = prevId;
		}
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
		dispatch({
			type: EXCHANGE_LOAD_BUYBOOK,
			payload: buyBook
		});
		resolve();
	});
};

const loadSellBook = async (dispatch, marketAddress) => {
	return new Promise(async (resolve, reject) => {
		let sellBook = {
			prices: {},
			total: 0
		};
		let orders = [];
		const { bid } = await exchange.methods.getMarketInfo(marketAddress).call();
		let order = await exchange.methods.getOrder(marketAddress, bid).call();
		let currentId = bid;
		while (order.user !== nullAddress) {
			const nextId = order.next;
			order.id = currentId;
			orders.push(order);
			order = await exchange.methods.getOrder(marketAddress, nextId).call();
			currentId = nextId;
		}
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
		dispatch({
			type: EXCHANGE_LOAD_SELLBOOK,
			payload: sellBook
		});
		resolve();
	});
};

const setCurrentMarket = (dispatch, market) => {
	dispatch({
		type: EXCHANGE_CURRENT_MARKET,
		payload: market
	});
};
