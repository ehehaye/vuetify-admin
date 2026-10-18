import { useDisplay, useTheme } from 'vuetify';
import { useLocalStorage } from '@vueuse/core';
import { Color, ThemeName } from '@/config/theme';

export const useSettingStore = defineStore('setting', () => {
  const { xs, lgAndUp } = useDisplay();

  const headerHeight = computed(() => (xs.value ? 48 : 56));
  const navigation = ref(!!lgAndUp.value);
  const permanentNavigation = useLocalStorage('permanentNavigation', true);
  const color = useLocalStorage<Color>('color', 'indigo');
  const dark = useLocalStorage('dark', false);
  const setting = useLocalStorage('setting', false);
  const tagsView = useLocalStorage('tagsView', true);

  const theme = useTheme();
  const tn = computed<ThemeName>(
    () => `${color.value}${dark.value ? '_dark' : '_light'}`,
  );
  watch(tn, (name) => theme.change(name), { immediate: true });

  function setColor(c: Color) {
    color.value = c;
  }

  function toggleDark() {
    dark.value = !dark.value;
  }

  function toggleNavigation() {
    navigation.value = !navigation.value;
  }

  function togglePermanentNavigation() {
    permanentNavigation.value = !permanentNavigation.value;
  }

  function toggleSetting() {
    setting.value = !setting.value;
  }

  function toggleTagsView() {
    tagsView.value = !tagsView.value;
  }

  return {
    headerHeight,
    navigation,
    permanentNavigation,
    color,
    dark,
    setting,
    tagsView,
    setColor,
    toggleDark,
    toggleNavigation,
    togglePermanentNavigation,
    toggleSetting,
    toggleTagsView,
  };
});
