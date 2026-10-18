import plugins from './plugins';
import './mock';
import './assets/styles/tailwind.css';
import App from './App.vue';

const app = createApp(App);

app.use(plugins).mount('#app');
