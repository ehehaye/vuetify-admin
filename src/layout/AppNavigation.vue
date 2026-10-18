<script setup lang="ts">
import { useAccountStore } from '@/store/modules/account';
import { useSettingStore } from '@/store/modules/settings';
import { useTagsViewStore } from '@/store/modules/tagsView';
import NavItem from './components/NavItem.vue';

const route = useRoute();
const router = useRouter();
const accountStore = useAccountStore();
const settingStore = useSettingStore();
const tagsStore = useTagsViewStore();

const { menus, username } = storeToRefs(accountStore);
const { permanent, drawerOpen, headerHeight } = storeToRefs(settingStore);

const appTitle = import.meta.env.VITE_APP_TITLE;
const opened = ref<string[]>([]);

const activeGroup = computed(
  () =>
    menus.value.find((menu) =>
      menu.children?.some((child) => child.path === route.path),
    )?.path,
);

const initial = computed(() =>
  (username.value || '?').slice(0, 1).toUpperCase(),
);

watch(
  () => route.path,
  () => {
    if (activeGroup.value && !opened.value.includes(activeGroup.value)) {
      opened.value.push(activeGroup.value);
    }
    settingStore.closeNavigation();
  },
  { immediate: true },
);

async function logout() {
  tagsStore.clear();
  accountStore.logout();
  await router.replace('/login');
}
</script>

<template>
  <v-navigation-drawer
    class="app-drawer"
    :model-value="drawerOpen"
    :permanent="permanent"
    :temporary="!permanent"
    :width="264"
    @update:model-value="settingStore.setNavigation"
  >
    <div class="tw:flex tw:h-full tw:flex-col">
      <router-link
        to="/home"
        class="tw:flex tw:shrink-0 tw:items-center tw:gap-3 tw:px-4"
        :style="{ height: `${headerHeight}px` }"
      >
        <img src="/logo.svg" alt="" class="tw:h-9 tw:w-9" />
        <div class="tw:min-w-0">
          <div class="text-subtitle-1 tw:truncate tw:font-semibold">
            {{ appTitle }}
          </div>
          <div class="text-caption text-medium-emphasis">管理控制台</div>
        </div>
      </router-link>

      <v-divider />

      <div class="tw:min-h-0 tw:flex-1 tw:overflow-y-auto tw:px-2 tw:py-3">
        <v-list v-model:opened="opened" nav>
          <NavItem v-for="item in menus" :key="item.path" :item="item" />
        </v-list>
      </div>

      <v-divider />

      <div class="tw:p-3">
        <div
          class="tw:flex tw:items-center tw:gap-3 tw:rounded-xl tw:bg-surface-variant/50 tw:p-3"
        >
          <v-avatar size="36" color="primary" variant="tonal">
            {{ initial }}
          </v-avatar>
          <div class="tw:min-w-0 tw:flex-1">
            <div class="text-body-2 tw:truncate tw:font-medium">
              {{ username }}
            </div>
            <div class="text-caption text-medium-emphasis">已登录</div>
          </div>
          <v-icon-btn
            icon="logout"
            size="small"
            aria-label="退出登录"
            @click="logout"
          />
        </div>
      </div>
    </div>
  </v-navigation-drawer>
</template>

<style scoped>
.app-drawer {
  border-right: 1px solid rgba(var(--v-theme-outline), 0.16);
}
</style>
