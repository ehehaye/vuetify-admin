<script setup lang="ts">
interface Props {
  title: string;
  subtitle?: string;
  icon?: string;
}

withDefaults(defineProps<Props>(), {
  subtitle: '',
  icon: '',
});
</script>

<template>
  <div
    class="tw:flex tw:flex-wrap tw:items-start tw:justify-between tw:gap-4 tw:pb-5"
  >
    <div class="tw:flex tw:items-center tw:gap-3">
      <div
        v-if="icon"
        class="tw:grid tw:h-11 tw:w-11 tw:place-items-center tw:rounded-xl tw:bg-primary/10 tw:text-primary"
      >
        <v-icon :icon="icon" size="24" />
      </div>
      <div>
        <h1 class="text-h5 tw:font-semibold">{{ title }}</h1>
        <p v-if="subtitle" class="text-body-2 text-medium-emphasis tw:mt-1">
          {{ subtitle }}
        </p>
      </div>
    </div>

    <div class="tw:flex tw:items-center tw:gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>
