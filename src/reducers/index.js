import { combineReducers } from "redux";
import TradeReducer from "./TradeReducer";
import OrderBookReducer from "./OrderBookReducer";
import PairReducer from "./PairReducer";
import ChartReducer from "./ChartReducer";

export default combineReducers({
	trade: TradeReducer,
	orderBook: OrderBookReducer,
	pair: PairReducer,
	chart: ChartReducer
});
