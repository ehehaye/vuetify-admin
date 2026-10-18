<script setup lang="ts">
import { useDisplay } from 'vuetify';
import { useAccountStore } from '@/store/modules/account';
import { useSettingStore } from '@/store/modules/settings';

defineOptions({
  name: 'AppHeader',
});

const { lgAndUp } = useDisplay();

const { logout } = useAccountStore();
const { username } = storeToRefs(useAccountStore());

const { toggleNavigation, toggleSetting } = useSettingStore();
const { permanentNavigation, headerHeight } = storeToRefs(useSettingStore());

const title = import.meta.env.VITE_APP_TITLE;
const repo = import.meta.env.VITE_GITHUB_REPO;
</script>

<template>
  <v-app-bar
    :clipped-left="permanentNavigation || lgAndUp"
    app
    class="tw:pr-4"
    color="primary darken-2"
    dark
    flat
    :height="headerHeight"
  >
    <template #prepend>
      <v-expand-x-transition>
        <v-app-bar-nav-icon
          v-show="!permanentNavigation"
          @click.stop="toggleNavigation"
        />
      </v-expand-x-transition>
    </template>

    <template #default>
      <v-app-bar-title>
        {{ title }}
      </v-app-bar-title>
      <v-spacer />
    </template>

    <template #append>
      <v-btn dark variant="text" @click="logout">
        {{ username }}
        <v-tooltip activator="parent" location="bottom"> 注销 </v-tooltip>
      </v-btn>

      <v-icon-btn
        icon="settings"
        icon-color="white"
        variant="text"
        @click="toggleSetting"
      >
        <v-tooltip activator="parent" location="bottom"> 个性化设置 </v-tooltip>
      </v-icon-btn>

      <v-icon-btn
        tag="a"
        :href="repo"
        target="_blank"
        variant="text"
        class="tw:text-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="feather feather-github"
        >
          <path
            d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
          />
        </svg>
        <v-tooltip activator="parent" location="bottom"> Github </v-tooltip>
      </v-icon-btn>
    </template>
  </v-app-bar>
</template>
