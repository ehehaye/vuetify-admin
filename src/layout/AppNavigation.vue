<script setup lang="ts">
import { useAccountStore } from '@/store/modules/account';
import { useSettingStore } from '@/store/modules/settings';
import { useOpenedMenus } from '@/composables/layout';

defineOptions({
  name: 'AppNavigation',
});

const { menus: items } = storeToRefs(useAccountStore());
const { permanentNavigation, navigation } = storeToRefs(useSettingStore());
const { toggleNavigation } = useSettingStore();
const opened = useOpenedMenus();
const placeholderIcon = 'description';
</script>

<template>
  <v-navigation-drawer
    :model-value="permanentNavigation || navigation"
    :permanent="permanentNavigation"
    @update:model-value="toggleNavigation"
  >
    <v-treeview
      :activatable="false"
      active-strategy="leaf"
      color="primary"
      class="pt-0"
      :items
      item-title="name"
      item-props="meta"
      item-value="path"
      height="100%"
      collapse-icon=""
      expand-icon=""
      :opened
    >
      <template #prepend="{ item }">
        <v-icon>{{ item.meta.icon || placeholderIcon }}</v-icon>
      </template>

      <template #append="{ isActive, item }">
        <v-icon v-if="item.children?.length">{{
          isActive ? 'expand_less' : 'expand_more'
        }}</v-icon>
      </template>

      <template #item="{ props }">
        <v-treeview-item
          v-if="!props.isHidden"
          :height="48"
          :title="props.title"
          :to="props.value"
          :active="opened.includes(props.value)"
        >
          <template #prepend>
            <v-icon>{{ props.icon || placeholderIcon }}</v-icon>
          </template>
        </v-treeview-item>
      </template>
    </v-treeview>
  </v-navigation-drawer>
</template>
