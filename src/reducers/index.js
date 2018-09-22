import { combineReducers } from "redux";
import TradeReducer from "./TradeReducer";
import ExchangeReducer from "./ExchangeReducer";
import ChartReducer from "./ChartReducer";

export default combineReducers({
	trade: TradeReducer,
	chart: ChartReducer,
	exchange: ExchangeReducer
});
