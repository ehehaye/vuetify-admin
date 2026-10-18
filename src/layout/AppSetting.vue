<script setup lang="ts">
import {
  colorLabels,
  colorOptions,
  type Color,
  type ThemeMode,
} from '@/config/theme';
import { useSettingStore } from '@/store/modules/settings';

const store = useSettingStore();

const colorList = (Object.keys(colorOptions) as Color[]).map((value) => ({
  value,
  label: colorLabels[value],
  hex: colorOptions[value].base,
}));

const mode = computed({
  get: () => store.mode,
  set: (value: ThemeMode) => store.setMode(value),
});

const permanentNavigation = computed({
  get: () => store.permanentNavigation,
  set: () => store.togglePermanentNavigation(),
});

const tagsView = computed({
  get: () => store.tagsView,
  set: () => store.toggleTagsView(),
});

function handleDrawer(value: boolean) {
  if (!value) store.toggleSetting();
}
</script>

<template>
  <!-- order 小于导航抽屉（全局默认 -1），否则临时遮罩会排在常驻导航下方 -->
  <v-navigation-drawer
    :model-value="store.setting"
    location="right"
    temporary
    :order="-2"
    :width="360"
    @update:model-value="handleDrawer"
  >
    <div class="tw:flex tw:h-full tw:flex-col">
      <div
        class="tw:flex tw:items-center tw:justify-between tw:border-b tw:border-outline/20 tw:px-5 tw:py-4"
      >
        <div>
          <h2 class="text-h6 tw:font-semibold">个性化设置</h2>
          <p class="text-caption text-medium-emphasis">调整界面外观与交互</p>
        </div>
        <v-icon-btn
          icon="close"
          size="small"
          aria-label="关闭设置"
          @click="store.toggleSetting()"
        />
      </div>

      <div
        class="tw:min-h-0 tw:flex-1 tw:space-y-7 tw:overflow-y-auto tw:px-5 tw:py-5"
      >
        <section>
          <div class="settings-label">主题模式</div>
          <v-btn-toggle
            v-model="mode"
            mandatory
            divided
            class="tw:mt-2 tw:w-full"
          >
            <v-btn value="light" class="tw:flex-1">
              <v-icon icon="light_mode" size="18" class="tw:mr-1" />
              浅色
            </v-btn>
            <v-btn value="dark" class="tw:flex-1">
              <v-icon icon="dark_mode" size="18" class="tw:mr-1" />
              深色
            </v-btn>
            <v-btn value="system" class="tw:flex-1">
              <v-icon icon="brightness_auto" size="18" class="tw:mr-1" />
              跟随系统
            </v-btn>
          </v-btn-toggle>
        </section>

        <section>
          <div class="settings-label">主题色</div>
          <div class="tw:mt-2 tw:grid tw:grid-cols-3 tw:gap-2">
            <button
              v-for="item in colorList"
              :key="item.value"
              type="button"
              class="color-swatch"
              :class="{ 'color-swatch--active': store.color === item.value }"
              :aria-pressed="store.color === item.value"
              @click="store.setColor(item.value)"
            >
              <span
                class="color-swatch__dot"
                :style="{ backgroundColor: item.hex }"
              >
                <v-icon
                  v-if="store.color === item.value"
                  class="color-swatch__check"
                  icon="check"
                  size="16"
                />
              </span>
              <span class="text-body-2">{{ item.label }}</span>
            </button>
          </div>
        </section>

        <section>
          <div class="settings-label">导航与页签</div>
          <v-switch
            v-model="permanentNavigation"
            label="固定左侧导航栏"
            color="primary"
            class="tw:mt-1"
          />
          <v-switch v-model="tagsView" label="显示多页签" color="primary" />
        </section>

        <section>
          <div class="settings-label">关于</div>
          <div class="text-body-2 text-medium-emphasis tw:mt-2">
            基于 Vue 3 + Vuetify 4 + Vite 构建的后台管理系统模板。
          </div>
        </section>
      </div>
    </div>
  </v-navigation-drawer>
</template>

<style scoped>
.settings-label {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgb(var(--v-theme-on-surface-variant));
}

.color-swatch {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border: 1px solid rgba(var(--v-theme-outline), 0.24);
  border-radius: 10px;
  color: rgb(var(--v-theme-on-surface));
  text-align: left;
  transition:
    border-color 0.18s ease,
    background-color 0.18s ease;
}

.color-swatch:hover {
  background: rgba(var(--v-theme-surface-variant), 0.5);
}

.color-swatch--active {
  border-color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.08);
}

.color-swatch__dot {
  display: grid;
  flex: none;
  width: 26px;
  height: 26px;
  place-items: center;
  border-radius: 50%;
}

.color-swatch__check {
  color: #fff;
}
</style>
