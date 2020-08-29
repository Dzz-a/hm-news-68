<template>
<div>
 <hm-header><slot>注册</slot></hm-header>
 <hm-logo></hm-logo>
 <van-form @submit="register">
  <van-field
    v-model="user.username"
    label="用户名"
    placeholder="用户名"
    :rules="rules.username"
  />
   <van-field
    v-model="user.nickname"
    label="昵称"
    placeholder="请输入昵称"
    :rules="rules.nickname"
  />
  <van-field
    v-model="user.password"
    type="password"
    label="密码"
    placeholder="密码"
    :rules="rules.password"
  />
  <div style="margin: 16px;">
    <van-button round block type="info" native-type="submit">
      注册
    </van-button>
    <p class="tips">已有账号？去<router-link to="/login">登录</router-link></p>
  </div>
</van-form>
</div>
</template>

<script>

export default {

  data () {
    return {
      user: {
        username: '',
        nickname: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请填写用户名', trigger: 'onChange' },
          { pattern: /^\d{5,11}$/, message: '用户长度是5-11位数字', trigger: 'onChange' }
        ],
        nickname: [
          { required: true, massage: '昵称不能为空', trigger: 'onChange' },
          { pattern: /^[\u4e00-\u9fa5]{2,6}$/, message: '昵称必须是2-6位汉字' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'onChange' },
          { pattern: /^\d{3,9}$/, message: '密码必须是3-9位数字' }
        ]
      }
    }
  },
  methods: {
    async register () {
      const res = await this.$axios.post('/register', this.user)
      const { statusCode, message } = res.data
      // console.log(res.data)
      if (statusCode === 200) {
        this.$toast.success(message)
        // 路由传参 方式1-query 注册成功后跳转到登录页面，同时把用户注册的信息也传过去  缺点，用户密码也在地址栏中显示
        // this.$router.push(`/login?username=${this.user.username}&password=${this.user.password}`)
        // 路由传参 方式2-通过对象的方式把数据穿过去
        // this.$router.push({
        //   path: '/login',
        //   query: this.user
        // })
        // 路由传参 方式3-通过params传递(动态的路由参数) 想要这这方式传参，要通过路由的name属性
        this.$router.push({
          name: 'login',
          params: {
            username: this.user.username,
            password: this.user.password

          }
        })
      } else {
        this.$toast.fail(message)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.tips{
  padding: 15px;
  font-size: 16px;
  text-align: center;
}

</style>
