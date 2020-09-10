<template>
  <div class="search">
    <!-- 头部 -->
    <div class="header">
      <div class="left" @click="goBack">
        <span class="iconfont iconjiantou"></span>
      </div>
      <div class="center">
        <input type="text" placeholder="请输入搜索关键字" v-model="key" @keyup.enter="search" @input="recommend">
        <span class="iconfont iconsearch"></span>
      </div>
      <div class="right" @click="search" >搜索</div>
    </div>
    <!-- 搜索时显示的关联搜索 -->
    <div class="recommend-list" v-if="recommendList.length">
      <div class="item one-txt-cut" v-for="item in recommendList" :key="item.id" @click="goSearch(item.title)">{{item.title}}</div>
    </div>
    <!-- 如果list有长度就渲染这个 -->
    <div class="list" v-else-if="list.length">
      <hm-post v-for="item in list" :key="item.id" :post="item"></hm-post>
    </div>
    <div class="content" v-else>
      <!-- 历史记录 -->
    <div class="history">
      <h3>历史记录</h3>
      <div class="list">
        <!-- 渲染历史记录 -->
        <div
          class="item onr-txt-cut"
          v-for="item in history"
          :key="item.id"
          @click="goSearch(item)"
        >
         {{item}}
        </div>
      </div>
    </div>
    <!-- 热门搜索 -->
    <div class="hot">
      <h3>热门搜索</h3>
      <div class="list">
        <div class="item" v-for="item in hot" :key="item" @click="goSearch(item)">{{item}}</div>
      </div>
    </div>
</div>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data () {
    return {
      // 双向绑定，获取input的内容
      key: '',
      list: [],
      history: [],
      hot: [],
      recommendList: []
    }
  },
  created () {
    // 页面加载前获取本地存储的数据
    // 如果没有历史记录，保证是一个空数组？
    this.history = JSON.parse(localStorage.getItem('history')) || []
    this.hot = ['关晓彤', '华为', '情火', '姑娘']
  },
  methods: {
    async search () {
      // 点击搜索时，先判断是否有值，没有的话就退出，提示输入内容
      if (!this.key) return this.$toast('请输入搜索关键字')
      const res = await this.$axios.get('/post_search', {
        params: {
          // 发送请求的时候需要携带数据，搜索的内容
          keyword: this.key
        }
      })
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.list = data
      }
      // 把key添加到缓存中 如果原来有这个历史记录，删除，如果没有就添加到数组前面
      // 过滤以下当前的历史记录里是否有这个搜索的内容，没有的话就存进去放到前面，有就过滤掉
      this.history = this.history.filter(item => item !== this.key)
      this.history.unshift(this.key)
      localStorage.setItem('history', JSON.stringify(this.history))
      // 清空推荐
      this.recommendList = []
    },
    // 回退
    goBack () {
      if (this.key) {
        // 如果key有值，那么就清空
        this.key = ''
      } else {
        // 没有值就返回上一页
        this.$router.back()
      }
    },
    // 点击历史记录搜索
    goSearch (item) {
      // 把当前点击搜索的那个值，赋值给key。执行搜索
      this.key = item
      this.search()
    },
    // 输入框内容发生改变的时候
    recommend: _.debounce(async function () {
      if (this.key === '') return
      const res = await this.$axios.get('/post_search_recommend', {
        params: {
          keyword: this.key
        }
      })
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        // console.log(data)
        this.recommendList = data
      }
    }, 1000)
  },
  watch: {
    // 监听key的value
    key (value) {
      // 如果没有值
      if (value === '') {
        this.list = ''
      }
    }
  }
}
</script>

<style lang="less" scoped>
.header{
  height: 50px;
  display: flex;
  padding: 0 10px;
  border-bottom: 1px solid #ccc;
  align-items: center;
  .center{
    flex: 1;
    padding: 0 10px;
    position: relative;
    input{
      width: 100%;
      height: 34px;
      border: 1px solid #ccc;
      border-radius: 17px;
      font-size: 14px;
      padding-left: 40px;
    }
    .iconfont{
      position: absolute;
      left: 22px;
      top: 10px;
    }
  }
  .right{
    font-size: 14px;
  }
}
.content{
  padding: 10px;
  .history{
    margin-bottom: 10px;
  }
  h3{
    font-size: 14px;
    margin:10px 0;
  }
  .list{
    overflow: hidden;
  }
  .item{
    float: left;
    width: 60px;
    height: 30px;
    border: 1px solid #ccc;
    background-color: #ddd;
    font-size: 12px;
    line-height: 30px;
    text-align: center;
    margin: 5px;
  }
}
.recommend-list{
  padding: 0 10px;
  .item{
    border-bottom: 1px solid #ccc;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
  }
}

</style>
