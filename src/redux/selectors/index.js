import { createSelector } from 'reselect';

const getLoading = (state) => state.loadingReducer.isLoading;
const getToken = (state) => state.tokenReducer.token;
const getProfile = (state) => state.profileReducer.profile;

export const selectLoading = createSelector(
  getLoading,
  (loading) => loading
);

export const selectToken = createSelector(
  getToken,
  (token) => token
);

export const selectProfile = createSelector(
  getProfile,
  (profile) => profile
);
