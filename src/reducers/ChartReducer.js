import { GET_CHART_DATA } from "../actions/types";
import moment from "moment";

const INITIAL_STATE = {
	data: {},
	loading: true
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case GET_CHART_DATA:
			return { ...state, data: action.payload, loading: false };
		default:
			return state;
	}
};
