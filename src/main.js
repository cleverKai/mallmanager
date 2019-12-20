// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import myHttpServer from '@/plugins/http.js'
import ElementUI from 'element-ui'
import moment from 'moment'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/reset.css'

import router from './router'
Vue.config.productionTip = false
// 使用element-ui插件
Vue.use(ElementUI)
Vue.use(myHttpServer)
// eslint-disable-next-line no-new
// 全局过滤器 -- 处理时间格式
Vue.filter('fmtDate', function (v) {
  return moment(v).format('YYYY-MM-DD HH:mm:ss')
})
// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
