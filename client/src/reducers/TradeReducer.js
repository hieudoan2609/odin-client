import { POPULATE_CHART } from '../actions/types';

const INITIAL_STATE = {
  config: {},
  loading: true
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case POPULATE_CHART:
      return { ...state, config: action.payload, loading: false };
    default:
      return state;
  }
};
