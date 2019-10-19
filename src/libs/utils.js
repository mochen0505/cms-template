import { message } from 'antd';
import NProgress from 'nprogress';

export default {
  nMessage: (() => {
    message.config({
      top: 24,
      duration: 3,
      maxCount: 1
    });
    return {
      success: (param) => {
        message.success(param);
      },
      error: (param) => {
        message.error(param);
      }
    };
  })(),
  nProgress: (() => {
    NProgress.configure({ showSpinner: false });
    return {
      start: () => {
        NProgress.start();
      },
      done: () => {
        NProgress.done();
      }
    };
  })()
};
