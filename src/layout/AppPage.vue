<script setup lang="ts">
import AppHeader from '@/layout/AppHeader.vue';
import AppContent from '@/layout/AppContent.vue';
import AppNavigation from '@/layout/AppNavigation.vue';
import AppSetting from '@/layout/AppSetting.vue';
</script>

<template>
  <v-layout>
    <AppNavigation />
    <AppHeader />
    <AppContent />
    <AppSetting />
  </v-layout>
</template>
