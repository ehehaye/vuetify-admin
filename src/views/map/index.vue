<script setup lang="ts">
import { useTimeoutFn } from '@vueuse/core';
import { useSettingStore } from '@/store/modules/settings';

const { isDark } = storeToRefs(useSettingStore());

const loading = ref(true);
const failed = ref(false);
const mapKey = ref(0);

const { start: startTimer, stop: stopTimer } = useTimeoutFn(
  () => {
    if (loading.value) {
      loading.value = false;
      failed.value = true;
    }
  },
  12000,
  { immediate: false },
);

function onComplete() {
  stopTimer();
  loading.value = false;
  failed.value = false;
}

function retry() {
  failed.value = false;
  loading.value = true;
  mapKey.value += 1;
  startTimer();
}

onMounted(startTimer);
</script>

<template>
  <div
    class="tw:mx-auto tw:flex tw:h-full tw:w-full tw:max-w-[1500px] tw:flex-col"
  >
    <v-card
      class="tw:relative tw:min-h-0 tw:flex-1 tw:overflow-hidden"
      variant="outlined"
    >
      <Spin :model-value="loading">
        <div class="tw:absolute tw:inset-0">
          <AMapMap
            :key="mapKey"
            class="tw:h-full tw:w-full"
            :map-style="isDark ? 'dark' : 'normal'"
            @complete="onComplete"
          >
            <a-map-fit-view />
            <a-map-toolbar />
            <a-map-scale />
            <a-map-control-bar />
          </AMapMap>
        </div>
      </Spin>

      <div
        v-if="failed"
        class="tw:absolute tw:inset-0 tw:flex tw:items-center tw:justify-center tw:bg-surface/90"
      >
        <v-empty-state
          icon="map"
          title="地图加载失败"
          text="请检查网络连接或高德地图 Key 配置。"
        >
          <template #actions>
            <v-btn color="primary" @click="retry">重新加载</v-btn>
          </template>
        </v-empty-state>
      </div>
    </v-card>
  </div>
</template>
