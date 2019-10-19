import Axios from 'axios';
import { baseURL } from '../configs/url';
import { stringify } from 'qs';

class httpRequest {
  constructor() {
    this.options = {
      method: '',
      url: ''
    };
    // 存储请求队列
    this.queue = {};
  }
  // 销毁请求实例
  destroy(url) {
    delete this.queue[url];
    const queue = Object.keys(this.queue);
    return queue.length;
  }
  // 请求拦截
  interceptors(instance, url) {
    // 添加请求拦截器
    instance.interceptors.request.use(
      (config) => {
        if (!config.url.includes('users/signin')) {
          config.headers[
            'Authorization'
          ] = `Bearer ${window.localStorage.getItem('token')}`;
        }
        // 在发送请求之前做些什么
        return config;
      },
      (error) => {
        // 对请求错误做些什么
        return Promise.reject(error);
      }
    );

    // 添加响应拦截器
    instance.interceptors.response.use(
      (res) => {
        let { data } = res;
        const is = this.destroy(url);
        if (!is) {
          setTimeout(() => {}, 500);
        }
        if (!(data instanceof Blob)) {
          // 失败
          if (data.code !== 1000) {
            // 权限错误
            if (data.code === 2000) {
              window.localStorage.removeItem('token');
              window.location.href = '/login';
            } else {
              // 其他业务错误
            }
            return false;
          }
        }
        return data;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }
  // 创建实例
  create() {
    let conf = {
      baseURL,
      // timeout: 2000
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
      //withCredentials: true
    };
    return Axios.create(conf);
  }
  // 合并请求实例
  mergeReqest(instances = []) {
    //
  }
  // 请求实例
  request(options) {
    if (options.data) options.data = stringify(options.data);
    let instance = this.create();
    this.interceptors(instance, options.url);
    options = Object.assign({}, options);
    this.queue[options.url] = instance;
    return instance(options);
  }
  requestFormData(options) {
    let instance = Axios.create({
      baseURL,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: true
    });
    this.interceptors(instance, options.url);
    options = Object.assign({}, options);
    this.queue[options.url] = instance;
    return instance(options);
  }
}

export default httpRequest;
