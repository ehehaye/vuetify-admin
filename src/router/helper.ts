import PageScroll from '@/layout/PageScroll.vue';

const modules = import.meta.glob('../views/**/*.vue');

/** 稳定的组件名，供 keep-alive 的 include 使用 */
export const pageComponentName = (path: string) =>
  `page${path.replace(/\//g, '-')}`;

export const lazyImport = (path: string, routePath = path) => {
  const loader = modules[`../views/${path}.vue`];

  if (!loader) {
    throw new Error(`[router] 未找到页面组件：views/${path}.vue`);
  }

  return async () => {
    const module = (await loader()) as { default: Component };
    const page = module.default;
    // 名称基于路由地址而非组件地址，确保与页签的 keep-alive include 一致
    const normalizedPath = routePath.startsWith('/')
      ? routePath
      : `/${routePath}`;
    const name = pageComponentName(normalizedPath);

    return defineComponent({
      name,
      setup() {
        return () => h(PageScroll, null, { default: () => h(page) });
      },
    });
  };
};
