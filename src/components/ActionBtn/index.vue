<script setup lang="ts">
type ActionType = 'view' | 'edit' | 'delete';

const props = withDefaults(
  defineProps<{ type: ActionType; disabled?: boolean }>(),
  { disabled: false },
);

const emit = defineEmits<{ click: [] }>();

const actions = {
  view: { label: '查看', icon: 'visibility', color: 'info' },
  edit: { label: '编辑', icon: 'edit', color: 'primary' },
  delete: { label: '删除', icon: 'delete', color: 'error' },
} as const;

const action = computed(() => actions[props.type]);
</script>

<template>
  <v-tooltip :text="action.label" location="top">
    <template #activator="{ props: activatorProps }">
      <v-icon-btn
        v-bind="activatorProps"
        :icon="action.icon"
        :icon-color="action.color"
        :aria-label="action.label"
        :disabled="disabled"
        size="small"
        variant="text"
        @click="emit('click')"
      />
    </template>
  </v-tooltip>
</template>
