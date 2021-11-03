import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUi from 'element-ui'
import '../node_modules/element-ui/lib/theme-chalk/index.css'

import axios from "./network/axios"
import jquery from "jquery"
import './assets/css/global.css'
import less from 'less'

// 导入工具类
import './utils/filters'

Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.prototype.$ = jquery

Vue.use(less)
Vue.use(ElementUi)
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
