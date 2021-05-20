import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 加载 vant 组件库和样式
import Vant from 'vant'
import 'vant/lib/index.css'

// 自动设置 rem 基准值（ html 标签字体大小）
import 'amfe-flexible'

// 加载全局样式 建议放到最后 防止样式层级覆盖
import './styles/index.less'

// 引入全局过滤器相对时间格式化
import './utils/dayjs'

// 全局注册 vant 中的组件
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
