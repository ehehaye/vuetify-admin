<template>
  <div
    ref="container"
    class="tw:h-full tw:w-full tw:overflow-x-hidden tw:overflow-y-auto"
    @scroll.passive="onScroll"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
const container = ref<HTMLElement | null>(null);
let scrollTop = 0;

const onScroll = (event: Event) => {
  scrollTop = (event.target as HTMLElement).scrollTop;
};

onActivated(() => {
  void nextTick(() => {
    if (container.value) {
      container.value.scrollTop = scrollTop;
    }
  });
});
</script>
