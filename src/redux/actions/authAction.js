import { CAPTCHA_BUTTON, LOADING, TOKEN } from '../constants/actionTypes';
import utils from '../../libs/utils';

const handleLoading = (isLoading) => ({
  type: LOADING,
  isLoading
});

const disableCaptcha = (isDisabled) => ({
  type: CAPTCHA_BUTTON,
  isDisabled
});

const token = (token) => {
  if (token) {
    window.localStorage.setItem('token', token);
  } else {
    window.localStorage.removeItem('token');
  }
  return {
    type: TOKEN,
    token
  };
};

const handleSignIn = (params) => {
  return (dispatch, getState, api) => {
    utils.nProgress.start();
    dispatch(handleLoading(true));
    return new Promise((resolve, reject) => {
      api
        .signIn(params)
        .then((res) => {
          const data = res.data;
          if (data) {
            dispatch(token(data.token));
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
          dispatch(handleLoading(false));
        });
    });
  };
};

const handleCaptcha = (params) => {
  return (dispatch, getState, api) => {
    utils.nProgress.start();
    return new Promise((resolve, reject) => {
      api
        .smsCaptcha(params)
        .then((res) => {
          const data = res.data;
          if (data) {
            dispatch(disableCaptcha(true));
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

const handleSignUp = (params) => {
  return (dispatch, getState, api) => {
    utils.nProgress.start();
    dispatch(handleLoading(true));
    return new Promise((resolve, reject) => {
      api
        .signUp(params)
        .then((res) => {
          const data = res.data;
          if (data) {
            dispatch(token(data.token));
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
          dispatch(handleLoading(false));
        });
    });
  };
};

const handleSignOut = () => {
  return (dispatch, getState, api) => {
    utils.nProgress.start();
    return new Promise((resolve, reject) => {
      api
        .signOut()
        .then((res) => {
          const data = res.data;
          if (data) {
            dispatch(token(data.token));
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

export {
  handleSignIn,
  disableCaptcha,
  handleCaptcha,
  handleSignUp,
  handleSignOut
};
