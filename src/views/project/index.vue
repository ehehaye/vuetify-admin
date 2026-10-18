<script setup lang="ts">
import type { DataTableHeader } from 'vuetify';
import { formatDate } from '@rthx/utils';
import { deleteProject, getProjects } from '@/api/project';
import type { ProjectInfo } from '@/api/project';
import toast from '@/components/Toast';
import ProjectSchema from './components/ProjectSchema.vue';

interface DataTableExpose {
  reload: (resetPage?: boolean) => void;
  refresh: (resetPage?: boolean) => void;
}

interface ProjectSchemaExpose {
  open: (id?: string, mode?: 'edit' | 'view') => Promise<void>;
}

const tableRef = ref<DataTableExpose | null>(null);
const schemaRef = ref<ProjectSchemaExpose | null>(null);

const query = reactive({ name: '' });

const deleteDialog = ref(false);
const deleting = ref(false);
const deleteTarget = ref<ProjectInfo | null>(null);

const headers: DataTableHeader<ProjectInfo>[] = [
  {
    title: '项目名称',
    key: 'name',
    align: 'start',
    sortable: false,
    minWidth: 180,
  },
  {
    title: '时长',
    key: 'time',
    align: 'end',
    width: 120,
  },
  {
    title: '类别',
    key: 'category',
    align: 'start',
    width: 110,
  },
  {
    title: '展示价格',
    key: 'price',
    align: 'end',
    width: 130,
  },
  {
    title: '项目类型',
    key: 'type',
    align: 'start',
    width: 110,
  },
  {
    title: '独享房间',
    key: 'occupy',
    align: 'center',
    width: 120,
  },
  {
    title: '成本比例',
    key: 'percent',
    align: 'end',
    width: 170,
  },
  {
    title: '更新时间',
    key: 'lastModifyTime',
    align: 'start',
    minWidth: 170,
  },
  {
    title: '操作',
    key: 'actions',
    align: 'center',
    sortable: false,
    width: 150,
  },
];

function openCreate() {
  void schemaRef.value?.open();
}

function openView(project: ProjectInfo) {
  if (!project.id) return;
  void schemaRef.value?.open(project.id, 'view');
}

function openEdit(project: ProjectInfo) {
  if (!project.id) return;
  void schemaRef.value?.open(project.id, 'edit');
}

function confirmDelete(project: ProjectInfo) {
  deleteTarget.value = project;
  deleteDialog.value = true;
}

async function removeProject() {
  const id = deleteTarget.value?.id;
  if (!id) return;

  deleting.value = true;
  try {
    await deleteProject(id);
    toast.success({ message: '删除项目成功' });
    deleteDialog.value = false;
    deleteTarget.value = null;
    tableRef.value?.refresh(false);
  } catch {
    // 请求层已统一提示错误
  } finally {
    deleting.value = false;
  }
}
</script>

<template>
  <div
    class="tw:mx-auto tw:flex tw:h-full tw:w-full tw:max-w-[1500px] tw:flex-col"
  >
    <div class="tw:min-h-0 tw:flex-1">
      <DataTable
        ref="tableRef"
        :headers="headers"
        :params="query"
        :load-data-fn="(options) => getProjects({ ...query, ...options })"
      >
        <template #search>
          <v-text-field
            v-model="query.name"
            prepend-inner-icon="search"
            placeholder="搜索项目名称"
            clearable
            hide-details
          />
        </template>

        <template #actions>
          <AuthProvider :required="['project:add']">
            <v-btn color="primary" prepend-icon="add" @click="openCreate">
              新增项目
            </v-btn>
          </AuthProvider>
        </template>

        <template #item.time="{ item }">
          <v-chip
            size="small"
            variant="tonal"
            :color="item.time >= 60 ? 'primary' : 'secondary'"
          >
            {{ item.time }} 分钟
          </v-chip>
        </template>

        <template #item.category="{ item }">
          <v-chip size="small" variant="tonal">
            {{ item.category }}
          </v-chip>
        </template>

        <template #item.price="{ item }">
          <span class="tw:font-medium">¥{{ item.price }}</span>
        </template>

        <template #item.occupy="{ item }">
          <v-chip
            size="small"
            variant="tonal"
            :color="item.occupy ? 'success' : undefined"
          >
            {{ item.occupy ? '是' : '否' }}
          </v-chip>
        </template>

        <template #item.percent="{ item }">
          <div class="tw:flex tw:items-center tw:justify-end tw:gap-2">
            <v-progress-linear
              :model-value="item.percent"
              color="primary"
              height="6"
              rounded
              class="tw:w-16"
            />
            <span class="text-body-2">{{ item.percent }}%</span>
          </div>
        </template>

        <template #item.lastModifyTime="{ item }">
          <span class="text-body-2 text-medium-emphasis">
            {{
              item.lastModifyTime
                ? formatDate(item.lastModifyTime, 'yyyy-MM-dd HH:mm')
                : '—'
            }}
          </span>
        </template>

        <template #item.actions="{ item }">
          <ActionBtn type="view" @click="openView(item)" />

          <AuthProvider :required="['project:update']">
            <ActionBtn type="edit" @click="openEdit(item)" />
          </AuthProvider>

          <AuthProvider :required="['project:delete']">
            <ActionBtn type="delete" @click="confirmDelete(item)" />
          </AuthProvider>
        </template>
      </DataTable>
    </div>

    <ProjectSchema ref="schemaRef" @saved="tableRef?.refresh(false)" />

    <v-dialog v-model="deleteDialog" max-width="420">
      <v-card>
        <v-card-item>
          <template #title>删除项目</template>
        </v-card-item>

        <v-card-text class="text-body-2">
          确定删除「{{ deleteTarget?.name }}」吗？此操作不可撤销。
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false">取消</v-btn>
          <v-btn color="error" :loading="deleting" @click="removeProject">
            删除
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
