import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import {
  DEFAULT_ROUTE_PATH,
  FALLBACK_ROUTE,
  HOME_ROUTE,
  LOGIN_ROUTE,
  NOT_FOUND_ROUTE,
} from '@/config/routes';
import { lazyImport } from './helper';

const LAYOUT_ROUTE_NAME = 'layout';

const router = createRouter({
  routes: [
    LOGIN_ROUTE,
    {
      name: LAYOUT_ROUTE_NAME,
      path: '/',
      component: () => import('@/layout/AppPage.vue'),
      redirect: DEFAULT_ROUTE_PATH,
      children: [HOME_ROUTE, NOT_FOUND_ROUTE, FALLBACK_ROUTE],
    },
  ],
  history:
    import.meta.env.VITE_ROUTER_HISTORY === 'hash'
      ? createWebHashHistory()
      : createWebHistory(),
});

const menuRouteNames = new Set<string>();

const toRouteRecord = (menu: RouteConfig): RouteRecordRaw | null => {
  if (!menu.component) return null;

  return {
    name: menu.path,
    path: menu.path,
    component: lazyImport(menu.component, menu.path),
    meta: {
      title: menu.name,
      icon: menu.meta?.icon,
      keepAlive: menu.meta?.keepAlive ?? false,
      hidden: menu.meta?.hidden ?? false,
      permission: menu.meta?.permission,
    },
  };
};

/** 菜单中的分组节点仅用于导航展示，路由只注册可渲染的叶子节点 */
const flattenMenus = (menus: RouteConfig[]): RouteRecordRaw[] =>
  menus.flatMap((menu) => {
    const record = toRouteRecord(menu);
    return record ? [record] : flattenMenus(menu.children ?? []);
  });

const clearMenuRoutes = () => {
  menuRouteNames.forEach((name) => router.removeRoute(name));
  menuRouteNames.clear();
};

export const buildRoutes = (menus: RouteConfig[] = []) => {
  clearMenuRoutes();

  const staticPaths = new Set(router.getRoutes().map((route) => route.path));

  flattenMenus(menus)
    .filter((record) => !staticPaths.has(record.path))
    .forEach((record) => {
      router.addRoute(LAYOUT_ROUTE_NAME, record);
      menuRouteNames.add(String(record.name));
    });
};

export const resetRouter = clearMenuRoutes;

export default router;
