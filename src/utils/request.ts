import axios from 'axios';
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import toast from '@/components/Toast';
import { getAccountStore } from '@/store/modules/account';

// 与原先 qs 的 arrayFormat: 'repeat', skipNulls: true 行为保持一致
function serializeQuery(params: Record<string, unknown>): string {
  const parts: string[] = [];
  const encode = (value: string) =>
    encodeURIComponent(value).replace(
      /[!'()*]/g,
      (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`,
    );

  const append = (key: string, value: unknown) => {
    if (value == null) return;

    if (Array.isArray(value)) {
      value.forEach((item) => append(key, item));
      return;
    }

    if (typeof value === 'object') {
      Object.entries(value).forEach(([childKey, childValue]) =>
        append(`${key}[${childKey}]`, childValue),
      );
      return;
    }

    parts.push(`${encode(key)}=${encode(String(value))}`);
  };

  Object.entries(params).forEach(([key, value]) => append(key, value));

  return parts.join('&');
}

const instance = axios.create({
  baseURL: '/api',
  timeout: 15000,
  responseType: 'json',
  validateStatus: (status) => status >= 200 && status < 300,
  paramsSerializer: {
    serialize: serializeQuery,
  },
});

instance.interceptors.request.use((config) => {
  const { account } = getAccountStore();

  if (account.token) {
    config.headers.Authorization = `Bearer ${account.token}`;
  }

  return config;
});

const statusMessages: Record<number, string> = {
  400: '请求参数有误',
  403: '操作被禁止',
  404: '资源未找到',
  401: '登录状态已失效，请重新登录',
  500: '服务器异常',
};

instance.interceptors.response.use(
  (response): AxiosResponse => {
    const body: unknown = response.data;

    if (body && typeof body === 'object' && 'success' in body) {
      const { data, message, success } = body as ApiRes<unknown>;

      if (!success) {
        toast.error({ message: message || '请求失败' });
        return Promise.reject(
          new Error(message || '请求失败'),
        ) as unknown as AxiosResponse;
      }

      // 运行时返回解包后的业务数据，类型由 http.* 的第二个泛型声明
      return data as unknown as AxiosResponse;
    }

    return body as unknown as AxiosResponse;
  },
  async (error: AxiosError<ApiRes<unknown>>) => {
    const status = error.response?.status;
    let message = error.response?.data?.message;

    if (!message && status) {
      message = statusMessages[status] ?? `请求失败（${status}）`;
    }

    if (!message) {
      message =
        error.code === 'ECONNABORTED'
          ? '请求超时，请稍后重试'
          : error.message === 'Network Error'
            ? '网络异常，请检查连接'
            : error.message;
    }

    if (status === 401) {
      const [{ getAccountStore }, { default: router }] = await Promise.all([
        import('@/store/modules/account'),
        import('@/router'),
      ]);
      getAccountStore().logout();

      if (router.currentRoute.value.path !== '/login') {
        await router.replace({
          path: '/login',
          query: { redirect: router.currentRoute.value.fullPath },
        });
      }
    }

    toast.error({ message });
    return Promise.reject(new Error(message));
  },
);

/** 响应拦截器已解包 ApiRes，因此这里的返回值直接是业务数据 */
export const http = {
  get<T>(url: string, config?: AxiosRequestConfig) {
    return instance.get<unknown, T>(url, config);
  },
  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return instance.post<unknown, T>(url, data, config);
  },
  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return instance.put<unknown, T>(url, data, config);
  },
  delete<T>(url: string, config?: AxiosRequestConfig) {
    return instance.delete<unknown, T>(url, config);
  },
};

export default instance;
