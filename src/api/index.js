import axios from '../libs/api.request';

export default {
  signIn: (params) => {
    return axios.request({
      url: 'users/signin',
      data: params,
      method: 'post'
    });
  },
  smsCaptcha: (params) => {
    return axios.request({
      url: 'users/getSmsCaptcha',
      data: params,
      method: 'post'
    });
  },
  signUp: (params) => {
    return axios.request({
      url: 'users/signup',
      data: params,
      method: 'post'
    });
  },
  signOut: () => {
    return axios.request({
      url: 'users/signout',
      method: 'post'
    });
  },
  userProfile: () => {
    return axios.request({
      url: 'users/profile',
      method: 'get'
    });
  },
  editUserProfile: (params) => {
    return axios.request({
      url: 'users/profileEdit',
      data: params,
      method: 'post'
    });
  }
};
