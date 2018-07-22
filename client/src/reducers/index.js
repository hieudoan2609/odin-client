import { combineReducers } from 'redux';
import ChartReducer from './ChartReducer';
import TradeReducer from './TradeReducer';

export default combineReducers({
  chart: ChartReducer,
  trade: TradeReducer
});
