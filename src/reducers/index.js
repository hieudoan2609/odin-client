import { combineReducers } from "redux";
import TradeReducer from "./TradeReducer";
import OrderBookReducer from "./OrderBookReducer";
import ContractReducer from "./ContractReducer";
import ChartReducer from "./ChartReducer";

export default combineReducers({
	trade: TradeReducer,
	orderBook: OrderBookReducer,
	chart: ChartReducer,
	contract: ContractReducer
});
