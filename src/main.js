import Vue from 'vue'
import App from './App.vue'

// import router from './router'
import router from './router-m'

Vue.config.productionTip = false

// 事件总线
Vue.prototype.$bus = new Vue()

new Vue({
  // 挂载
  router,
  render: h => h(App)
}).$mount('#app')
