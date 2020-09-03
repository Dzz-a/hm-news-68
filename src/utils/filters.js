/* 配置全局过滤器 */
import Vue from 'vue'
import moment from 'moment'

// 定义全局过滤器
// 传递两个参数，如果没有用的时候没有传参，就默认当前的，有就用传进来的
Vue.filter('time', (input, str = 'YYYY-MM-DD') => {
  return moment(input).format(str)
})
