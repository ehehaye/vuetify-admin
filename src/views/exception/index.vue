<script setup lang="ts">
import { useTagsViewStore } from '@/store/modules/tagsView';

const router = useRouter();
const route = useRoute();
const tagsViewStore = useTagsViewStore();

onBeforeRouteLeave(() => {
  tagsViewStore.remove(route.path);
});
</script>

<template>
  <div
    class="tw:flex tw:h-full tw:items-center tw:justify-center tw:px-6 tw:py-10"
  >
    <v-empty-state
      icon="explore_off"
      headline="404"
      title="页面走丢了"
      text="你访问的页面不存在，或已被移动到其他位置。"
    >
      <template #actions>
        <v-btn
          variant="tonal"
          color="primary"
          prepend-icon="arrow_back"
          @click="router.back()"
        >
          返回上一页
        </v-btn>
        <v-btn
          color="primary"
          prepend-icon="home"
          @click="router.push('/home')"
        >
          回到首页
        </v-btn>
      </template>
    </v-empty-state>
  </div>
</template>
