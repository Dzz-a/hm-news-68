<template>
  <div class="index">
   <div class="header">
     <div class="logo">
       <span class="iconfont iconnew"></span>
     </div>
     <div class="search">
       <div class="search-box" @click="$router.push('/search')">
         <span class="iconfont iconsearch"></span>
         <span>搜索新闻</span>
       </div>
     </div>
     <div class="user" @click="$router.push('/user')">
       <span class="iconfont iconwode"></span>
     </div>
   </div>
   <!-- tab栏更多效果图标 -->
   <van-sticky class="more-sticky">
     <div class="more" @click="$router.push('/manage')">
       <span class="iconfont iconlianjie" ></span>
     </div>
   </van-sticky>
   <!-- tab栏 -->
    <van-tabs v-model="active" sticky animated swipeable>
     <van-tab :title="tab.name" v-for="tab in tabList" :key="tab.id">
       <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            :immediate-check="false"
            @load="onLoad"
          >
          <hm-post :post="item" v-for="item in newList" :key="item.id"></hm-post>
        </van-list>
       </van-pull-refresh>
     </van-tab>
    </van-tabs>
  </div>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
      active: 0,
      // 用于存放栏目列表数据
      tabList: [],
      newList: [],
      pageIndex: 1,
      pageSize: 20,
      // 是否在加载中
      loading: false,
      // 是否全部加载完成
      finished: false,
      // 是否正在刷新
      refreshing: false
    }
  },
  created () {
    this.getTabList()
  },
  methods: {
    // 获取列表
    async getTabList () {
      // 先判断本地存储是否有tab栏数据
      const activeList = JSON.parse(localStorage.getItem('activeList'))
      if (activeList) {
        this.tabList = activeList
        // 发送请求获取第一个tab栏的数据
        this.getNewsList(this.tabList[0].id)
        return
      }
      const res = await this.$axios.get('/category')
      const { statusCode, data } = res.data
      // console.log(res.data)
      if (statusCode === 200) {
        this.tabList = data
        // 发送请求获取第一个tab栏数据
        this.getNewsList(this.tabList[0].id)
      }
    },
    // 获取新闻内容
    async getNewsList (id) {
      const res = await this.$axios.get('/post', {
        params: {
          category: id,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }
      })
      const { statusCode, data } = res.data
      // console.log(res.data)
      if (statusCode === 200) {
        // this.newList = data
        // console.log(this.newList)
        // 防止快速切换tab栏，因定时器设置的是1秒，在此时点击多次，会请求多次，页面却没来得及加载，就会报错
        // 此时给个判断，如果当前页面是第一页，那么就先清空当前页面，再加载
        if (this.pageIndex === 1) {
          this.newList = []
        }
        this.newList = [...this.newList, ...data]
        // 加载完成后手动把loading改成false，防止一直在加载
        this.loading = false
        this.refreshing = false
        // 判断是否所有数据都加载完成
        if (data.length < this.pageSize) {
          this.finished = true
        }
      }
    },
    // 正在加载获取
    onLoad () {
      setTimeout(() => {
        // 加载下一页数据
        this.pageIndex++
        // 获取新的数据 传送当前分类的id
        this.getNewsList(this.tabList[this.active].id)
      }, 1000)
    },
    onRefresh () {
      this.newList = []
      this.pageIndex = 1
      this.loading = true
      this.finished = false
      setTimeout(() => {
        this.getNewsList(this.tabList[this.active].id)
      }, 1000)
    }

  },
  // 监听列表栏是否变化
  watch: {
    active (value) {
      console.log(value)
      // 监听active的值是否有变化，有的话执行以下代码
      // 清空当前新闻列表，数据页面变成第一页，。。。
      this.newList = []
      this.pageIndex = 1
      this.finished = false
      // 正在加载中，防止页面清空加载，后发送请求又加载一次
      this.loading = true
      // 给个定时器，缓冲下重新获取新闻数据
      setTimeout(() => {
        // 需要传入当前列表页的id获取当前的数据
        this.getNewsList(this.tabList[value].id)
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
.header{
  display: flex;
  height: 50px;
  background-color: #ff0000;
  line-height: 50px;
  text-align: center;
  .logo,
  .user{
    width: 70px;
  }
  .logo{
    span{
      font-size: 50px;
    }
  }
  .user{
    span{
      font-size: 24px;
    }
  }
  .search{
    flex: 1;
    .search-box{
      height: 34px;
      line-height: 34px;
      background-color: rgba(255, 255, 255, .5);
      margin-top: 8px;
      border-radius: 17px;
      font-size: 14px;
      span:first-child{
        margin-right: 5px;
      }
    }
  }
}
/deep/ .van-tabs__wrap{
  width: 85%;
}
.more{
  width: 15%;
  height: 44px;
  position: absolute;
  right: 0;
  z-index: 999;
  background-color:#fff;
  text-align: center;
  line-height: 44px;
}
.more-sticky{
  /deep/.van-sticky--fixed{
    z-index: 100;
  }
}
</style>
