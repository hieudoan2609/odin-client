import { combineReducers } from "redux";
import exchangeReducer from "./exchangeReducer";
import tradeReducer from "./tradeReducer";
import myOrdersReducer from "./myOrdersReducer";
import transferReducer from "./transferReducer";

export default combineReducers({
	exchange: exchangeReducer,
	trade: tradeReducer,
	myOrders: myOrdersReducer,
	transfer: transferReducer
});
