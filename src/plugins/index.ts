import type { App, Plugin } from 'vue';
import Vue3AMap from '@rthx/vue3-amap';
import '@rthx/vue3-amap/dist/index.css';
import toast from '@/components/Toast';
import router from '@/router';
import '@/router/permission';
import store from '@/store';
import { getAccountStore } from '@/store/modules/account';
import vuetify from './vuetify';

const amap: Plugin = (app) => {
  app.use(Vue3AMap, {
    key: import.meta.env.VITE_AMAP_JS_KEY,
    version: '2.0',
    errorHandler(error: Error) {
      toast.error({ message: `高德地图：${error.message}` });
    },
  });
};

/**
 * 显式声明插件顺序：Vuetify → Pinia → Router。
 * 路由守卫会读取账号状态，因此 Pinia 必须先于 Router 安装。
 */
export default function installPlugins(app: App) {
  app.use(vuetify);
  app.use(store);

  // 刷新页面时先按持久化的菜单恢复动态路由，避免守卫里再重建
  const accountStore = getAccountStore();
  if (accountStore.loggedIn) {
    accountStore.generateRoutes();
  }

  app.use(router);
  app.use(amap);
}
