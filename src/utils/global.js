/* 用于全局注册组件 */
import Vue from 'vue'
// 引入hm-header组件
import HmHeader from '../components/HmHeader.vue'
// 引入hm-logo 组件
import HmLogo from '../components/HmLogo.vue'
import HmNavItem from '../components/HmNavItem'

// 全局注册组件
Vue.component('hm-header', HmHeader)
Vue.component('hm-logo', HmLogo)
Vue.component('hm-navitem', HmNavItem)
