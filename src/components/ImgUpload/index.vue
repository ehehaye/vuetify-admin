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

const imgInputerRef = ref<IoGC<'ImgInputer'>>(null);
const file = ref(null);

const maxMB = computed(() => props.maxSize / 1024);

function handleExceedMaxSize() {
  toast.error({ message: `图片大小超出${maxMB.value}兆` });
  reset();
}

function handleFileChange(e) {
  if (!/image/.test(e.type)) {
    toast.error({ message: '上传文件非图片' });
    reset();
  }
}

function onUploadStart() {}

function onUploadProgress() {}

function onUploadSuccess() {}

function onUploadError() {}

function reset() {
  file.value = null;
  imgInputerRef.value.reset();
  imgInputerRef.value.$refs.inputer.value = '';
}

defineExpose({ reset });
</script>

<template>
  <!-- auto-upload -->
  <!-- action="//jsonplaceholder.typicode.com/posts/" -->
  <ImgInputer
    ref="imgInputerRef"
    v-model="file"
    :class="{ 'tw:shadow-none': flat }"
    icon="img"
    accept="image/*"
    :img-src="imgSrc"
    :max-size="maxSize"
    :on-start="onUploadStart"
    :on-progress="onUploadProgress"
    :on-success="onUploadSuccess"
    :on-error="onUploadError"
    :no-hover-effect="readonly"
    :placeholder="`${placeholder}（最大${maxMB}M）`"
    :readonly="readonly"
    readonly-tip-text=""
    :size="size"
    theme="material"
    @on-exceed="handleExceedMaxSize"
    @on-change="handleFileChange"
  />
</template>
