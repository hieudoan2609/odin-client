import {
	TRADE_PRICE,
	TRADE_AMOUNT,
	TRADE_FEE_AND_TOTAL,
	TRADE_TYPE,
	TRADE_ERROR,
	TRADE_PENDING,
	TRADE_SUBMITTED
} from "../actions/types";

const INITIAL_STATE = {
	type: "sell",
	price: "",
	amount: "",
	fee: 0,
	total: 0,
	pending: false,
	error: "",
	totalMinusFee: 0,
	amountMinusFee: 0
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case TRADE_SUBMITTED:
			return {
				...state,
				pending: false,
				amount: "",
				price: "",
				total: 0,
				fee: 0
			};
		case TRADE_PENDING:
			return {
				...state,
				pending: action.payload.pending,
				error: ""
			};
		case TRADE_ERROR:
			return {
				...state,
				error: action.payload.error
			};
		case TRADE_AMOUNT:
			return {
				...state,
				amount: action.payload.amount
			};
		case TRADE_TYPE:
			return {
				...state,
				type: action.payload.type
			};
		case TRADE_FEE_AND_TOTAL:
			return {
				...state,
				fee: action.payload.fee,
				total: action.payload.total,
				totalMinusFee: action.payload.totalMinusFee,
				amountMinusFee: action.payload.amountMinusFee
			};
		case TRADE_PRICE:
			return {
				...state,
				price: action.payload.price
			};
		default:
			return state;
	}
};
