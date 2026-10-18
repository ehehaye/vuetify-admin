<script setup lang="ts">
import { sleep } from '@rthx/utils';

defineOptions({ name: 'FollowMenu' });

const menu = ref<boolean>(false);
const x = ref(0);
const y = ref(0);

const show = async (e: MouseEvent) => {
  e.preventDefault();
  if (menu.value) {
    menu.value = false;
    await sleep(130);
  }
  x.value = e.clientX;
  y.value = e.clientY;
  menu.value = true;
};

defineExpose({
  show,
});
</script>

<template>
  <v-menu
    v-model="menu"
    :target="[x, y]"
    location-strategy="connected"
    location="bottom start"
    transition="scale-transition"
  >
    <slot />
  </v-menu>
</template>
