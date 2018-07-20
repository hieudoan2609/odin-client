import { combineReducers } from 'redux';
import TradeReducer from './TradeReducer';

export default combineReducers({
  trade: TradeReducer
});
