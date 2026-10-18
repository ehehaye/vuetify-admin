<template>
  <v-overlay
    :model-value="modelValue"
    contained
    persistent
    :opacity="0.55"
    content-class="d-flex align-center justify-center w-100 h-100"
  >
    <v-progress-circular color="primary" indeterminate size="48" width="4" />
  </v-overlay>
  <slot />
</template>

<script setup lang="ts">
withDefaults(defineProps<{ modelValue?: boolean }>(), {
  modelValue: false,
});
</script>
