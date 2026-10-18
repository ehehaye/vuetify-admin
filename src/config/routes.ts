import type { RouteRecordRaw } from 'vue-router';
import { lazyImport } from '@/router/helper';

export const DEFAULT_ROUTE_PATH = '/home';

export const LOGIN_ROUTE: RouteRecordRaw = {
  name: 'login',
  path: '/login',
  component: lazyImport('login/index', '/login'),
  meta: { title: '登录' },
};

export const HOME_ROUTE: RouteRecordRaw = {
  name: DEFAULT_ROUTE_PATH,
  path: DEFAULT_ROUTE_PATH,
  component: lazyImport('home/index', DEFAULT_ROUTE_PATH),
  meta: { title: '首页', icon: 'home', keepAlive: true },
};

export const NOT_FOUND_ROUTE: RouteRecordRaw = {
  name: 'not-found',
  path: '/exception/404',
  component: lazyImport('exception/index', '/exception/404'),
  meta: { title: '页面不存在', hidden: true },
};

export const FALLBACK_ROUTE: RouteRecordRaw = {
  name: 'fallback',
  path: '/:pathMatch(.*)*',
  redirect: '/exception/404',
};
