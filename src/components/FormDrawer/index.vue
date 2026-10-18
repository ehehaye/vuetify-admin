<script setup lang="ts">
import { useSettingStore } from '@/store/modules/settings';

defineOptions({ name: 'FormDrawer' });

const props = defineProps({
  flat: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
  width: {
    type: Number,
    default: 650,
  },
  afterClose: {
    type: Function,
    default: () => {},
  },
});

const emit = defineEmits<{
  submit: [];
  'update:model-value': [value: boolean];
}>();

const formRef = ref<IoGC<'VForm'>>(null);

const { headerHeight } = storeToRefs(useSettingStore());

watch(
  () => props.modelValue,
  (open) => {
    if (!open) afterClose();
  },
);

const afterClose = async () => {
  props.afterClose();
  await nextTick();
  formRef.value.resetValidation();
};

const submit = async () => {
  const { valid } = await formRef.value.validate();
  if (valid) emit('submit');
};
</script>

<template>
  <Teleport to="#v-application">
    <v-navigation-drawer
      class="FormWrapper"
      :permanent="false"
      location="right"
      temporary
      :order="-1"
      :width="width"
      :model-value="modelValue"
      @update:model-value="emit('update:model-value', $event)"
    >
      <template #prepend>
        <v-toolbar :height="headerHeight" color="primary darken-1">
          <v-toolbar-title>
            {{ title }}
          </v-toolbar-title>
        </v-toolbar>
      </template>

      <v-form
        class="tw:flex tw:flex-col tw:h-full"
        ref="formRef"
        @submit.prevent="submit"
      >
        <v-card :flat="flat" class="tw:overflow-y-auto tw:flex-1">
          <v-card-text class="tw:grow">
            <slot name="content" />
          </v-card-text>
        </v-card>

        <Spin :model-value="loading" />
        <v-divider />
        <div class="tw:w-full tw:flex tw:flex-row">
          <slot name="actions" />
        </div>
      </v-form>
    </v-navigation-drawer>
  </Teleport>
</template>
