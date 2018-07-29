import { combineReducers } from 'redux';
import ChartReducer from './ChartReducer';
import TradeReducer from './TradeReducer';
import OrderBookReducer from './OrderBookReducer';
import PairReducer from './PairReducer';

export default combineReducers({
  chart: ChartReducer,
  trade: TradeReducer,
  orderBook: OrderBookReducer,
  pair: PairReducer
});
