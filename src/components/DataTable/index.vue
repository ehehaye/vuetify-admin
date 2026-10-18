<script setup lang="ts">
import { usePromiseFn } from '@/composables';
import { Res, Props, getDefaultRes } from './types';
import TableFooter from './TableFooter.vue';

defineOptions({
  name: 'DataTable',
});

const props = withDefaults(defineProps<Props>(), {
  loadDataFn: () => Promise.resolve(getDefaultRes()),
  headers: () => [],
  multiSort: false,
});

const headers = computed(() =>
  props.headers.map((item) => ({
    ...item,
    // 禁用 v-data-table-virtual 本地排序，而使用远程排序
    sortRaw: () => {},
    sort: () => {},
  })),
);

const formRef = ref<IoGC<'VForm'>>(null);
const options = ref<TableReq>({
  page: 1,
  itemsPerPage: 25,
  sortBy: [],
  groupBy: [],
});

const { loading, result, error, exec } = usePromiseFn<Res>(
  props.loadDataFn,
  getDefaultRes(),
);

onMounted(() => {
  watch(options, fetch, { immediate: true, deep: true });
});

async function fetch(ops = {}) {
  await nextTick();
  const { valid } = await formRef.value.validate();
  if (valid) {
    await exec(Object.assign({}, options.value, ops));
    await scrollToTop();
  }
}

async function refresh(firstPage = false) {
  if (firstPage && options.value.page !== 1) {
    options.value.page = 1;
  } else {
    fetch(options.value);
  }
}

function scrollToTop() {
  const tableWrapper = document.querySelector('.v-table__wrapper');
  tableWrapper.scroll({ top: 0, behavior: 'smooth' });
}

defineExpose({ refresh });
</script>

<template>
  <div class="data-table tw:w-full tw:h-full tw:flex tw:flex-col">
    <v-form
      class="tw:mt-4 tw:mb-4"
      ref="formRef"
      @submit.prevent="refresh(true)"
    >
      <slot name="search" />

      <div class="tw:flex tw:flex-row tw:pb-1 tw:px-2">
        <slot name="actions" />
        <v-spacer />
        <v-btn class="tw:mr-2" variant="tonal" type="submit"> 查询 </v-btn>
        <v-btn variant="tonal" @click="refresh()"> 刷新 </v-btn>
      </div>
    </v-form>

    <div class="tw:grow tw:overflow-hidden">
      <v-data-table-virtual
        v-keep-scroll="['.v-table__wrapper']"
        class="tw:shadow-none tw:w-full tw:h-full tw:flex tw:flex-col tw:overflow-x-hidden"
        fixed-header
        fixed-footer
        :headers
        :items="result.items"
        :loading
        loading-text="加载中"
        :multi-sort="props.multiSort"
        :no-data-text="error ? '加载失败' : loading ? '加载中' : '暂无数据'"
        v-model:sort-by="options.sortBy"
        v-model:group-by="options.groupBy"
      >
        <template v-for="(_, slot) of $slots" #[slot]="scope">
          <slot :name="slot" v-bind="scope" />
        </template>

        <template #bottom>
          <TableFooter :options :result />
        </template>
      </v-data-table-virtual>
    </div>
  </div>
</template>
