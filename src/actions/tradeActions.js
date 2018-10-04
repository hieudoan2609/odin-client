import {
	TRADE_PRICE,
	TRADE_AMOUNT,
	TRADE_FEE_AND_TOTAL,
	TRADE_TYPE,
	TRADE_ERROR,
	TRADE_PENDING,
	TRADE_SUBMITTED
} from "./types";
import store from "../store";

export const handleTradePriceInput = e => {
	return async dispatch => {
		var price = parseFloat(e.target.value) || 0;

		dispatch({
			type: TRADE_PRICE,
			payload: { price }
		});

		await dispatchFeeAndTotal(dispatch);
	};
};

export const handleTradeAmountInput = e => {
	return async dispatch => {
		var amount = parseFloat(e.target.value) || 0;

		dispatch({
			type: TRADE_AMOUNT,
			payload: { amount }
		});

		await dispatchFeeAndTotal(dispatch);
	};
};

export const calculateFeeAndTotal = () => {
	return async dispatch => {
		await dispatchFeeAndTotal(dispatch);
	};
};

export const switchOrderType = type => {
	return async dispatch => {
		dispatch({
			type: TRADE_TYPE,
			payload: { type }
		});

		await dispatchFeeAndTotal(dispatch);
	};
};

export const dispatchFeeAndTotal = dispatch => {
	return new Promise(async (resolve, reject) => {
		var { fee } = store.getState().exchange;
		var { price, amount, type } = store.getState().trade;

		var total, totalMinusFee, amountMinusFee;
		if (price && amount) {
			total = price * amount;
			fee = type === "sell" ? (total / 100) * fee : (amount / 100) * fee;
			totalMinusFee = total - fee;
			amountMinusFee = amount - fee;
		} else {
			total = 0;
			fee = 0;
			totalMinusFee = 0;
			amountMinusFee = 0;
		}

		dispatch({
			type: TRADE_FEE_AND_TOTAL,
			payload: { total, fee, totalMinusFee, amountMinusFee }
		});

		resolve();
	});
};

export const handleTradeSubmit = refs => {
	return async dispatch => {
		var {
			user,
			exchangeInstance,
			currentMarket,
			assets,
			web3,
			baseAsset
		} = store.getState().exchange;
		var { price, amount, total, type } = store.getState().trade;

		var marketAddress = assets[currentMarket].address;
		var sell = type === "sell" ? true : false;

		if (parseFloat(price) === 0 || price === "") {
			dispatch({
				type: TRADE_ERROR,
				payload: { error: "Price can't be empty." }
			});
			return;
		}
		price = web3.utils.toWei(price.toString());

		if (parseFloat(amount) === 0 || amount === "") {
			dispatch({
				type: TRADE_ERROR,
				payload: { error: "Amount can't be empty." }
			});
			return;
		}
		amount = web3.utils.toWei(amount.toString());

		if (
			sell &&
			parseFloat(assets[currentMarket].availableBalance) <
				parseFloat(web3.utils.fromWei(amount.toString()))
		) {
			dispatch({
				type: TRADE_ERROR,
				payload: { error: `Insufficient ${currentMarket} balance.` }
			});
			return;
		}

		if (!sell && parseFloat(baseAsset.availableBalance) < parseFloat(total)) {
			dispatch({
				type: TRADE_ERROR,
				payload: { error: `Insufficient ${baseAsset.symbol} balance.` }
			});
			return;
		}

		var err;
		try {
			dispatch({
				type: TRADE_PENDING,
				payload: { pending: true }
			});
			await exchangeInstance.methods
				.createOrder(marketAddress, amount, price, sell)
				.send({ from: user });
		} catch (error) {
			dispatch({
				type: TRADE_PENDING,
				payload: { pending: false }
			});
			err = error;
		}

		if (!err) {
			dispatch({
				type: TRADE_SUBMITTED
			});

			var $ = window.$;
			$("#orderSubmitted").modal("open");
		}
	};
};
