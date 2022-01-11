import Vue from 'vue'
import App from './App'

import router from './router'
Vue.config.productionTip = false
Vue.prototype.$bus = new Vue()
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
