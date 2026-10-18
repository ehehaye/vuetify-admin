import { pageComponentName } from '@/router/helper';
import { useTagsViewStore } from '@/store/modules/tagsView';

export function useKeepAliveInclude() {
  const { views } = storeToRefs(useTagsViewStore());

  return computed(() =>
    views.value
      .filter((view) => view.keepAlive)
      .map((view) => pageComponentName(view.path)),
  );
}
