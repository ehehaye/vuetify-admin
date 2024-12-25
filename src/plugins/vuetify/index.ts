import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import 'material-design-icons-iconfont';
import { aliases, md } from 'vuetify/iconsets/md';
import { zhHans } from 'vuetify/locale';
import * as labs from 'vuetify/labs/components';
import { Plugin } from 'vue';
import theme from '@/config/theme';

const plugin: Plugin = function (app) {
  const vuetify = createVuetify({
    components: {
      ...labs,
    },
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
    theme,
  });

  app.use(vuetify);
};

export default plugin;
