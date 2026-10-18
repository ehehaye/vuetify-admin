/* eslint-disable @typescript-eslint/no-explicit-any */
type Fn<T> = (...args: any[]) => Promise<T>;

/**
 * 异步请求状态封装。
 * 与旧实现不同，失败时会重新抛出错误，调用方可据此展示局部错误态或中断后续流程。
 */
export const usePromiseFn = <T>(fn: Fn<T>, defaultResult?: T) => {
  const result = ref(defaultResult) as Ref<T | undefined>;
  const loading = ref(false);
  const error = ref<Error | null>(null);

  const exec: Fn<T> = async (...args) => {
    loading.value = true;
    error.value = null;

    try {
      const value = await fn(...args);
      result.value = value;
      return value;
    } catch (cause) {
      const normalized =
        cause instanceof Error ? cause : new Error(String(cause));
      error.value = normalized;
      throw normalized;
    } finally {
      loading.value = false;
    }
  };

  return { loading, error, result, exec };
};
