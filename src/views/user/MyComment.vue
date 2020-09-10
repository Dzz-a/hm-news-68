<template>
  <div class="my-comment">
    <hm-header>我的评论</hm-header>
    <div class="list">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          :refreshing = false
          @load="onLoad"
          >
          <div class="item" v-for="item in commentList" :key="item.id">
            <div class="time">{{item.create_date | time('YYYY-MM-DD HH:mm')}}</div>
            <div class="comment" v-if="item.parent">
              <div class="name">{{item.parent.user.nickname}}</div>
              <div class="comment_content">{{item.parent.content}}</div>
            </div>
            <div class="content">{{item.content}}</div>
            <div class="origin">
              <span class="one-txt-cut" @click="$router.push(`/post-detail/${item.post.id}`)">原文：{{item.post.title}}</span>
              <span class="iconfont iconjiantou1"></span>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      commentList: [],
      // 当前页
      pageIndex: 1,
      // 每页条数
      pageSize: 5,
      list: [],
      // 代表加载状态，true代表list正在加载数据，onload不再触发，滚动到底部，触发onload时，自动会把loading改成true
      loading: false,
      // 代表是否结束，false代表还有数据，true代表没有更多数据
      finished: false,
      // 代表是否正在下来刷新，等数据加载完成，需要把下拉刷新改成false
      refreshing: false
    }
  },
  created () {
    this.getCommentList()
  },
  methods: {
    async getCommentList () {
      const res = await this.$axios.get('/user_comments', {
        // get请求的参数，如果有多个参数，将写个对象里写params里传过去
        params: {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }
      })
      // console.log(res.data)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        // 把已展示的数据和请求的数据用展开运算符合并起来
        this.commentList = [...this.commentList, ...data]
        // 加载完成，手动把loading改成false，避免一直加载
        this.loading = false
        // 下拉请求结束时 把下拉的状态改成false
        this.refreshing = false
        // 判断如果后面没有更多数据了，需要把finished改成true
        if (data.length < this.pageSize) {
          this.finished = true
        }
      }
    },
    onLoad () {
      // 触发load事件的时候，加载下一页数据
      this.pageIndex++
      this.getCommentList()
    },
    onRefresh () {
      setTimeout(() => {
        // 刷新的时候列表清空原来的数据
        this.commentList = []
        // 防止之前已经没有数据了
        // loading此时要给true，不然会出现同时加载多条数据，因为下拉的时候，会清空数据，页面到底了，触发onLoad会加载一次数据，下拉又会触发一次请求，执行getCommentList()，又加载一次，防止加载两次，就手动改成true，让他们只加载一次数据
        // 清空触发一次，下拉触发一次，所以在此时都是正在加载，
        this.loading = true
        this.finished = false
        // 重新加载第一页的数据
        this.pageIndex = 1
        this.getCommentList()
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
.item{
  border-bottom: 1px solid #ccc;
  padding: 10px 20px;
  .time{
    color: #999;
    font-size: 12px;
    padding: 10px 0;
  }
  .comment{
    background-color: #ddd;
    padding: 10px;
    .name{
      font-size: 12px;
      color: #999;
    }
    .comment_content{
      color: #888;
      font-size: 14px;
      line-height: 30px;
      margin-top:10px;
    }
  }
  .content{
    margin: 10px 0;
    font-size: 14px;
  }
  .origin{
    font-size: 14px;
    color: #999;
    display: flex;
    justify-content: space-between;
  }
}
</style>
