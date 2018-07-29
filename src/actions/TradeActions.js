import { SWITCH_ORDER_TYPE } from './types';

export const switchOrderType = type => {
  return {
    type: SWITCH_ORDER_TYPE,
    payload: type
  };
};
