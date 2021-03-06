/* 处理axios发送请求 */
import Vue from 'vue'
import router from '../router/index'
import { Toast } from 'vant'
// 引入axios，并且挂载到vue的原型上
import axios from 'axios'
Vue.prototype.$axios = axios
// 给axios配置默认的baseURL,基准地址
// axios.defaults.baseURL = 'http://192.168.144.22:3000'
const URL = 'http://localhost:3000'
axios.defaults.baseURL = URL
Vue.prototype.$base = URL
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

// 处理图片路径的函数
Vue.prototype.$url = function (url) {
  if (url.startsWith('http')) {
    // 网络图片
    return url
  } else {
    return URL + url
  }
}
