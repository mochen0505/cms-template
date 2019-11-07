import { createSelector } from 'reselect';

const getLoading = (state) => state.loadingReducer.isLoading;
const getCaptchaButton = (state) => state.captchaButtonReducer.isDisabled;
const getToken = (state) => state.tokenReducer.token;
const getProfile = (state) => state.profileReducer.profile;

export const selectLoading = createSelector(
  getLoading,
  (loading) => loading
);

export const selectCaptchaButton = createSelector(
  getCaptchaButton,
  (isDisabled) => isDisabled
);

export const selectToken = createSelector(
  getToken,
  (token) => token
);

export const selectProfile = createSelector(
  getProfile,
  (profile) => profile
);
