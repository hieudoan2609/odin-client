import { combineReducers } from 'redux';
import ChartReducer from './ChartReducer';
import TradeReducer from './TradeReducer';
import OrderBook from './OrderBookReducer';

export default combineReducers({
  chart: ChartReducer,
  trade: TradeReducer,
  orderBook: OrderBook
});
