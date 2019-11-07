import { CAPTCHA_BUTTON, LOADING, TOKEN } from '../constants/actionTypes';

// loading
export const loadingReducer = (state = { isLoading: false }, action) => {
  switch (action.type) {
    case LOADING:
      return {
        isLoading: action.isLoading
      };
    default:
      return state;
  }
};

// captcha btn
export const captchaButtonReducer = (state = { isDisabled: false }, action) => {
  switch (action.type) {
    case CAPTCHA_BUTTON:
      return {
        isDisabled: action.isDisabled
      };
    default:
      return state;
  }
};

// token
export const tokenReducer = (
  state = { token: localStorage.getItem('token') },
  action
) => {
  switch (action.type) {
    case TOKEN:
      return {
        token: action.token
      };
    default:
      return state;
  }
};
