import { PROFILE } from '../constants/actionTypes';
import utils from '../../libs/utils';

const profile = (profile) => ({
  type: PROFILE,
  profile
});

const handleProfile = () => {
  return (dispatch, getState, api) => {
    utils.nProgress.start();
    return new Promise((resolve, reject) => {
      api
        .userProfile()
        .then((res) => {
          const data = res.data;
          if (data) {
            dispatch(profile(data));
            resolve(data);
          } else {
            resolve(-1);
          }
        })
        .catch((err) => {
          reject(err);
        })
        .finally((res) => {
          utils.nProgress.done();
        });
    });
  };
};

const handleEditProfile = (params) => {
  return (dispatch, getState, api) => {
    utils.nProgress.start();
    return new Promise((resolve, reject) => {
      api
        .editUserProfile(params)
        .then((res) => {
          if (res.code === 1000) {
            const prevProfile = getState().profileReducer.profile;
            dispatch(
              profile({
                ...prevProfile,
                ...params
              })
            );
            resolve();
          } else {
            resolve(-1);
          }
        })
        .catch((err) => {
          reject(err);
        })
        .finally((res) => {
          utils.nProgress.done();
        });
    });
  };
};

export { handleProfile, handleEditProfile };
