// 必须先于 Tailwind 导入，确保 Vuetify 的 CSS layer 顺序稳定
import installPlugins from './plugins';
import '@fontsource/roboto/latin-400.css';
import '@fontsource/roboto/latin-500.css';
import '@fontsource/roboto/latin-700.css';
import './assets/styles/tailwind.css';
import App from './App.vue';
import router from './router';

const removeBootSpinner = () => {
  document.getElementById('app_spinner_wrapper')?.remove();
};

const bootstrap = async () => {
  const useMock = import.meta.env.VITE_USE_MOCK
    ? import.meta.env.VITE_USE_MOCK === 'true'
    : import.meta.env.DEV;

  if (useMock) {
    await import('./mock');
  }

  const app = createApp(App);

  app.config.errorHandler = (error, _instance, info) => {
    // eslint-disable-next-line no-console
    console.error('[vue error]', error, info);
  };

  app.use(installPlugins);
  app.mount('#app');

  // 首屏路由异常时也要移除启动动画，避免页面一直停留在 Loading
  const spinnerTimeout = window.setTimeout(removeBootSpinner, 10000);

  try {
    await router.isReady();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[router] 初始化失败', error);
  } finally {
    clearTimeout(spinnerTimeout);
    removeBootSpinner();
  }
};

void bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('[bootstrap] 启动失败', error);
  removeBootSpinner();
});
