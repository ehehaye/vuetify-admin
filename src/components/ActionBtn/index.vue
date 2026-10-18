<script setup lang="ts">
defineOptions({
  name: 'ActionBtn',
});

const props = defineProps<{
  type: 'view' | 'edit' | 'delete';
}>();

const emit = defineEmits(['click']);

const text = computed(
  () =>
    ({
      view: '详情',
      edit: '编辑',
      delete: '删除',
    })[props.type],
);

const icon = computed(
  () =>
    ({
      view: 'remove_red_eye',
      edit: 'edit',
      delete: 'delete',
    })[props.type],
);

const color = computed(
  () =>
    ({
      view: 'success darken-3',
      edit: 'blue darken-3',
      delete: 'red',
    })[props.type],
);
</script>

<template>
  <v-tooltip location="top" :text>
    <template v-slot:activator="{ props }">
      <v-icon-btn
        :icon
        :icon-color="color"
        variant="text"
        v-bind="props"
        @click="emit('click')"
      />
    </template>
  </v-tooltip>
</template>
