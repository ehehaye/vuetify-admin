<script setup lang="ts">
import { Res } from './types';

defineOptions({
  name: 'TableFooter',
});

const props = defineProps<{
  options: TableReq;
  result: Res;
}>();

const { options, result } = toRefs(props);

const start = computed(() => {
  if (options.value.itemsPerPage === -1) return 0;
  return (options.value.page - 1) * options.value.itemsPerPage;
});

const end = computed(() => {
  const offset =
    options.value.itemsPerPage === -1
      ? result.value.total
      : options.value.itemsPerPage;
  return start.value + offset;
});

const range = computed(() => {
  if (result.value.total === 0) return '0';
  return `${start.value + 1} - ${end.value}`;
});
</script>

<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <div class="v-data-table-footer">
    <div class="v-data-table-footer__items-per-page">
      <span>每页数目：</span>
    </div>

    <v-select
      class="tw:flex-initial tw:min-w-[100px]"
      density="compact"
      hide-details
      :items="[
        { title: '10', value: 10 },
        { title: '25', value: 25 },
        { title: '50', value: 50 },
        { title: '100', value: 100 },
        { title: '全部', value: -1 },
      ]"
      variant="outlined"
      v-model:model-value="options.itemsPerPage"
    ></v-select>

    <div class="v-data-table-footer__info tw:min-w-[125px]">
      <span>{{ range }} 共 {{ result.total }}</span>
    </div>

    <div class="v-data-table-footer__pagination">
      <v-pagination
        density="comfortable"
        :length="
          options.itemsPerPage === -1
            ? 1
            : Math.ceil(result.total / options.itemsPerPage)
        "
        :totalVisible="0"
        rounded
        show-first-last-page
        variant="plain"
        v-model:model-value="options.page"
      ></v-pagination>
    </div>
  </div>
</template>
