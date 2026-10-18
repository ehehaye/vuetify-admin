<script setup lang="ts">
import { useTagsViewStore } from '@/store/modules/tagsView';

defineProps({
  targetIndex: {
    type: Number,
    default: 0,
  },
});

const { views } = storeToRefs(useTagsViewStore());
const emit = defineEmits<{
  close: [targetIndex: number];
  closeRight: [targetIndex: number];
  closeLeft: [targetIndex: number];
  closeOthers: [targetIndex: number];
}>();
</script>

<template>
  <v-list dense class="tw:py-0">
    <v-list-item dense @click="() => emit('close', targetIndex)">
      <template #prepend>
        <v-icon class="tw:mr-1" small :size="16" tag="span">
          keyboard_arrow_down
        </v-icon>
        <v-list-item-title>关闭选中标签</v-list-item-title>
      </template>
    </v-list-item>
    <v-list-item
      dense
      :disabled="targetIndex >= views.length - 1"
      @click="() => emit('closeRight', targetIndex)"
    >
      <template #prepend>
        <v-icon class="tw:mr-1" small :size="16" tag="span">
          keyboard_arrow_right
        </v-icon>
        <v-list-item-title>关闭右侧标签</v-list-item-title>
      </template>
    </v-list-item>
    <v-list-item
      dense
      :disabled="targetIndex < 1"
      @click="() => emit('closeLeft', targetIndex)"
    >
      <template #prepend>
        <v-icon class="tw:mr-1" small :size="16" tag="span">
          keyboard_arrow_left
        </v-icon>
        <v-list-item-title>关闭左侧标签</v-list-item-title>
      </template>
    </v-list-item>
    <v-list-item
      dense
      :disabled="views.length <= 1"
      @click="emit('closeOthers', targetIndex)"
    >
      <template #prepend>
        <v-icon class="tw:mr-1" small :size="16" tag="span">
          keyboard_arrow_up
        </v-icon>
        <v-list-item-title>关闭其他标签</v-list-item-title>
      </template>
    </v-list-item>
  </v-list>
</template>
