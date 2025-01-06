import { Plugin } from 'vue';
import Vue3AMap from '@rthx/vue3-amap';
import '@rthx/vue3-amap/dist/index.css';
import toast from '@/utils/toast';

const plugin: Plugin = function (app) {
  app.use(Vue3AMap, {
    key: import.meta.env.VITE_AMAP_JS_KEY,
    version: '2.0',
    errorHandler(error) {
      toast.error({ message: `高德地图: ${error.message}` });
    },
  });
};

export default plugin;
