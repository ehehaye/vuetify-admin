import 'vuetify/styles';
import { createRulesPlugin, createVuetify } from 'vuetify';
import { aliases, md } from 'vuetify/iconsets/md';
import { zhHans } from 'vuetify/locale';
import { Plugin } from 'vue';
import theme from '@/config/theme';

const plugin: Plugin = function (app) {
  const vuetify = createVuetify({
    icons: {
      defaultSet: 'md',
      aliases,
      sets: {
        md,
      },
    },
    locale: {
      locale: 'zhHans',
      fallback: 'zhHans',
      messages: { zhHans },
    },
    theme: {
      defaultTheme: 'indigo_light',
      ...theme,
    },
    display: {
      thresholds: {
        md: 960,
        lg: 1280,
        xl: 1920,
        xxl: 2560,
      },
    },
  });

  app.use(vuetify);
  app.use(createRulesPlugin({}, vuetify.locale));
};

export default plugin;
