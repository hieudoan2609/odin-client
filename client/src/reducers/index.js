import { combineReducers } from 'redux';
import ChartReducer from './ChartReducer';

export default combineReducers({
  chart: ChartReducer
});
