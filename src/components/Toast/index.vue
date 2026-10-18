<script setup lang="ts">
import event, { Payload } from './event';

defineOptions({ name: 'Toast' });

type QueueItem = { text: string; color: Payload['color']; timeout: number };

const queue = ref<QueueItem[]>([]);

const addItem = ({ message, color, timeout }: Payload) => {
  queue.value.push({ text: message, color, timeout });
};

onMounted(() => {
  event.on(addItem);
});

onBeforeUnmount(() => {
  event.off(addItem);
});
</script>

<template>
  <v-snackbar-queue v-model="queue" location="top" :total-visible="1">
    <template #actions="{ props }">
      <v-btn
        v-if="queue.length"
        color="white"
        variant="text"
        @click="props.onClick"
      >
        下一条 （{{ queue.length }} +）
      </v-btn>
      <v-icon-btn
        v-else
        color="white"
        icon="close"
        variant="text"
        @click="props.onClick"
      />
    </template>
  </v-snackbar-queue>
</template>
