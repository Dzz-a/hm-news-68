<template>
  <div class="my-follow">
    <hm-header>我的关注</hm-header>
    <div class="list" >
     <div class="item" v-for="item in list" :key="item.id">
        <div class="left">
        <img :src="$base + item.head_img" alt="">
      </div>
      <div class="center">
        <p>{{item.nickname}}</p>
        <p>{{item.create_date | time}}</p>
      </div>
      <div class="right">
         <van-button round type="primary" size="small" @click="unFollow(item.id)">取消关注</van-button>
      </div>
     </div>
    </div>

  </div>
</template>

<script>
export default {
  data () {
    return {
      list: []
    }
  },
  created () {
    this.getFollowList()
  },
  methods: {
    async getFollowList () {
      const res = await this.$axios.get('/user_follows')
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.list = data
        console.log(this.list)
      }
    },
    async unFollow (id) {
      try {
        await this.$dialog.confirm({
          title: '温馨提示',
          message: '您确定取消关注该用户吗'
        // await this.$dialog.confirm({
        //   title: '温馨提示',
        //   message: '你确定要取关该用户吗?'
        })
      } catch {
        return this.$toast('取消操作')
      }
      const res = await this.$axios.get(`/user_unfollow/${id}`)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        this.getFollowList()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.item{
  display: flex;
  height: 100px;
  border-bottom: 1px solid #ccc;
  align-items: center;
  padding: 0 20px;
  .left{
    img{
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
  }
  .center{
    flex:1;
    padding-left: 10px;
    font-size: 16px;
  }
}
</style>
