<template>
  <div class="user">
    <div class="header">
      <div class="avatar">
        <!-- 图片的路径要绝对路径 -->
        <img :src="base + user.head_img" @click="$router.push('/user-edit')">
      </div>
      <div class="info">
        <div class="name">
          <!-- <span v-if="user.gender === 1" class="iconfont iconxingbienan"></span>
          <span v-else class="iconfont iconxingbienv"></span> -->
          <span class="iconfont" :class="user.gender === 1 ? 'iconxingbienan' : 'iconxingbienv'"></span>
          <span>{{user.nickname}}</span>
        </div>
        <div class="time">{{user.create_date | time}}</div>
      </div>
      <div class="arrow">
        <span class="iconfont iconjiantou1"></span>
      </div>
    </div>
    <!-- 导航条 -->
    <hm-navitem to="/follow">我的关注
      <template #content>关注的用户</template>
    </hm-navitem>
    <hm-navitem>我的跟帖
      <template #content>跟帖/回复</template>
    </hm-navitem>
    <hm-navitem>我的收藏
      <template #content>文章/视屏</template>
    </hm-navitem>
    <hm-navitem to="/user-edit">设置</hm-navitem>
    <div style="margin:15px">
      <van-button type="primary" block @click="logout">退出登录</van-button>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    // 封装一个函数，把基地址存进去方便使用
    base () {
      return this.$axios.defaults.baseURL
    }
  },
  data () {
    return {
      user: ''
    }
  },
  // 登录成功后，发送请求获取用户的数据
  async created () {
    // token必须放到请求头中 Authorization
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')
    // 发送请求等待返回的数据 发送get请求，并且设置请求头 get(url,config)
    const res = await this.$axios.get(`/user/${userId}`, {
      headers: {
        Authorization: token
      }
    })
    // 解构res.data，获取到里面的状态码和data数据，
    const { statusCode, data } = res.data
    if (statusCode === 200) {
      this.user = data
    } else if (statusCode === 401) {
    // 由于前端是无法验证用户的token是否正确，可以通过服务器返回的状态码来判断，以防用假的token进入
      this.$toast('用户验证失败')
      this.$router.push('/login')
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
    }
  },
  methods: {
    async logout () {
      try {
        // 如果await promise报错，需要try...catch捕获异常 把try里放需要判断的东西，catch放错误的话需要执行的代码，正确的话继续往下执行
        await this.$dialog.confirm({
          message: '您确定要退出吗',
          title: '温馨提示'
        })
      } catch {
        return this.$toast('取消退出')
      }
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      this.$router.push('/login')
      this.$toats.success('退出成功')
    }
  }
}

</script>

<style lang="less" scoped>
.user{
  .header{
    display: flex;
    align-items:center;
    padding:20px 10px;
    border-bottom:3px solid #ddd;
    .avatar{
      width: 70px;
      height:70px;
      img {
        border-radius: 50%;
        height: 100%;
        width:100%
      }
    }
    .info{
      flex:1;
      padding-left:10px;
      font-size: 14px;
      .time{
        margin-top:10px;
        color:#666;
      }
      .iconxingbienan{
         color: #7bbcec;
      }
      .iconxingbienv{
         color: pink;
      }
    }
  }
}
</style>
