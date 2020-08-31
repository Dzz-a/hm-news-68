import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './styles/base.less'
import './styles/iconfont.css'

// 全局导入vant
import Vant, { Toast } from 'vant'
import 'vant/lib/index.css'
// 按需加载vant
// import { Button } from 'vant'
// Vue.use(Button)
import 'amfe-flexible'

// 引入hm-header组件
import HmHeader from './components/HmHeader.vue'
// 引入hm-logo 组件
import HmLogo from './components/HmLogo.vue'
import HmNavItem from './components/HmNavItem'

// 引入axios，并且挂载到vue的原型上
import axios from 'axios'
import moment from 'moment'
Vue.prototype.$axios = axios
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // config 请求的配置信息
  // 获取到当前的token，放到请求头中和请求一起发送过去
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = token
  }
  // return config是什么意思？ 返回出来交给服务器，不然的话没有返回值就不会发送请求到服务器了
  return config
})
// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 拦截到响应信息的时候解析出当前的状态码，消息
  const { statusCode, message } = response.data
  if (statusCode === 401 && message === '用户信息验证失败') {
    // 1.跳转登录页面
    router.push('/login')
    // 2.清除失效的信息
    localStorage.removeitem('token')
    localStorage.removeitem('userId')
    // 3.给提示 用户验证失败
    Toast.fail('登录信息失效')
  }
  return response
})
// 给axios配置默认的baseURL,基准地址
// axios.defaults.baseURL = 'http://192.168.144.22:3000'
axios.defaults.baseURL = 'http://localhost:3000'
// 定义全局过滤器
Vue.filter('time', input => {
  return moment(input).format('YYYY-MM-DD')
})
// 全局注册组件
Vue.component('hm-header', HmHeader)
Vue.component('hm-logo', HmLogo)
Vue.component('hm-navitem', HmNavItem)
Vue.use(Vant)

Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
