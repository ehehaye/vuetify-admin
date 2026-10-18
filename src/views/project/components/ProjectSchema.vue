<script setup lang="ts">
import { useRules } from 'vuetify';
import { addProject, editProject, getProject } from '@/api/project';
import type { ProjectCategory, ProjectInfo, ProjectType } from '@/api/project';
import toast from '@/components/Toast';

type Mode = 'create' | 'edit' | 'view';

interface ProjectForm {
  id?: string;
  name: string;
  type: ProjectType;
  category: ProjectCategory;
  tags: string;
  percent: number | null;
  price: number | null;
  time: number | null;
  occupy: boolean;
  image: string;
}

const emit = defineEmits<{ saved: [mode: 'create' | 'edit'] }>();

const typeOptions: ProjectType[] = ['拔罐', '推拿', '足疗'];
const categoryOptions: ProjectCategory[] = ['常规', '会员'];

const visible = ref(false);
const loading = ref(false);
const mode = ref<Mode>('create');
const model = ref<ProjectForm>(createEmpty());

const nameRules = useRules(() => [['required', '请输入项目名称']]);
const tagsRules = useRules(() => [
  ['required', '请输入功效标签'],
  ['maxLength', 12, '最多输入 12 个字符'],
]);
const priceRules = useRules(() => [
  (value: number | null) =>
    (value !== null && value >= 0) || '请输入有效的展示价格',
]);
const timeRules = useRules(() => [
  (value: number | null) => (value !== null && value > 0) || '请输入总时长',
]);
const percentRules = useRules(() => [
  (value: number | null) =>
    (value !== null && value >= 0 && value <= 100) ||
    '请输入 0 - 100 之间的比例',
]);

const isView = computed(() => mode.value === 'view');
const title = computed(() =>
  isView.value ? '项目详情' : model.value.id ? '编辑项目' : '新增项目',
);
const subtitle = computed(() =>
  isView.value ? '查看项目基础信息' : '完善项目基础信息与价格',
);

function createEmpty(): ProjectForm {
  return {
    name: '',
    type: '推拿',
    category: '常规',
    tags: '',
    percent: null,
    price: null,
    time: null,
    occupy: false,
    image: '',
  };
}

function toForm(project: ProjectInfo): ProjectForm {
  return {
    id: project.id,
    name: project.name,
    type: project.type,
    category: project.category,
    tags: project.tags,
    percent: project.percent,
    price: project.price,
    time: project.time,
    occupy: project.occupy,
    image: project.image ?? '',
  };
}

function toPayload(): ProjectInfo {
  return {
    id: model.value.id,
    name: model.value.name.trim(),
    type: model.value.type,
    category: model.value.category,
    tags: model.value.tags.trim(),
    percent: model.value.percent ?? 0,
    price: model.value.price ?? 0,
    time: model.value.time ?? 0,
    occupy: model.value.occupy,
    image: model.value.image || undefined,
  };
}

async function open(id?: string, nextMode: Mode = 'edit') {
  mode.value = id ? nextMode : 'create';
  model.value = createEmpty();
  visible.value = true;

  if (!id) return;

  loading.value = true;
  try {
    model.value = toForm(await getProject(id));
  } catch {
    visible.value = false;
  } finally {
    loading.value = false;
  }
}

function close() {
  visible.value = false;
}

function reset() {
  model.value = createEmpty();
  mode.value = 'create';
}

async function submit() {
  if (isView.value) return;

  loading.value = true;
  try {
    const payload = toPayload();
    if (payload.id) {
      await editProject(payload);
      toast.success({ message: '编辑项目成功' });
      emit('saved', 'edit');
    } else {
      await addProject(payload);
      toast.success({ message: '新增项目成功' });
      emit('saved', 'create');
    }
    close();
  } catch {
    // 请求层已统一提示错误
  } finally {
    loading.value = false;
  }
}

defineExpose({ open });
</script>

<template>
  <FormDrawer
    v-model="visible"
    :title="title"
    :subtitle="subtitle"
    :loading="loading"
    @submit="submit"
    @closed="reset"
  >
    <template #content>
      <v-row density="compact">
        <v-col cols="12">
          <v-text-field
            v-model="model.name"
            label="项目名称"
            :rules="nameRules"
            :readonly="isView"
          />
        </v-col>

        <v-col cols="12" sm="6">
          <v-select
            v-model="model.type"
            label="项目类型"
            :items="typeOptions"
            :readonly="isView"
          />
        </v-col>

        <v-col cols="12" sm="6">
          <v-select
            v-model="model.category"
            label="项目类别"
            :items="categoryOptions"
            :readonly="isView"
          />
        </v-col>

        <v-col cols="12" sm="6">
          <v-number-input
            v-model="model.price"
            label="展示价格"
            prefix="¥"
            :min="0"
            :step="1"
            :readonly="isView"
            :rules="priceRules"
          />
        </v-col>

        <v-col cols="12" sm="6">
          <v-number-input
            v-model="model.time"
            label="总时长"
            suffix="分钟"
            :min="0"
            :step="5"
            :readonly="isView"
            :rules="timeRules"
          />
        </v-col>

        <v-col cols="12" sm="6">
          <v-number-input
            v-model="model.percent"
            label="成本比例"
            suffix="%"
            :min="0"
            :max="100"
            :step="1"
            :readonly="isView"
            :rules="percentRules"
          />
        </v-col>

        <v-col cols="12" sm="6">
          <v-switch
            v-model="model.occupy"
            label="独享房间"
            color="primary"
            :readonly="isView"
          />
        </v-col>

        <v-col cols="12">
          <v-text-field
            v-model="model.tags"
            label="功效标签"
            counter="12"
            :rules="tagsRules"
            :readonly="isView"
          />
        </v-col>

        <v-col cols="12">
          <ImgUpload
            v-model="model.image"
            label="项目封面"
            :readonly="isView"
          />
        </v-col>
      </v-row>
    </template>

    <template #actions>
      <v-spacer />
      <v-btn variant="text" @click="close">
        {{ isView ? '关闭' : '取消' }}
      </v-btn>
      <v-btn v-if="!isView" color="primary" type="submit" :loading="loading">
        保存
      </v-btn>
    </template>
  </FormDrawer>
</template>
