import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './styles/base.less'
import './styles/iconfont.css'

// 全局导入vant
import Vant from 'vant'
import 'vant/lib/index.css'
// 按需加载vant
// import { Button } from 'vant'
// Vue.use(Button)
import 'amfe-flexible'

// 引入hm-header组件
import HmHeader from './components/HmHeader.vue'
// 引入hm-logo 组件
import HmLogo from './components/HmLogo.vue'

// 全局注册组件
Vue.component('hm-header', HmHeader)
Vue.component('hm-logo', HmLogo)
Vue.use(Vant)

Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
