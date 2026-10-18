import 'vuetify/styles';
import { createRulesPlugin, createVuetify } from 'vuetify';
import { aliases, md } from 'vuetify/iconsets/md';
import { zhHans } from 'vuetify/locale';
import type { Plugin } from 'vue';
import theme from '@/config/theme';

/**
 * 全局组件默认值：统一 Material Design 的形态、密度与层级，
 * 避免每个页面重复书写 variant / density / rounded。
 */
const defaults = {
  global: { ripple: true },
  VAppBar: { flat: true, color: 'surface', elevation: 0 },
  VToolbar: { flat: true },
  VCard: {
    rounded: 'lg',
    elevation: 0,
    variant: 'flat',
    border: true,
    color: 'surface',
  },
  VBtn: { rounded: 'lg', variant: 'flat' },
  VBtnToggle: { rounded: 'lg', variant: 'outlined', divided: true },
  VIconBtn: { rounded: 'lg', variant: 'text' },
  VTextField: {
    variant: 'outlined',
    density: 'comfortable',
    hideDetails: 'auto',
    color: 'primary',
  },
  VTextarea: {
    variant: 'outlined',
    density: 'comfortable',
    hideDetails: 'auto',
    color: 'primary',
  },
  VSelect: {
    variant: 'outlined',
    density: 'comfortable',
    hideDetails: 'auto',
    color: 'primary',
  },
  VAutocomplete: {
    variant: 'outlined',
    density: 'comfortable',
    hideDetails: 'auto',
    color: 'primary',
  },
  VNumberInput: {
    variant: 'outlined',
    density: 'comfortable',
    hideDetails: 'auto',
    color: 'primary',
  },
  VFileUpload: { rounded: 'lg' },
  VList: { density: 'comfortable', rounded: 'lg' },
  VListItem: { rounded: 'lg' },
  // order 小于 AppBar，使抽屉排在布局顶部之前，从而忽略顶部偏移并撑满整个高度
  VNavigationDrawer: { order: -1 },
  VChip: { rounded: 'lg' },
  VSnackbar: { rounded: 'lg' },
  VAlert: { rounded: 'lg', variant: 'tonal' },
  VProgressLinear: { rounded: true, color: 'primary' },
  VPagination: { density: 'comfortable', rounded: true },
  VSwitch: { color: 'primary', density: 'comfortable', hideDetails: 'auto' },
  VDataTable: { density: 'comfortable' },
};

const plugin: Plugin = function (app) {
  const vuetify = createVuetify({
    icons: {
      defaultSet: 'md',
      aliases,
      sets: { md },
    },
    locale: {
      locale: 'zhHans',
      fallback: 'zhHans',
      messages: { zhHans },
    },
    theme,
    display: {
      thresholds: {
        md: 960,
        lg: 1280,
        xl: 1920,
        xxl: 2560,
      },
    },
    defaults,
  });

  app.use(vuetify);
  app.use(createRulesPlugin({}, vuetify.locale));
};

export default plugin;
