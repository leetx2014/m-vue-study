import Vue from 'vue'
import App from './App.vue'

// import router from './router'
import router from './router-m'

// import store from './store'
import store from './store-m'

Vue.config.productionTip = false

// 事件总线
Vue.prototype.$bus = new Vue()

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
