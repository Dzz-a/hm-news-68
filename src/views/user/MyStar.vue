<template>
  <div class="my-star">
  <hm-header>我的收藏</hm-header>
  <div class="list" >
    <hm-post v-for="item in list" :key="item.id" :post="item"></hm-post>
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
  methods: {
    // 获取列表数据
    async getStarList () {
      const res = await this.$axios.get('/user_star')
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.list = data
        // 因为hmpost传来的是comment_length,收藏页面的是comments，遍历的时候把值赋予以下
        this.list.forEach(item => { item.comment_length = item.comments.length })
        console.log(this.list)
      }
    }
  },
  created () {
    this.getStarList()
  }

}
</script>

<style lang="less" scoped>
// .item{
//   border-bottom: 1px solid #ccc;
//   padding: 10px;
//   display: flex;
//   .info{
//     flex: 1;
//     font-size: 16px;
//     display: flex;
//     flex-direction: column;
//     justify-content: space-between;
//     .user{
//       color: #666;
//       font-size: 14px;
//       span:first-child{margin-right:10px}
//     }
//   }
//   .img{
//     img{
//       width: 120px;
//       height: 74px;
//       // 设定图片大小
//       object-fit: cover;
//     }
//   }
// }
</style>
