import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import axios from "axios"
import "./assets/fonts/iconfont.js"
import "./assets/fonts/iconfont.css"
import ZKTable from 'vue-table-with-tree-grid'
Vue.prototype.$http = axios
axios.defaults.baseURL = "https://www.liulongbin.top:8888/api/private/v1"
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.config.productionTip = false

Vue.component('tree-table', ZKTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
