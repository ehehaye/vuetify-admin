<script setup lang="ts">
import { useSettingStore } from '@/store/modules/settings';
import { useKeepAliveInclude } from '@/composables/useKeepAliveInclude';

const route = useRoute();
const { tagsView, headerHeight } = storeToRefs(useSettingStore());
const include = useKeepAliveInclude();
</script>

<template>
  <v-main class="app-main">
    <div
      class="app-viewport"
      :style="{ height: `calc(100dvh - ${headerHeight}px)` }"
    >
      <div class="tw:min-h-0 tw:flex-1 tw:overflow-hidden px-4 tw:pt-4 tw:pb-4">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <keep-alive :include="tagsView ? include : []">
              <component :is="Component" :key="route.path" />
            </keep-alive>
          </transition>
        </router-view>
      </div>
    </div>
  </v-main>
</template>

<style scoped>
.app-viewport {
  display: flex;
  flex-direction: column;
}

.page-enter-active,
.page-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
