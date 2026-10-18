<script setup lang="ts">
import { useSettingStore } from '@/store/modules/settings';

defineOptions({ name: 'MapExample' });

const { dark } = storeToRefs(useSettingStore());
const loading = ref(true);
</script>

<template>
  <div class="tw:relative tw:h-full tw:w-full">
    <Spin :model-value="loading">
      <AMapMap
        :map-style="dark ? 'dark' : 'normal'"
        @complete="loading = false"
      >
        <a-map-fit-view />
        <a-map-toolbar />
        <a-map-scale />
        <a-map-control-bar />
      </AMapMap>
    </Spin>
  </div>
</template>
