import { PROFILE } from '../constants/actionTypes';

// profile
export const profileReducer = (state = { profile: {} }, action) => {
  switch (action.type) {
    case PROFILE:
      return {
        profile: action.profile
      };
    default:
      return state;
  }
};
