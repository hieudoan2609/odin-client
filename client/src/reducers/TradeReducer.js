import {
  POPULATE_PRICE_CHART,
  POPULATE_DEPTH_CHART,
  SWITCH_CHART
} from '../actions/types';

const INITIAL_STATE = {
  priceConfig: {},
  depthConfig: {},
  priceLoading: true,
  depthLoading: true,
  chart: 'depth'
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case POPULATE_DEPTH_CHART:
      return { ...state, depthConfig: action.payload, depthLoading: false };
    case POPULATE_PRICE_CHART:
      return { ...state, priceConfig: action.payload, priceLoading: false };
    case SWITCH_CHART:
      return { ...state, chart: action.payload };
    default:
      return state;
  }
};
