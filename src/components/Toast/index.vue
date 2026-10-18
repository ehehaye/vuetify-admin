<script setup lang="ts">
import event, { Payload } from './event';

defineOptions({ name: 'Toast' });

const timeoutId = ref<ReturnType<typeof setTimeout> | null>(null);
const items = ref<Payload[]>([]);

const enqueue = () => {
  const [{ id, timeout }] = items.value;
  if (!timeoutId.value) {
    timeoutId.value = setTimeout(dequeue, timeout, id);
  }
};

const dequeue = (id: Payload['id']) => {
  if (timeoutId.value) {
    clearTimeout(timeoutId.value);
    timeoutId.value = null;
  }

  const index = items.value.findIndex((i) => i.id === id);
  items.value.splice(index, 1);

  if (items.value.length) {
    enqueue();
  }
};

const addItem = (payload: Payload) => {
  items.value.push(payload);
  enqueue();
};

onMounted(() => {
  event.on(addItem);
});

onBeforeUnmount(() => {
  event.off(addItem);
});
</script>

<template>
  <div class="toast">
    <v-fade-transition mode="out-in" group>
      <!-- https://github.com/vuejs/vue/issues/8516#issuecomment-937505336 -->
      <div v-for="(item, i) in items" v-show="i === 0" :key="item.id">
        <v-snackbar
          absolute
          :color="item.color"
          :timeout="item.timeout"
          location="top"
          :model-value="i === 0"
        >
          {{ item.message }}
          <template #actions>
            <v-btn
              v-if="items.length > 1"
              color="white"
              variant="text"
              @click="dequeue(item.id)"
            >
              下一条 （{{ items.length - 1 }} +）
            </v-btn>
            <v-btn
              v-else
              color="white"
              variant="text"
              icon
              @click="dequeue(item.id)"
            >
              <v-icon>close</v-icon>
            </v-btn>
          </template>
        </v-snackbar>
      </div>
    </v-fade-transition>
  </div>
</template>
