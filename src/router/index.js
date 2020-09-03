import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入组件
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import User from '../views/User.vue'
import UserEdit from '../views/UserEdit.vue'
import MyFollow from '../views/MyFollow.vue'
import MyComment from '../views/MyComment.vue'
import MyStar from '../views/MyStar.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/login', component: Login, name: 'login' },
  { path: '/register', component: Register, name: 'register' },
  { path: '/user', component: User, name: 'user' },
  { path: '/user-edit', component: UserEdit, name: 'user-edit' },
  { path: '/my-follow', component: MyFollow, name: 'my-follow' },
  { path: '/my-comment', component: MyComment, name: 'my-comment' },
  { path: '/my-star', component: MyStar, name: 'my-star' }
]

const router = new VueRouter({
  routes
})
// 只要路由发生跳转，跳转之前就要执行这个函数
router.beforeEach(function (to, from, next) {
  // 判断要跳转的路径是否是user，是的话就判断是否有token，有的话就跳转，没有就跳转到登录页面，如果不是去user页面，就跳转想去的页面
  // if (to.name === 'user') {
  //   // 获取到当前的token
  //   const token = localStorage.getItem('token')
  //   if (token) {
  //     next()
  //   } else {
  //     router.push('/login')
  //   }
  // } else {
  //   next()
  // }
  const token = localStorage.getItem('token')
  const authUrls = ['/user', '/user-edit', '/my-follow', '/my-comment', '/my-star']
  // 如果要去的页面不是authUrls里的页面或者有token，就直接去，是那里的页面或者没有token的话就去登录页
  if (!authUrls.includes(to.path) || token) {
    next()
  } else {
    router.push('/login')
  }
})
// （解决重复跳转到当前路由的异常）
// 方案一
// router.push('/login').catch(err => err)
// 方案二 // 全局的把push的异常处理（解决重复跳转到当前路由的异常）
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
export default router
