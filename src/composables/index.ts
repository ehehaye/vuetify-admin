/* eslint-disable @typescript-eslint/no-explicit-any */
type Fn<T> = (...args: any[]) => Promise<T>;

export const usePromiseFn = <T = any>(fn: Fn<T>, defaultResult?: T) => {
  // https://github.com/vuejs/core/issues/2136
  const result = ref(defaultResult) as Ref<T>;
  const loading = ref<boolean>(false);
  const error = ref<Error | null>(null);

  const exec: Fn<T> = async (...args) => {
    loading.value = true;
    try {
      result.value = await fn(...args);
      error.value = null;
    } catch (e) {
      error.value = e;
    } finally {
      loading.value = false;
    }
    return result.value;
  };

  return { loading, error, result, exec };
};
