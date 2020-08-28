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
    placeholder="昵称"
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
          { required: 'true', message: '请填写用户名', trigger: 'onChange' },
          { pattern: /^\d{5,11}$/, message: '用户长度是5-11位数字', trigger: 'onChange' }
        ],
        nickname: [
          { required: 'true', massage: '昵称不能为空', trigger: 'onChange' },
          { pattern: /^[\u4e00-\u9fa5]{2,6}/, message: '昵称必须是2-6位汉字' }
        ],
        password: [
          { required: 'true', message: '密码不能为空', trigger: 'onChange' },
          { pattern: /^\d{3,9}$/, message: '密码必须是3-9位数字' }
        ]
      }
    }
  },
  methods: {
    async register () {
      const res = await this.$axios.post('/login', this.user)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        this.$router.push('/login')
      } else {
        this.$toast.fail(message)
      }
    }
  }
}
</script>

<style></style>
