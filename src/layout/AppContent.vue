<script setup lang="ts">
import { useSettingStore } from '@/store/modules/settings';
import { useKeepAliveInclude } from '@/composables/layout';

defineOptions({
  name: 'AppContent',
});

const { tagsView } = storeToRefs(useSettingStore());
const route = useRoute();
const include = useKeepAliveInclude();
</script>

<template>
  <v-main class="tw:h-full">
    <div
      class="tw:h-full tw:flex tw:flex-col tw:items-center tw:justify-center"
    >
      <v-expand-transition>
        <TagsView v-if="tagsView" />
      </v-expand-transition>
      <div class="tw:w-full tw:h-full tw:grow tw:relative">
        <v-container class="tw:absolute tw:inset-0 tw:py-1 tw:px-1" fluid>
          <div class="tw:w-full tw:h-full tw:overflow-hidden">
            <router-view v-slot="{ Component }">
              <v-slide-x-transition mode="out-in">
                <keep-alive :include="tagsView ? include : []">
                  <component :is="Component" :key="route.path" />
                </keep-alive>
              </v-slide-x-transition>
            </router-view>
          </div>
        </v-container>
      </div>
    </div>
  </v-main>
</template>
