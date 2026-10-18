<script setup lang="ts">
import {
  addProject,
  editProject,
  getProject,
  ProjectInfo,
} from '@/api/project';
import toast from '@/utils/toast';
import { useRules } from 'vuetify';

defineOptions({ name: 'ProjectSchema' });

const nameRules = useRules(() => [['required', '请输入项目名称']]);
const typeRules = useRules(() => [['required', '请选择项目类型']]);
const categoryRules = useRules(() => [['required', '请选择项目类别']]);
const priceRules = useRules(() => [['required', '请输入展示价格']]);
const timeRules = useRules(() => [['required', '请输入总时长']]);
const percentRules = useRules(() => [['required', '请输入成本比例']]);
const occupyRules = useRules(() => [
  (v) => typeof v === 'boolean' || '请选择独享房间',
]);
const tagsRules = useRules(() => [
  ['required', '请输入功效标签'],
  ['maxLength', 12, '最多输入12个字符'],
]);

const emit = defineEmits<{
  (e: 'addSuccess'): void;
  (e: 'editSuccess'): void;
}>();

const uploadRef = ref<IoGC<'ImgUpload'>>(null);

const getDefaultModel = () =>
  ({
    id: '',
    name: '',
    type: '',
    category: '',
    price: '',
    time: '',
    percent: '',
    occupy: null,
    tags: '',
  }) as ProjectInfo;

const model = ref(getDefaultModel());
const loading = ref(false);
const visible = ref(false);

const add = async () => {
  await addProject(model.value);
  toast.success({ message: '新增项目成功' });
  emit('addSuccess');
};

const edit = async () => {
  await editProject(model.value);
  toast.success({ message: '编辑项目成功' });
  emit('editSuccess');
};

const open = async (id?: string) => {
  try {
    visible.value = true;
    loading.value = true;
    if (id) {
      model.value = await getProject(id);
    }
  } finally {
    loading.value = false;
  }
};

const close = () => {
  visible.value = false;
};

const reset = () => {
  model.value = getDefaultModel();
  uploadRef.value.reset();
};

const submit = async () => {
  try {
    loading.value = true;
    await (model.value.id ? edit() : add());
    close();
  } finally {
    loading.value = false;
  }
};

defineExpose({ open });
</script>

<template>
  <FormDrawer
    v-model="visible"
    flat
    :loading="loading"
    :title="`${model.id ? '编辑' : '新增'}项目`"
    :width="680"
    :after-close="reset"
    @submit="submit"
  >
    <template #content>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="model.name"
              variant="underlined"
              label="项目名称"
              :rules="nameRules"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-select
              v-model="model.type"
              variant="underlined"
              :items="['拔罐', '推拿', '足疗']"
              :rules="typeRules"
              label="项目类型"
            />
          </v-col>
          <v-col cols="6">
            <v-radio-group
              v-model="model.category"
              :rules="categoryRules"
              label="项目类别"
              inline
            >
              <v-radio color="primary" label="常规" value="常规" />
              <v-radio color="primary" label="会员" value="会员" />
            </v-radio-group>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model.number="model.price"
              variant="underlined"
              :rules="priceRules"
              label="展示价格（¥）"
            />
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model.number="model.time"
              variant="underlined"
              :rules="timeRules"
              label="分钟"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model.number="model.percent"
              variant="underlined"
              type="number"
              :rules="percentRules"
              label="成本比例（%）"
            />
          </v-col>
          <v-col cols="6">
            <v-radio-group
              v-model="model.occupy"
              color="primary"
              :rules="occupyRules"
              label="独享房间"
              inline
            >
              <v-radio color="primary" label="否" :value="false" />
              <v-radio color="primary" label="是" :value="true" />
            </v-radio-group>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="tw:py-0" cols="12">
            <v-text-field
              v-model="model.tags"
              variant="underlined"
              counter="12"
              label="功效标签"
              :rules="tagsRules"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <ImgUpload ref="uploadRef" flat />
          </v-col>
        </v-row>
      </v-container>
    </template>

    <template #actions>
      <v-spacer />
      <v-btn size="large" variant="text" @click="close"> 取消 </v-btn>
      <v-btn size="large" variant="text" type="submit"> 保存 </v-btn>
    </template>
  </FormDrawer>
</template>
