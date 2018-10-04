import { MY_ORDERS_PENDING } from "../actions/types";

const INITIAL_STATE = {
	pending: {}
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case MY_ORDERS_PENDING:
			return {
				...state,
				pending: action.payload.pending
			};
		default:
			return state;
	}
};
