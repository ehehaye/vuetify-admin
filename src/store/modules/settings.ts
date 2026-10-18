import { useLocalStorage, useMediaQuery } from '@vueuse/core';
import { useDisplay, useTheme } from 'vuetify';
import { readStoredTheme, resolveThemeName } from '@/config/theme';
import type { Color, ThemeMode } from '@/config/theme';

export const useSettingStore = defineStore('setting', () => {
  const { xs, lgAndUp } = useDisplay();
  const theme = useTheme();
  const stored = readStoredTheme();

  const headerHeight = computed(() => (xs.value ? 56 : 64));
  const navigation = ref(lgAndUp.value);
  const permanentNavigation = useLocalStorage('permanent-navigation', true);
  const color = useLocalStorage<Color>('theme-color', stored.color);
  const mode = useLocalStorage<ThemeMode>('theme-mode', stored.mode);
  const setting = useLocalStorage('settings-open', false);
  const tagsView = useLocalStorage('tags-view', true);

  const systemDark = useMediaQuery('(prefers-color-scheme: dark)');
  const isDark = computed(
    () =>
      mode.value === 'dark' || (mode.value === 'system' && systemDark.value),
  );
  const themeName = computed(() => resolveThemeName(color.value, mode.value));
  const permanent = computed(() => permanentNavigation.value && lgAndUp.value);
  const drawerOpen = computed(() => permanent.value || navigation.value);

  watch(
    themeName,
    (name, previous) => {
      theme.change(name, previous ? { duration: '300ms' } : undefined);
    },
    { immediate: true },
  );

  watch(lgAndUp, (value) => {
    navigation.value = value;
  });

  function setColor(value: Color) {
    color.value = value;
  }

  function setMode(value: ThemeMode) {
    mode.value = value;
  }

  function toggleDark() {
    mode.value = isDark.value ? 'light' : 'dark';
  }

  function toggleNavigation() {
    navigation.value = !navigation.value;
  }

  function setNavigation(value: boolean) {
    navigation.value = value;
  }

  function togglePermanentNavigation() {
    permanentNavigation.value = !permanentNavigation.value;
    // 桌面端切换为浮动导航时，保持抽屉状态与开关一致
    if (lgAndUp.value) {
      navigation.value = permanentNavigation.value;
    }
  }

  function toggleSetting() {
    setting.value = !setting.value;
  }

  function toggleTagsView() {
    tagsView.value = !tagsView.value;
  }

  function closeNavigation() {
    if (!permanent.value) {
      navigation.value = false;
    }
  }

  return {
    headerHeight,
    navigation,
    permanentNavigation,
    color,
    mode,
    setting,
    tagsView,
    isDark,
    themeName,
    permanent,
    drawerOpen,
    setColor,
    setMode,
    toggleDark,
    toggleNavigation,
    setNavigation,
    togglePermanentNavigation,
    toggleSetting,
    toggleTagsView,
    closeNavigation,
  };
});
