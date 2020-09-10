<template>
<div>
   <hm-header><slot>登录</slot></hm-header>
   <hm-logo></hm-logo>
   <van-form @submit="login">
  <van-field
    v-model="username"
    name="用户名"
    label="用户名"
    placeholder="用户名"
    :rules="rules.username"
  />
  <van-field
    v-model="password"
    type="password"
    name="密码"
    label="密码"
    placeholder="请输入密码"
    :rules="rules.password"
  />
  <div style="margin: 16px;">
    <van-button round block type="info" native-type="submit">
      登录
    </van-button>
    <p class="tips">没有账号？去<router-link to="/register">注册</router-link></p>
  </div>
</van-form>

</div>

</template>

<script>

export default {
  created () {
    // 在初始化后，获取到注册页面传过来的数据 通过query传过来的
    // const { username, password } = this.$route.query
    // 通过params传过来的
    const { username, password } = this.$route.params
    // 把传过来的数据给到当前页面的用户名，密码
    this.username = username
    this.password = password
  },
  methods: {
    async login () {
      const res = await this.$axios.post('/login', {
        username: this.username,
        password: this.password
      })
      const { statusCode, message, data } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        // 在登录成功的时候，把token保存
        localStorage.setItem('token', data.token)
        localStorage.setItem('userId', data.user.id)
        if (this.$route.query.back) {
          // 判断路由有没有携带back的数据，有的话就回退跳转
          this.$router.back()
        } else {
          // 没有就跳转到user界面
          this.$router.push('./user')
        }
        // console.log(this.$router.push('/user'))
      } else {
        this.$toast.fail(message)
      }
    }
  },
  data () {
    return {
      username: '',
      password: '',
      rules: {
        username: [
          // 是否为必选字段 错误提示文案 本项规则的触发时机
          { required: true, message: '请填写用户名', trigger: 'onChange' },
          // pattern 通过正则表达式进行校验
          { pattern: /^\d{5,11}$/, message: '用户名长度是5-11位数字', trigger: 'onChange' }
        ],
        password: [
          { required: true, message: '请填写密码', trigger: 'onChange' },
          { pattern: /^\d{3,9}$/, message: '密码长度是3-9位数字', trigger: 'onChange' }
        ]
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
