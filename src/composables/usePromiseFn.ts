import { useAsyncState } from '@vueuse/core';

type AsyncFn<T, Args extends unknown[]> = (...args: Args) => Promise<T>;

const normalizeError = (cause: unknown) =>
  cause instanceof Error ? cause : new Error(String(cause));

export function usePromiseFn<T, Args extends unknown[] = []>(
  fn: AsyncFn<T, Args>,
) {
  const {
    state,
    isLoading,
    error: asyncError,
    execute,
  } = useAsyncState<T | undefined, Args, true>(
    // 包一层 Promise，确保 fn 同步抛出的错误也进入 useAsyncState 的错误处理
    (...args) => Promise.resolve().then(() => fn(...args)),
    undefined,
    {
      immediate: false,
      resetOnExecute: false,
      shallow: true,
      throwError: true,
      // 默认 onError 会调用 globalThis.reportError，导致错误被重复上报
      onError: () => {},
    },
  );

  const error = computed<Error | null>(() =>
    asyncError.value === undefined ? null : normalizeError(asyncError.value),
  );

  const exec = (...args: Args) => execute(0, ...args);

  return { loading: isLoading, error, result: state, exec };
}
