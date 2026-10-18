<script setup lang="ts">
import toast from '@/utils/toast';
import { PropType } from 'vue';

defineOptions({
  name: 'ImgUpload',
});

const props = defineProps({
  flat: {
    type: Boolean,
    default: false,
  },
  imgSrc: {
    type: String,
    default: '',
  },
  maxSize: {
    type: Number,
    default: 1024,
  },
  placeholder: {
    type: String,
    default: '点击或拖拽上传图片',
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String as PropType<'small' | 'normal' | 'large'>,
    default: 'normal',
    validator: (size: string) => ['small', 'normal', 'large'].includes(size),
  },
});

const file = ref<File | null>(null);
const previewUrl = ref(props.imgSrc);

const maxMB = computed(() => props.maxSize / 1024);

const rules = computed(() => [
  (v: File | null) =>
    !v || v.size <= props.maxSize * 1024 || `图片大小超出${maxMB.value}兆`,
]);

watch(file, (value) => {
  if (previewUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(previewUrl.value);
  }
  previewUrl.value = value ? URL.createObjectURL(value) : props.imgSrc;
});

onBeforeUnmount(() => {
  if (previewUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(previewUrl.value);
  }
});

function handleRejected() {
  toast.error({ message: '上传文件非图片' });
}

function reset() {
  file.value = null;
}

defineExpose({ reset });
</script>

<template>
  <v-file-upload
    v-model="file"
    accept="image/*"
    filter-by-type="image/*"
    inset-file-list
    :readonly="readonly"
    :rules="rules"
    :density="size === 'small' ? 'compact' : 'default'"
    :class="{ 'tw:shadow-none': flat }"
    @rejected="handleRejected"
  >
    <template #title> {{ placeholder }}（最大{{ maxMB }}M） </template>

    <template #single="{ props: itemProps }">
      <div class="img-upload__preview">
        <img v-if="previewUrl" :src="previewUrl" alt="" />
        <v-icon-btn
          v-if="!readonly"
          icon="close"
          size="small"
          variant="text"
          @click.stop="itemProps['onClick:remove']"
        />
      </div>
    </template>
  </v-file-upload>
</template>

<style lang="scss" scoped>
.img-upload__preview {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px;

  img {
    max-width: 100%;
    max-height: 200px;
    object-fit: contain;
  }
}
</style>
