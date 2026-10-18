<script setup lang="ts" generic="T">
import type { DataTableHeader } from 'vuetify';

type ItemsPerPageOption = number | { value: number; title: string };

interface Props {
  headers: DataTableHeader<T>[];
  loadDataFn: (req: TableReq) => Promise<TableRes<T>>;
  params?: Record<string, unknown>;
  itemsPerPage?: number;
  itemsPerPageOptions?: ItemsPerPageOption[];
  multiSort?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  params: () => ({}),
  itemsPerPage: 25,
  itemsPerPageOptions: () => [10, 25, 50, 100, { value: -1, title: '全部' }],
  multiSort: false,
});

const RESERVED_SLOTS = new Set([
  'search',
  'actions',
  'no-data',
  'top',
  'bottom',
]);

const slots = useSlots();
const forwardedSlots = computed(() =>
  Object.fromEntries(
    Object.entries(slots).filter(([name]) => !RESERVED_SLOTS.has(name)),
  ),
);

const options = ref({
  page: 1,
  itemsPerPage: props.itemsPerPage,
  sortBy: [] as TableSortItem[],
});

const items = shallowRef<T[]>([]);
const total = ref(0);
const loading = ref(false);
const error = shallowRef<Error | null>(null);

let requestSequence = 0;

const optionsKey = computed(() => JSON.stringify(options.value));

const toRequest = (): TableReq => ({
  page: options.value.page,
  itemsPerPage: options.value.itemsPerPage,
  sortBy: options.value.sortBy,
  ...props.params,
});

async function load() {
  const sequence = ++requestSequence;
  loading.value = true;
  error.value = null;

  try {
    const result = await props.loadDataFn(toRequest());
    if (sequence !== requestSequence) return;

    // 删除末页最后一条数据后，回退到仍有内容的页码
    if (!result.items.length && result.total > 0 && options.value.page > 1) {
      options.value.page = Math.max(
        1,
        Math.ceil(result.total / options.value.itemsPerPage),
      );
      return;
    }

    items.value = result.items;
    total.value = result.total;
  } catch (cause) {
    if (sequence !== requestSequence) return;
    error.value = cause instanceof Error ? cause : new Error(String(cause));
    items.value = [];
    total.value = 0;
  } finally {
    if (sequence === requestSequence) {
      loading.value = false;
    }
  }
}

function reload(resetPage = true) {
  if (resetPage && options.value.page !== 1) {
    options.value.page = 1;
    return;
  }
  void load();
}

function refresh(resetPage = false) {
  reload(resetPage);
}

watch(optionsKey, () => void load(), { immediate: true });

defineExpose({ reload, refresh });
</script>

<template>
  <div
    class="data-table tw:flex tw:h-full tw:min-h-0 tw:w-full tw:flex-col tw:gap-4"
  >
    <form
      class="tw:flex tw:flex-wrap tw:items-center tw:gap-3"
      @submit.prevent="reload()"
    >
      <div class="tw:min-w-[220px] tw:flex-1">
        <slot name="search" />
      </div>

      <div class="tw:flex tw:items-center tw:gap-2">
        <slot name="actions" />
        <v-btn color="primary" type="submit" prepend-icon="search">
          查询
        </v-btn>
        <v-btn
          icon="refresh"
          variant="text"
          :loading="loading"
          aria-label="刷新"
          @click="reload(false)"
        />
      </div>
    </form>

    <div
      class="tw:min-h-0 tw:flex-1 tw:overflow-hidden tw:rounded-xl tw:border tw:border-outline/20"
    >
      <v-data-table-server
        v-model:page="options.page"
        v-model:items-per-page="options.itemsPerPage"
        v-model:sort-by="options.sortBy"
        class="tw:h-full"
        :headers="headers"
        :items="items"
        :items-length="total"
        :items-per-page-options="itemsPerPageOptions"
        :loading="loading"
        loading-text="加载中…"
        :multi-sort="multiSort"
        fixed-header
        fixed-footer
        hover
        no-data-text="暂无数据"
      >
        <template v-for="(_, slotName) in forwardedSlots" #[slotName]="scope">
          <slot :name="slotName" v-bind="scope ?? {}" />
        </template>

        <template #no-data>
          <slot name="no-data">
            <v-empty-state
              v-if="error"
              class="tw:py-10"
              icon="cloud_off"
              title="加载失败"
              :text="error.message"
            >
              <template #actions>
                <v-btn color="primary" @click="reload(false)">重新加载</v-btn>
              </template>
            </v-empty-state>
            <v-empty-state
              v-else
              class="tw:py-10"
              icon="inbox"
              title="暂无数据"
              text="调整筛选条件后再试试"
            />
          </slot>
        </template>
      </v-data-table-server>
    </div>
  </div>
</template>
