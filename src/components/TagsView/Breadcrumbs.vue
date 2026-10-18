<script setup lang="ts">
import { useBreadcrumbs } from '@/composables/layout';

const items = useBreadcrumbs();
</script>

<template>
  <v-breadcrumbs class="tw:py-2 tw:my-0 tw:hidden tw:sm:flex" :items>
    <template #divider>
      <v-icon>forward</v-icon>
    </template>
  </v-breadcrumbs>
</template>
