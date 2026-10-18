<script setup lang="ts">
import event from './event';
import type { Payload } from './event';

type QueueItem = {
  text: string;
  color: Payload['color'];
  timeout: number;
};

const queue = ref<QueueItem[]>([]);

function addItem({ message, color, timeout }: Payload) {
  queue.value.push({ text: message, color, timeout });
}

onMounted(() => event.on(addItem));
onBeforeUnmount(() => event.off(addItem));
</script>

<template>
  <v-snackbar-queue v-model="queue" location="top" :total-visible="3" />
</template>
