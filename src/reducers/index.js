import { combineReducers } from "redux";
import ExchangeReducer from "./ExchangeReducer";

export default combineReducers({
	exchange: ExchangeReducer
});
