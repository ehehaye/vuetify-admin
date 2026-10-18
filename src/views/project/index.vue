<script setup lang="ts">
import ProjectSchema from './components/ProjectSchema.vue';
import { deleteProject, getProjects } from '@/api/project';
import { formatDate } from '@rthx/utils';
import toast from '@/utils/toast';
import { useFocus } from '@vueuse/core';

defineOptions({ name: 'ProjectList' });

const tableRef = ref<IoGC<'DataTable'>>(null);
const projectSchemaRef = ref<IoC<typeof ProjectSchema>>(null);
const nameRef = ref(null);

useFocus(nameRef);

const query = reactive({ name: '' });

const headers = computed(() => [
  {
    title: '项目名称',
    align: 'center',
    sortable: false,
    key: 'name',
    minWidth: 180,
    fixed: true,
  },
  {
    title: '分钟',
    align: 'center',
    key: 'time',
    minWidth: 90,
  },
  {
    title: '项目类别',
    align: 'center',
    sortable: false,
    key: 'category',
    minWidth: 90,
  },
  {
    title: '展示价格（¥）',
    align: 'center',
    key: 'price',
    minWidth: 150,
  },
  {
    title: '项目类型',
    align: 'center',
    sortable: false,
    key: 'type',
    minWidth: 90,
  },
  {
    title: '独享房间',
    align: 'center',
    key: 'occupy',
    value: (item) => (item.occupy ? '是' : '否'),
    minWidth: 120,
  },
  {
    title: '成本比例（%）',
    align: 'center',
    key: 'percent',
    minWidth: 160,
  },
  {
    title: '更新时间',
    align: 'center',
    key: 'lastModifyTime',
    value: (item) => formatDate(item.lastModifyTime, 'yyyy-MM-dd HH:mm:ss'),
    minWidth: 190,
  },
  {
    title: '操作',
    align: 'center',
    sortable: false,
    key: 'actions',
    minWidth: 200,
    fixed: true,
  },
]);
</script>

<template>
  <div class="tw:h-full tw:w-full tw:overflow-hidden">
    <DataTable
      ref="tableRef"
      :headers
      :load-data-fn="(options) => getProjects({ ...query, ...options })"
    >
      <template #search>
        <v-row class="tw:px-4">
          <v-col class="tw:py-0" cols="12">
            <v-text-field
              ref="nameRef"
              v-model="query.name"
              variant="underlined"
              autofocus
              placeholder="请输入关键字查询"
              clearable
            />
          </v-col>
        </v-row>
      </template>

      <template #actions>
        <AuthProvider :required="['project:add']">
          <v-btn
            class="tw:mr-2"
            variant="tonal"
            @click="projectSchemaRef.open()"
          >
            新增项目
          </v-btn>
        </AuthProvider>
      </template>

      <template #item.time="{ item }">
        <v-chip :color="item.time >= 60 ? 'primary' : 'dark'">
          {{ item.time }}
        </v-chip>
      </template>

      <template #item.actions="{ item }">
        <ActionBtn type="view" @click="projectSchemaRef.open(item.id)" />

        <AuthProvider :required="['project:update']">
          <ActionBtn type="edit" @click="projectSchemaRef.open(item.id)" />
        </AuthProvider>

        <AuthProvider :required="['project:delete']">
          <ActionBtn
            type="delete"
            @click="
              async () => {
                await deleteProject(item.id);
                toast.success({ message: '删除项目成功' });
                tableRef.refresh();
              }
            "
          />
        </AuthProvider>
      </template>
    </DataTable>

    <ProjectSchema
      ref="projectSchemaRef"
      @edit-success="tableRef.refresh()"
      @add-success="tableRef.refresh()"
    />
  </div>
</template>
