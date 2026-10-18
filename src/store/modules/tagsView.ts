import { useSessionStorage } from '@vueuse/core';
import type { RouteLocationNormalizedLoaded } from 'vue-router';
import { DEFAULT_ROUTE_PATH } from '@/config/routes';

export interface TabItem {
  path: string;
  fullPath: string;
  title: string;
  keepAlive: boolean;
  closable: boolean;
}

const HOME_TAB: TabItem = {
  path: DEFAULT_ROUTE_PATH,
  fullPath: DEFAULT_ROUTE_PATH,
  title: '首页',
  keepAlive: true,
  closable: false,
};

const toTab = (route: RouteLocationNormalizedLoaded): TabItem => ({
  path: route.path,
  fullPath: route.fullPath,
  title: route.meta.title ?? String(route.name ?? route.path),
  keepAlive: route.meta.keepAlive ?? false,
  closable: route.path !== DEFAULT_ROUTE_PATH,
});

export const useTagsViewStore = defineStore('tagsView', () => {
  const views = useSessionStorage<TabItem[]>('tags-view-tabs', []);

  function sync(route: RouteLocationNormalizedLoaded) {
    const tab = toTab(route);
    const index = views.value.findIndex((view) => view.path === tab.path);

    if (index === -1) {
      views.value.push(tab);
    } else {
      views.value[index] = tab;
    }

    if (!views.value.some((view) => view.path === DEFAULT_ROUTE_PATH)) {
      views.value.unshift({ ...HOME_TAB });
    }
  }

  function remove(path: string) {
    views.value = views.value.filter((view) => view.path !== path);
  }

  function close(index: number, currentPath: string): TabItem | undefined {
    const tab = views.value[index];
    if (!tab?.closable) return undefined;

    views.value.splice(index, 1);

    if (tab.path !== currentPath) return undefined;
    return views.value[index] ?? views.value[index - 1] ?? HOME_TAB;
  }

  function closeLeft(index: number, currentPath: string) {
    const target = views.value[index];
    if (!target) return undefined;

    views.value = views.value.filter(
      (tab, tabIndex) => tabIndex >= index || !tab.closable,
    );
    return currentPath === target.path ? undefined : target;
  }

  function closeRight(index: number, currentPath: string) {
    const target = views.value[index];
    if (!target) return undefined;

    views.value = views.value.filter(
      (tab, tabIndex) => tabIndex <= index || !tab.closable,
    );
    return currentPath === target.path ? undefined : target;
  }

  function closeOthers(index: number, currentPath: string) {
    const target = views.value[index];
    if (!target) return undefined;

    views.value = views.value.filter(
      (tab, tabIndex) => tabIndex === index || !tab.closable,
    );
    return currentPath === target.path ? undefined : target;
  }

  function clear() {
    views.value = [];
  }

  return {
    views,
    sync,
    remove,
    close,
    closeLeft,
    closeRight,
    closeOthers,
    clear,
    $reset: clear,
  };
});
