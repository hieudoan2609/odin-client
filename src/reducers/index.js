import { combineReducers } from "redux";
import exchangeReducer from "./exchangeReducer";
import tradeReducer from "./tradeReducer";

export default combineReducers({
	exchange: exchangeReducer,
	trade: tradeReducer
});
