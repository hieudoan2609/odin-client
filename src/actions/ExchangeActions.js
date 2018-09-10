import Web3 from "web3";
import exchangeAbi from "../contracts/ExchangePureAbi.json";
import {
	EXCHANGE_CURRENT_MARKET,
	EXCHANGE_LOADED,
	EXCHANGE_LOAD_SELLBOOK,
	EXCHANGE_LOAD_BUYBOOK
} from "./types";

const web3 = new Web3(
	Web3.givenProvider || "https://rinkeby.infura.io/pVTvEWYTqXvSRvluzCCe"
);
const exchangeAddress = "0x3F3aEF30AFee20b0281B2947c4F694DA1839d281";
const exchange = new web3.eth.Contract(exchangeAbi, exchangeAddress);
const nullAddress = "0x0000000000000000000000000000000000000000";

export const getMarket = (market, marketAddress) => {
	return async dispatch => {
		setCurrentMarket(dispatch, market);
		await loadBuyBook(dispatch, marketAddress);
		// await loadSellBook(dispatch, marketAddress);
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
		while (order.user !== nullAddress) {
			const prevId = order.prev;
			orders.push(order);
			order = await exchange.methods.getOrder(marketAddress, prevId).call();
		}
		orders.forEach(order => {
			if (!buyBook.prices[order.price]) {
				const amount = web3.utils.fromWei(order.amount);
				const price = web3.utils.fromWei(order.price);
				const total = price * amount;
				buyBook.prices[price] = { amount, total };
			} else {
				const prevAmount = buyBook[order.price].amount;
				const prevTotal = buyBook[order.price].total;
				const amount = web3.utils.fromWei(order.amount) + prevAmount;
				const price = web3.utils.fromWei(order.price);
				const total = price * amount + prevTotal;
				buyBook.prices[price] = { amount, total };
			}
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

// const loadSellBook = async (dispatch, marketAddress) => {};

const setCurrentMarket = (dispatch, market) => {
	dispatch({
		type: EXCHANGE_CURRENT_MARKET,
		payload: market
	});
};
