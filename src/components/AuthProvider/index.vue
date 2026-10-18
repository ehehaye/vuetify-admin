<script setup lang="ts">
import { usePermissions } from '@/composables/usePermissions';

const props = withDefaults(defineProps<{ required?: string | string[] }>(), {
  required: '',
});

const { hasPermission } = usePermissions();
const allowed = hasPermission(() => props.required);
</script>

<template>
  <slot v-if="allowed" />
</template>
