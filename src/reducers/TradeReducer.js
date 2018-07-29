import { SWITCH_ORDER_TYPE } from '../actions/types';

const INITIAL_STATE = {
  orderType: 'buy'
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SWITCH_ORDER_TYPE:
      return { ...state, orderType: action.payload };
    default:
      return state;
  }
};
