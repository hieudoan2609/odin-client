import { POPULATE_PRICE_CHART, SWITCH_CHART } from '../actions/types';

const INITIAL_STATE = {
  // depthConfig: {},
  // depthLoading: true,
  // type: 'price'
  priceConfig: {},
  priceLoading: true
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    // case POPULATE_DEPTH_CHART:
    //   return { ...state, depthConfig: action.payload, depthLoading: false };
    case POPULATE_PRICE_CHART:
      return { ...state, priceConfig: action.payload, priceLoading: false };
    case SWITCH_CHART:
      return { ...state, type: action.payload };
    default:
      return state;
  }
};
