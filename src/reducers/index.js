import { combineReducers } from "redux";
import exchangeReducer from "./exchangeReducer";
import tradeReducer from "./tradeReducer";
import myOrdersReducer from "./myOrdersReducer";

export default combineReducers({
	exchange: exchangeReducer,
	trade: tradeReducer,
	myOrders: myOrdersReducer
});
