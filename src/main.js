import '@babel/polyfill'
import './plugins'
import './directives'
import vuetify from './plugins/vuetify'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './mock'

Vue.config.productionTip = false
Vue.config.devtools = process.env.NODE_ENV === 'development'

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app')
