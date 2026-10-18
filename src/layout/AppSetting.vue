<script setup lang="ts">
import { Color, colors } from '@/config/theme';
import { useSettingStore } from '@/store/modules/settings';

defineOptions({
  name: 'AppSetting',
});

const settingStore = useSettingStore();
</script>

<template>
  <v-navigation-drawer
    :model-value="settingStore.setting"
    location="right"
    temporary
    @update:model-value="settingStore.toggleSetting"
  >
    <template #prepend>
      <v-toolbar :height="settingStore.headerHeight" color="primary lighten-1">
        <v-toolbar-title>个性化设置</v-toolbar-title>
      </v-toolbar>
    </template>

    <v-container>
      <div class="tw:flex tw:flex-col">
        <div>
          <p class="tw:px-1 tw:my-2">导航栏设置</p>
          <v-switch
            color="primary"
            :model-value="settingStore.permanentNavigation"
            label="导航栏固定左侧"
            @change="settingStore.togglePermanentNavigation"
          />
        </div>

        <div>
          <p class="tw:px-1 tw:my-2">外观</p>
          <v-switch
            color="primary"
            label="深色模式"
            :model-value="settingStore.dark"
            @change="settingStore.toggleDark"
          />
        </div>

        <div>
          <p class="tw:px-1 tw:my-2">页签模式</p>
          <v-switch
            color="primary"
            label="多页签"
            :model-value="settingStore.tagsView"
            @change="settingStore.toggleTagsView"
          />
        </div>

        <div>
          <p class="tw:px-1 tw:my-2">主题色设置</p>
          <div class="tw:flex tw:flex-row tw:flex-wrap">
            <label
              v-for="c in Object.keys(colors)"
              :key="c"
              class="tw:group tw:relative tw:block tw:basis-1/2 tw:grow-0 tw:max-w-[50%] tw:cursor-pointer tw:p-1"
            >
              <input
                class="tw:sr-only"
                type="radio"
                :checked="c === settingStore.color"
                @input="settingStore.setColor(c as Color)"
              />
              <span
                class="tw:relative tw:mb-[15px] tw:block tw:overflow-hidden tw:bg-[#f1f1f1] tw:shadow-[0_0_2px_rgb(0_0_0/0.1)]"
              >
                <span
                  class="tw:absolute tw:inset-0 tw:hidden tw:items-center tw:justify-center tw:bg-black/30 tw:text-white tw:group-has-[:checked]:flex"
                >
                  <span class="material-icons">check</span>
                </span>
                <span
                  class="tw:inline-block tw:h-2.5 tw:w-1/2"
                  :style="{ backgroundColor: colors[c as Color].base }"
                />
                <span
                  class="tw:inline-block tw:h-2.5 tw:w-1/2"
                  :style="{ backgroundColor: colors[c as Color].base }"
                />
                <span class="tw:inline-block tw:h-5 tw:w-1/2 tw:bg-white" />
              </span>
            </label>
          </div>
        </div>
      </div>
    </v-container>
  </v-navigation-drawer>
</template>
