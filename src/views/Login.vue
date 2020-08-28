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
    placeholder="密码"
    :rules="rules.password"
  />
  <div style="margin: 16px;">
    <van-button round block type="info" native-type="submit">
      提交
    </van-button>
  </div>
</van-form>

</div>

</template>

<script>
import axios from 'axios'
export default {
  methods: {
    async login () {
      const res = await axios.post('http://192.168.144.21/:3000/login', {
        username: this.username,
        password: this.password
      })
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
      } else {
        this.$$toast.fail(message)
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

<style lang="less">
.box {
  width: 150px;
  height: 150px;
  background-color: #445554;
}
</style>
