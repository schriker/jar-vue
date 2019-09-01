import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import Vuebar from 'vuebar'

Vue.use(Vuebar)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
