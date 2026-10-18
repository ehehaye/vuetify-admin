<script setup lang="ts">
import { useAccountStore } from '@/store/modules/account';
import { useSettingStore } from '@/store/modules/settings';
import { useTagsViewStore } from '@/store/modules/tagsView';

const route = useRoute();
const router = useRouter();
const accountStore = useAccountStore();
const settingStore = useSettingStore();
const tagsStore = useTagsViewStore();

const { username } = storeToRefs(accountStore);
const { isDark, headerHeight, permanent, tagsView } = storeToRefs(settingStore);

const appTitle = import.meta.env.VITE_APP_TITLE;
const repo = import.meta.env.VITE_GITHUB_REPO;

const title = computed(() => route.meta.title ?? appTitle);
const initial = computed(() =>
  (username.value || '?').slice(0, 1).toUpperCase(),
);

async function logout() {
  tagsStore.clear();
  accountStore.logout();
  await router.replace('/login');
}
</script>

<template>
  <v-app-bar class="app-header" :height="headerHeight" color="surface" flat>
    <template #prepend>
      <v-app-bar-nav-icon
        v-if="!permanent"
        aria-label="打开导航菜单"
        @click="settingStore.toggleNavigation()"
      />
    </template>

    <TagsView v-if="tagsView" />

    <v-app-bar-title v-else class="tw:font-medium">
      {{ title }}
    </v-app-bar-title>

    <template #append>
      <v-icon-btn
        :icon="isDark ? 'light_mode' : 'dark_mode'"
        :aria-label="isDark ? '切换到浅色模式' : '切换到深色模式'"
        class="d-none d-sm-flex"
        @click="settingStore.toggleDark()"
      />

      <v-icon-btn
        tag="a"
        :href="repo"
        target="_blank"
        rel="noopener noreferrer"
        icon="code"
        aria-label="GitHub 仓库"
        class="d-none d-sm-flex"
      />

      <v-icon-btn
        icon="settings"
        aria-label="个性化设置"
        class="d-none d-sm-flex"
        @click="settingStore.toggleSetting()"
      />

      <v-menu location="bottom end" :offset="[0, 8]">
        <template #activator="{ props: activatorProps }">
          <v-btn
            v-bind="activatorProps"
            variant="text"
            class="tw:ml-1 tw:px-2"
            :aria-label="`当前用户 ${username}`"
          >
            <v-avatar size="32" color="primary" variant="tonal" class="tw:mr-2">
              {{ initial }}
            </v-avatar>
            <span class="d-none d-sm-inline text-body-2 tw:font-medium">
              {{ username }}
            </span>
            <v-icon icon="expand_more" size="18" class="tw:ml-1" />
          </v-btn>
        </template>

        <v-list min-width="200" density="compact">
          <v-list-item
            :prepend-icon="isDark ? 'light_mode' : 'dark_mode'"
            :title="isDark ? '切换到浅色模式' : '切换到深色模式'"
            @click="settingStore.toggleDark()"
          />
          <v-list-item
            prepend-icon="settings"
            title="个性化设置"
            @click="settingStore.toggleSetting()"
          />
          <v-divider class="tw:my-1" />
          <v-list-item prepend-icon="logout" title="退出登录" @click="logout" />
        </v-list>
      </v-menu>
    </template>
  </v-app-bar>
</template>

<style scoped>
.app-header {
  border-bottom: 1px solid rgba(var(--v-theme-outline), 0.16);
}
</style>
