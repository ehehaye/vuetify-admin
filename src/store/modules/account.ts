import { useLocalStorage } from '@vueuse/core';
import { login as apiLogin } from '@/api/account';
import type { AccountInfo, LoginReq } from '@/api/account';
import { buildRoutes, resetRouter } from '@/router';
import store from '@/store';

const getInitialState = (): AccountInfo => ({
  username: '',
  token: '',
  roles: [],
  permissions: [],
  menus: [],
});

export const useAccountStore = defineStore('account', () => {
  const account = useLocalStorage<AccountInfo>('account', getInitialState());

  const loggedIn = computed(() => Boolean(account.value.token));
  const username = computed(() => account.value.username);
  const menus = computed(() => account.value.menus);
  const permissions = computed(() => account.value.permissions);

  function generateRoutes() {
    if (!loggedIn.value) {
      resetRouter();
      return;
    }
    buildRoutes(account.value.menus);
  }

  async function login(payload: LoginReq) {
    const result = await apiLogin(payload);
    account.value = result;
    generateRoutes();
  }

  function logout() {
    account.value = getInitialState();
    resetRouter();
  }

  return {
    account,
    loggedIn,
    username,
    menus,
    permissions,
    generateRoutes,
    login,
    logout,
  };
});

export const getAccountStore = () => useAccountStore(store);
