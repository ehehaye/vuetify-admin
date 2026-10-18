import router from './index';
import { NProgress } from '@/components/NProgress';
import { getAccountStore } from '@/store/modules/account';
import {
  DEFAULT_ROUTE_PATH,
  LOGIN_ROUTE,
  NOT_FOUND_ROUTE,
} from '@/config/routes';
import { checkPermission } from '@/composables/usePermissions';

router.beforeEach((to) => {
  NProgress.start();

  const accountStore = getAccountStore();
  const isLoginRoute = to.name === LOGIN_ROUTE.name;

  if (!accountStore.loggedIn) {
    if (isLoginRoute) return;

    return {
      path: LOGIN_ROUTE.path,
      query: { redirect: to.fullPath },
      replace: true,
    };
  }

  if (isLoginRoute) {
    return { path: DEFAULT_ROUTE_PATH, replace: true };
  }

  if (
    to.meta.permission &&
    !checkPermission(to.meta.permission, accountStore.permissions)
  ) {
    return { path: NOT_FOUND_ROUTE.path, replace: true };
  }
});

router.afterEach((to) => {
  const appTitle = import.meta.env.VITE_APP_TITLE;
  const pageTitle = to.meta.title;
  document.title = pageTitle ? `${pageTitle} - ${appTitle}` : appTitle;
  NProgress.done();
});

router.onError(() => {
  NProgress.done();
});
