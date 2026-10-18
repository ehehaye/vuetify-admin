<script setup lang="ts">
import { useTagsViewStore } from '@/store/modules/tagsView';

const store = useTagsViewStore();
const route = useRoute();
const router = useRouter();

const menuOpen = ref(false);
const menuIndex = ref(-1);
const menuX = ref(0);
const menuY = ref(0);

watch(
  () => route.fullPath,
  () => store.sync(route),
  { immediate: true },
);

function close(index: number) {
  const next = store.close(index, route.path);
  if (next) void router.push(next.fullPath);
}

function openMenu(event: MouseEvent, index: number) {
  event.preventDefault();
  menuIndex.value = index;
  menuX.value = event.clientX;
  menuY.value = event.clientY;

  if (menuOpen.value) {
    menuOpen.value = false;
    void nextTick(() => {
      menuOpen.value = true;
    });
  } else {
    menuOpen.value = true;
  }
}

function runMenuAction(
  action: (index: number, path: string) => ReturnType<typeof store.close>,
) {
  const index = menuIndex.value;
  menuOpen.value = false;
  if (index < 0) return;

  const next = action(index, route.path);
  if (next) void router.push(next.fullPath);
}
</script>

<template>
  <div
    class="tags-view tw:flex tw:h-full tw:min-w-0 tw:flex-1 tw:items-center tw:gap-2 px-2 px-sm-3 py-3 py-sm-4"
  >
    <div
      class="no-scrollbar tw:flex tw:min-w-0 tw:flex-1 tw:items-center tw:gap-2 tw:overflow-x-auto"
    >
      <div
        v-for="(tab, index) in store.views"
        :key="tab.path"
        class="tags-view__tab tw:flex tw:h-8 tw:shrink-0 tw:items-center"
        :class="{ 'tags-view__tab--active': tab.path === route.path }"
      >
        <router-link
          :to="tab.fullPath"
          class="tw:flex tw:h-full tw:items-center tw:px-3 tw:text-body-2 tw:font-medium tw:whitespace-nowrap"
          @contextmenu="openMenu($event, index)"
        >
          {{ tab.title }}
        </router-link>
        <button
          v-if="tab.closable"
          type="button"
          class="tags-view__close tw:mr-1 tw:grid tw:h-5 tw:w-5 tw:place-items-center tw:rounded-full"
          :aria-label="`关闭 ${tab.title}`"
          @click="close(index)"
        >
          <v-icon icon="close" size="14" />
        </button>
      </div>
    </div>

    <v-menu
      v-model="menuOpen"
      :target="[menuX, menuY]"
      location-strategy="connected"
      location="bottom start"
      transition="scale-transition"
    >
      <v-list density="compact" min-width="180">
        <v-list-item
          prepend-icon="close"
          title="关闭标签"
          :disabled="!store.views[menuIndex]?.closable"
          @click="runMenuAction(store.close)"
        />
        <v-list-item
          prepend-icon="vertical_split"
          title="关闭右侧标签"
          :disabled="menuIndex >= store.views.length - 1"
          @click="runMenuAction(store.closeRight)"
        />
        <v-list-item
          prepend-icon="vertical_split"
          title="关闭左侧标签"
          :disabled="menuIndex < 1"
          @click="runMenuAction(store.closeLeft)"
        />
        <v-list-item
          prepend-icon="tab_unselected"
          title="关闭其他标签"
          :disabled="store.views.length <= 1"
          @click="runMenuAction(store.closeOthers)"
        />
      </v-list>
    </v-menu>
  </div>
</template>

<style scoped>
.tags-view__tab {
  border: 1px solid rgba(var(--v-theme-outline), 0.2);
  border-radius: 10px;
  color: rgb(var(--v-theme-on-surface-variant));
  transition:
    background-color 0.18s ease,
    color 0.18s ease,
    border-color 0.18s ease;
}

.tags-view__tab:hover {
  background: rgba(var(--v-theme-surface-variant), 0.55);
}

.tags-view__tab--active {
  border-color: rgba(var(--v-theme-primary), 0.35);
  background: rgba(var(--v-theme-primary), 0.1);
  color: rgb(var(--v-theme-primary));
}

.tags-view__close {
  display: grid;
  place-items: center;
  padding: 0;
  border: 0;
  background: transparent;
  line-height: 1;
  color: inherit;
  opacity: 0.65;
}

.tags-view__close:hover {
  background: rgba(var(--v-theme-on-surface), 0.1);
  opacity: 1;
}
</style>
