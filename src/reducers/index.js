import { combineReducers } from "redux";
import TradeReducer from "./TradeReducer";
import OrderBookReducer from "./OrderBookReducer";
import ExchangeReducer from "./ExchangeReducer";
import ChartReducer from "./ChartReducer";

export default combineReducers({
	trade: TradeReducer,
	orderBook: OrderBookReducer,
	chart: ChartReducer,
	exchange: ExchangeReducer
});
