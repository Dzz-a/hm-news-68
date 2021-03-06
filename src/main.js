import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 导入通用样式
import './styles/base.less'
import './styles/iconfont.css'
// 导入amfe-flexble组件
import 'amfe-flexible'
// 全局注册组件
import './utils/global'
// 全局配置axios请求
import './utils/request'
// 全局配置过滤器
import './utils/filters'
// 全局导入vant
import './utils/vant'
// 创建bus
const bus = new Vue()
// 把bus挂载到vue的原型上
Vue.prototype.$bus = bus

Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
