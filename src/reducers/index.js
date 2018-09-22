import { combineReducers } from "redux";
import TradeReducer from "./TradeReducer";
import ExchangeReducer from "./ExchangeReducer";

export default combineReducers({
	trade: TradeReducer,
	exchange: ExchangeReducer
});
