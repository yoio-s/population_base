import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import globals from './utils/globals'
import common from './utils/common'
import '@/assets/css/basis.scss'
import 'lib-flexible'
import api from './api/api'
// import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import element from './element/index'
import * as filters from './filter/index'
import VueClipboard from 'vue-clipboard2'
import moment from 'moment' // 导入模块

// import { Button, Table, TableColumn, Pagination, Form, FormItem, Input } from 'element-ui'

// Vue.use(ElementUI, {
//   size: 'small',
// })
// Vue.use(Table, {size:'small'}).use(TableColumn).use(Pagination).use(Form).use(FormItem).use(Input)
Vue.use(element)

Vue.use(globals)
Vue.use(common)
Vue.use(api)

// 双击复制引入
Vue.use(VueClipboard)

moment.locale('zh-cn') // 设置语言 或 moment.lang('zh-cn');
Vue.prototype.$moment = moment // 赋值使用

// 全局引入过滤器
Object.keys(filters).forEach(item => {
  Vue.filter(item, filters[item])
})

Vue.config.productionTip = false

Vue.prototype.globals = globals
Vue.prototype.common = common
Vue.prototype.api = api
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
