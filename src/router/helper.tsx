const modules = import.meta.glob('../views/**/*.vue');

export const lazyImport = (path: string, wrapCompName?: string) => {
  return async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const m: any = await modules[`../views/${path}.vue`]();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Comp: any = m.default;

    return wrapCompName
      ? {
          name: wrapCompName,
          render: () => (
            <div
              id={wrapCompName}
              key={wrapCompName}
              v-keep-scroll
              class="tw:w-full tw:h-full tw:overflow-x-hidden tw:overflow-y-auto"
            >
              <Comp />
            </div>
          ),
        }
      : Comp;
  };
};
