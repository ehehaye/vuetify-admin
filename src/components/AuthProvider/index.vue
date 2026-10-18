<script setup lang="ts">
import { hasPermissions } from '@/composables/auth';

const props = withDefaults(defineProps<{ required?: string | string[] }>(), {
  required: '',
});

const allowed = computed(() => hasPermissions(props.required));
</script>

<template>
  <slot v-if="allowed" />
</template>
