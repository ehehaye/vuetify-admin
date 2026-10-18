<script setup lang="ts">
import type { VForm } from 'vuetify/components';

interface Props {
  modelValue: boolean;
  title?: string;
  subtitle?: string;
  loading?: boolean;
  width?: number | string;
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  subtitle: '',
  loading: false,
  width: 560,
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  submit: [];
  closed: [];
}>();

const formRef = ref<InstanceType<typeof VForm> | null>(null);

function close() {
  emit('update:modelValue', false);
}

async function submit() {
  const { valid } = (await formRef.value?.validate()) ?? { valid: false };
  if (valid) emit('submit');
}

watch(
  () => props.modelValue,
  async (open) => {
    if (open) return;
    await nextTick();
    formRef.value?.resetValidation();
    emit('closed');
  },
);

defineExpose({ submit, close });
</script>

<template>
  <v-navigation-drawer
    :model-value="modelValue"
    :width="width"
    location="right"
    temporary
    class="form-drawer"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="tw:flex tw:h-full tw:flex-col">
      <div
        class="tw:flex tw:items-start tw:justify-between tw:gap-4 tw:border-b tw:border-outline/20 tw:px-6 tw:py-5"
      >
        <div class="tw:min-w-0">
          <h2 class="text-h6 tw:font-semibold">{{ title }}</h2>
          <p v-if="subtitle" class="text-body-2 text-medium-emphasis tw:mt-1">
            {{ subtitle }}
          </p>
        </div>
        <v-icon-btn
          icon="close"
          size="small"
          aria-label="关闭"
          @click="close"
        />
      </div>

      <v-form
        ref="formRef"
        class="tw:flex tw:min-h-0 tw:flex-1 tw:flex-col"
        @submit.prevent="submit"
      >
        <div class="tw:min-h-0 tw:flex-1 tw:overflow-y-auto tw:px-6 tw:py-5">
          <slot name="content" />
        </div>

        <div
          class="tw:flex tw:shrink-0 tw:items-center tw:gap-2 tw:border-t tw:border-outline/20 tw:px-6 tw:py-4"
        >
          <slot name="actions">
            <v-spacer />
            <v-btn variant="text" @click="close">取消</v-btn>
            <v-btn color="primary" type="submit" :loading="loading">
              保存
            </v-btn>
          </slot>
        </div>
      </v-form>
    </div>

    <Spin :model-value="loading" />
  </v-navigation-drawer>
</template>
