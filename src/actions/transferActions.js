import { TRANSFER } from "./types";
import store from "../store";

export const setInitialState = state => {
	return async dispatch => {
		dispatch({
			type: TRANSFER,
			payload: state
		});
	};
};

export const handleAmountInput = e => {
	return async dispatch => {
		var amount = e.target.value;
		dispatch({
			type: TRANSFER,
			payload: { amount }
		});
	};
};

export const handleTransferSubmit = () => {
	return async dispatch => {
		var { type } = store.getState().transfer;

		if (type === "withdraw") {
			withdraw(dispatch);
		} else {
			deposit(dispatch);
		}
	};
};

export const deposit = async dispatch => {
	var { symbol, amount } = store.getState().transfer;
	var {
		user,
		exchangeInstance,
		assetsFiltered,
		web3,
		assetWeb3Instances,
		exchangeAddress,
		baseAsset
	} = store.getState().exchange;

	if (!amount) {
		dispatch({
			type: TRANSFER,
			payload: { error: "Amount cannot be 0." }
		});
		return;
	}

	var balance = await getBalance(user, symbol);

	if (parseFloat(balance) < parseFloat(amount)) {
		dispatch({
			type: TRANSFER,
			payload: { error: "Insufficient balance." }
		});
		return;
	}

	amount = web3.utils.toWei(amount.toString());
	var assetAddress = assetsFiltered[symbol].address;
	var err;
	var approved = false;

	if (symbol !== baseAsset.symbol) {
		try {
			dispatch({
				type: TRANSFER,
				payload: { pending: true, error: "" }
			});
			await assetWeb3Instances[symbol].methods
				.approve(exchangeAddress, amount)
				.send({ from: user });
			approved = true;
		} catch (error) {
			dispatch({
				type: TRANSFER,
				payload: { pending: false }
			});
			err = error;
		}
	} else {
		approved = true;
	}

	if (approved) {
		var value = symbol !== baseAsset.symbol ? 0 : amount;

		try {
			dispatch({
				type: TRANSFER,
				payload: { pending: true, error: "" }
			});
			await exchangeInstance.methods
				.deposit(assetAddress, amount)
				.send({ from: user, value });
		} catch (error) {
			dispatch({
				type: TRANSFER,
				payload: { pending: false }
			});
			err = error;
		}

		if (!err) {
			dispatch({
				type: TRANSFER,
				payload: { pending: false }
			});

			var $ = window.$;
			$("#transfer").modal("close");
			$("#transferComplete").modal("open");
		}
	}
};

export const withdraw = async dispatch => {
	var { symbol, amount } = store.getState().transfer;
	var {
		user,
		exchangeInstance,
		assetsFiltered,
		web3
	} = store.getState().exchange;

	if (!amount) {
		dispatch({
			type: TRANSFER,
			payload: { error: "Amount cannot be 0." }
		});
		return;
	}

	if (assetsFiltered[symbol].availableBalance < amount) {
		dispatch({
			type: TRANSFER,
			payload: { error: "Insufficient balance." }
		});
		return;
	}

	amount = web3.utils.toWei(amount.toString());
	var marketAddress = assetsFiltered[symbol].address;
	var err;
	try {
		dispatch({
			type: TRANSFER,
			payload: { pending: true, error: "" }
		});
		await exchangeInstance.methods
			.withdraw(marketAddress, amount)
			.send({ from: user });
	} catch (error) {
		dispatch({
			type: TRANSFER,
			payload: { pending: false }
		});
		err = error;
	}

	if (!err) {
		dispatch({
			type: TRANSFER,
			payload: { pending: false }
		});

		var $ = window.$;
		$("#transfer").modal("close");
		$("#transferComplete").modal("open");
	}
};

const getBalance = async (user, symbol) => {
	return new Promise(async (resolve, reject) => {
		var balance;
		var { baseAsset, web3, assetWeb3Instances } = store.getState().exchange;

		if (symbol === baseAsset.symbol) {
			balance = web3.utils.fromWei(await web3.eth.getBalance(user));
		} else {
			var token = assetWeb3Instances[symbol];
			balance = web3.utils.fromWei(await token.methods.balanceOf(user).call());
		}

		resolve(balance);
	});
};

export const sendAll = () => {
	return async dispatch => {
		var { symbol, type } = store.getState().transfer;
		var { user, assetsFiltered } = store.getState().exchange;
		var amount;

		if (type === "withdraw") {
			amount = assetsFiltered[symbol].availableBalance;
		} else {
			amount = parseFloat(await getBalance(user, symbol));
		}

		dispatch({
			type: TRANSFER,
			payload: { amount }
		});
	};
};
