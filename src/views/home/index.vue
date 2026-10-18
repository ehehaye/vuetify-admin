<script setup lang="ts">
import { useTheme } from 'vuetify';
import { getDashboard } from '@/api/dashboard';
import { usePromiseFn } from '@/composables';
import { useAccountStore } from '@/store/modules/account';
import { useSettingStore } from '@/store/modules/settings';

const router = useRouter();
const theme = useTheme();
const accountStore = useAccountStore();
const settingStore = useSettingStore();

const { username, menus } = storeToRefs(accountStore);
const { loading, result, error, exec } = usePromiseFn(getDashboard);

const today = computed(() =>
  new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(new Date()),
);

const canAccessMap = computed(() =>
  menus.value.some((menu) => menu.path === '/map'),
);

const stats = computed(() => {
  const data = result.value?.stats;
  return [
    {
      label: '项目总数',
      value: data ? `${data.total}` : '—',
      icon: 'apps',
      color: 'primary',
      hint: '全部服务项目',
    },
    {
      label: '平均展示价格',
      value: data ? `¥${data.avgPrice}` : '—',
      icon: 'payments',
      color: 'info',
      hint: '全部项目均值',
    },
    {
      label: '独享房间占比',
      value: data ? `${data.occupyRate}%` : '—',
      icon: 'meeting_room',
      color: 'success',
      hint: '启用独享房间的项目',
    },
    {
      label: '平均成本比例',
      value: data ? `${data.avgPercent}%` : '—',
      icon: 'percent',
      color: 'warning',
      hint: '成本 / 展示价格',
    },
  ];
});

const trendValues = computed(
  () => result.value?.trend?.map((point) => point.value) ?? [],
);
const trendLabels = computed(
  () => result.value?.trend?.map((point) => point.label) ?? [],
);
const primaryColor = computed(() => String(theme.current.value.colors.primary));
const typeTotal = computed(
  () => result.value?.types?.reduce((sum, item) => sum + item.value, 0) ?? 0,
);
const typeColors = ['primary', 'info', 'success', 'warning'] as const;

const typePercent = (value: number) =>
  typeTotal.value ? Math.round((value / typeTotal.value) * 100) : 0;

function load() {
  void exec().catch(() => {});
}

onMounted(load);
</script>

<template>
  <div class="tw:mx-auto tw:w-full tw:max-w-[1500px]">
    <PageHeader
      :title="`你好，${username || '朋友'}`"
      :subtitle="today"
      icon="dashboard"
    >
      <template #actions>
        <v-btn
          variant="tonal"
          prepend-icon="refresh"
          :loading="loading"
          @click="load"
        >
          刷新
        </v-btn>
        <v-btn
          color="primary"
          prepend-icon="apps"
          @click="router.push('/project/list')"
        >
          项目管理
        </v-btn>
      </template>
    </PageHeader>

    <v-alert v-if="error" class="tw:mb-4" type="error" :text="error.message">
      <template #append>
        <v-btn variant="text" size="small" @click="load">重试</v-btn>
      </template>
    </v-alert>

    <v-row density="compact" class="tw:mb-4">
      <v-col v-for="item in stats" :key="item.label" cols="12" sm="6" lg="3">
        <v-card class="tw:h-full">
          <v-card-text v-if="loading && !result">
            <v-skeleton-loader type="list-item-two-line" />
          </v-card-text>

          <v-card-text v-else class="tw:flex tw:h-full tw:flex-col tw:gap-4">
            <div
              class="tw:grid tw:h-11 tw:w-11 tw:place-items-center tw:rounded-xl"
              :style="{
                backgroundColor: `rgba(var(--v-theme-${item.color}), 0.12)`,
                color: `rgb(var(--v-theme-${item.color}))`,
              }"
            >
              <v-icon :icon="item.icon" size="22" />
            </div>

            <div>
              <div class="text-body-2 text-medium-emphasis">
                {{ item.label }}
              </div>
              <div class="text-h4 tw:mt-1 tw:font-semibold">
                {{ item.value }}
              </div>
              <div class="text-caption text-medium-emphasis tw:mt-1">
                {{ item.hint }}
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row density="compact" class="tw:mb-4">
      <v-col cols="12" md="4">
        <v-card class="tw:h-full">
          <v-card-item>
            <v-card-title class="text-subtitle-1 tw:font-semibold">
              项目更新趋势
            </v-card-title>
            <v-card-subtitle>近 6 个月有更新的项目数</v-card-subtitle>
          </v-card-item>

          <v-card-text
            class="tw:flex tw:min-h-[240px] tw:flex-col tw:justify-center"
          >
            <v-skeleton-loader v-if="loading && !result" type="image" />
            <v-sparkline
              v-else-if="trendValues.length"
              :model-value="trendValues"
              :labels="trendLabels"
              :gradient="[primaryColor]"
              gradient-direction="top"
              :line-width="3"
              :padding="12"
              :smooth="8"
              :height="180"
              label-size="11"
              show-labels
              fill
              auto-draw
            />
            <div
              v-else
              class="text-body-2 text-medium-emphasis tw:py-12 tw:text-center"
            >
              暂无趋势数据
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="tw:h-full">
          <v-card-item>
            <v-card-title class="text-subtitle-1 tw:font-semibold">
              项目类型分布
            </v-card-title>
            <v-card-subtitle>各类型项目数量占比</v-card-subtitle>
          </v-card-item>

          <v-card-text>
            <v-skeleton-loader
              v-if="loading && !result"
              type="list-item-three-line"
            />

            <template v-else-if="result?.types?.length">
              <div
                v-for="(item, index) in result.types"
                :key="item.label"
                class="tw:mb-5 last:tw:mb-0"
              >
                <div class="tw:mb-1 tw:flex tw:items-center tw:justify-between">
                  <span class="text-body-2 tw:font-medium">
                    {{ item.label }}
                  </span>
                  <span class="text-body-2 text-medium-emphasis">
                    {{ item.value }} 个 · {{ typePercent(item.value) }}%
                  </span>
                </div>
                <v-progress-linear
                  :model-value="typePercent(item.value)"
                  height="8"
                  rounded
                  :color="typeColors[index % typeColors.length]"
                />
              </div>
            </template>

            <div
              v-else
              class="text-body-2 text-medium-emphasis tw:py-8 tw:text-center"
            >
              暂无分类数据
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="tw:h-full">
          <v-card-item>
            <v-card-title class="text-subtitle-1 tw:font-semibold">
              快捷操作
            </v-card-title>
            <v-card-subtitle>常用入口</v-card-subtitle>
          </v-card-item>

          <v-list density="compact" class="tw:py-0">
            <v-list-item
              prepend-icon="apps"
              title="查看项目列表"
              subtitle="维护项目、价格与成本"
              to="/project/list"
            />
            <v-list-item
              v-if="canAccessMap"
              prepend-icon="place"
              title="打开地图示例"
              subtitle="地图组件与暗色主题联动"
              to="/map"
            />
            <v-list-item
              prepend-icon="palette"
              title="个性化设置"
              subtitle="主题色、暗色模式与页签"
              @click="settingStore.toggleSetting()"
            />
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
