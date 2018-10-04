import { TRANSFER } from "../actions/types";

const INITIAL_STATE = {
	amount: "",
	error: "",
	type: "",
	name: "",
	symbol: "",
	pending: false
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case TRANSFER:
			var keys = Object.keys(action.payload);
			return {
				...state,
				amount: keys.includes("amount") ? action.payload.amount : state.amount,
				error: keys.includes("error") ? action.payload.error : state.error,
				type: keys.includes("type") ? action.payload.type : state.type,
				name: keys.includes("name") ? action.payload.name : state.name,
				symbol: keys.includes("symbol") ? action.payload.symbol : state.symbol,
				pending: keys.includes("pending")
					? action.payload.pending
					: state.pending
			};
		default:
			return state;
	}
};
