<script setup lang="ts">
const props = defineProps<{ item: RouteConfig }>();

const route = useRoute();

const visible = computed(() => !props.item.meta?.hidden);
const isGroup = computed(() => Boolean(props.item.children?.length));
const isActive = computed(() => route.path === props.item.path);
</script>

<template>
  <template v-if="visible">
    <v-list-group v-if="isGroup" :value="item.path">
      <template #activator="{ props: activatorProps }">
        <v-list-item
          v-bind="activatorProps"
          :prepend-icon="item.meta?.icon || 'folder'"
          :title="item.name"
        />
      </template>

      <NavItem v-for="child in item.children" :key="child.path" :item="child" />
    </v-list-group>

    <v-list-item
      v-else
      :to="item.path"
      :prepend-icon="item.meta?.icon"
      :title="item.name"
      :active="isActive"
      exact
    />
  </template>
</template>
