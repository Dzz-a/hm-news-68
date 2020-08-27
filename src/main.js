import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './styles/base.less'
import './styles/iconfont.css'
// 全局导入vant
import Vant from 'vant'

import 'vant/lib/index.css'
Vue.use(Vant)
// 按需加载vant
// import { Button } from 'vant'
// Vue.use(Button)

Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
