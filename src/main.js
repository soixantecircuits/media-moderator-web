import Vue from 'vue'
import VueMaterial from 'vue-material'
import App from './components/App'
import router from './lib/router'
import store from './vuex/store'

Vue.use(VueMaterial)

const app = new Vue({
  router,
  store,
  ...App
}).$mount('#app');
