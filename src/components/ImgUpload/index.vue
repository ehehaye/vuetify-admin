<script setup lang="ts">
import toast from '@/components/Toast';

interface Props {
  modelValue?: string;
  readonly?: boolean;
  maxSize?: number;
  label?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  readonly: false,
  maxSize: 1024,
  label: '项目封面',
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const file = ref<File | File[] | undefined>();
const preview = ref(props.modelValue);
const maxMB = computed(() => Math.round(props.maxSize / 1024));

const selectedFile = (value: File | File[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const rules = computed(() => [
  (value: File | File[] | null) => {
    const selected = Array.isArray(value) ? value[0] : value;
    return (
      !selected ||
      selected.size <= props.maxSize * 1024 ||
      `图片大小不能超过 ${maxMB.value}MB`
    );
  },
]);

const readAsDataUrl = (value: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(value);
  });

watch(file, async (value) => {
  const selected = selectedFile(value);

  if (!selected) {
    preview.value = props.modelValue;
    emit('update:modelValue', '');
    return;
  }

  try {
    const dataUrl = await readAsDataUrl(selected);
    preview.value = dataUrl;
    emit('update:modelValue', dataUrl);
  } catch {
    toast.error({ message: '图片读取失败' });
  }
});

watch(
  () => props.modelValue,
  (value) => {
    if (!selectedFile(file.value)) preview.value = value;
  },
);

function reset() {
  file.value = undefined;
  preview.value = props.modelValue;
}

function handleRejected() {
  toast.error({ message: '请选择图片文件' });
}

defineExpose({ reset });
</script>

<template>
  <div class="tw:space-y-2">
    <div class="text-body-2 tw:font-medium">{{ label }}</div>

    <v-file-upload
      v-model="file"
      accept="image/*"
      filter-by-type="image/*"
      inset-file-list
      :readonly="readonly"
      :rules="rules"
      @rejected="handleRejected"
    >
      <template #title> {{ label }}（最大 {{ maxMB }}MB） </template>

      <template #single="{ props: itemProps }">
        <div class="img-upload__preview">
          <img v-if="preview" :src="preview" :alt="label" />
          <div v-else class="img-upload__empty">
            <v-icon icon="image" size="36" />
            <span class="text-body-2">图片预览</span>
          </div>

          <v-icon-btn
            v-if="!readonly"
            icon="close"
            size="small"
            aria-label="移除图片"
            variant="text"
            @click.stop="itemProps['onClick:remove']"
          />
        </div>
      </template>
    </v-file-upload>
  </div>
</template>

<style scoped>
.img-upload__preview {
  position: relative;
  display: flex;
  min-height: 160px;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  background: rgba(var(--v-theme-surface-variant), 0.4);
}

.img-upload__preview img {
  max-width: 100%;
  max-height: 220px;
  border-radius: 8px;
  object-fit: contain;
}

.img-upload__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: rgb(var(--v-theme-on-surface-variant));
}
</style>
