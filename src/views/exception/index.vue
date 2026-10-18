<script setup lang="ts">
import image from '@/assets/images/vuetify.png';

defineOptions({ name: 'Exception' });
</script>

<template>
  <v-empty-state
    headline="Whoops, 404"
    title="Page not found"
    text="The page you were looking for does not exist"
    :image
    min-height="80%"
  ></v-empty-state>
</template>
