import axios from 'axios';
import { parse, stringify } from 'qs';
import toast from '@/utils/toast';
import { getAccountStore } from '@/store/modules/account';

const request = axios.create({
  baseURL: '/api',
  responseType: 'json',
  validateStatus: (status) => status === 200,
  // https://github.com/axios/axios/issues/1644
  paramsSerializer: {
    encode: parse,
    serialize: stringify,
  },
});

request.interceptors.request.use((config) => {
  const { account } = getAccountStore();
  const { token } = account;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

request.interceptors.response.use(
  (config) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, message, success } = config.data as ApiRes<any>;
    if (!success) {
      toast.error({ message });
      return Promise.reject(new Error(message));
    }
    return data;
  },
  (error) => {
    let message = '';
    if (error.response) {
      if (error.response.data) {
        message = error.response.data.message;
      } else {
        switch (error.response.status) {
          case 404:
            message = '资源未找到';
            break;
          case 403:
            message = '操作被禁止';
            break;
          case 401:
            message = '暂无权限';
            break;
          case 500:
            message = '服务器异常';
            break;
          default:
            break;
        }
      }
    } else {
      message = error.message === 'Network Error' ? '网络异常' : error.message;
    }
    toast.error({ message });
    return Promise.reject(error);
  },
);

export default request;
