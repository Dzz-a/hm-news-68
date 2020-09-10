<template>
  <div class="post-detail">
    <div class="header">
      <div class="left" @click="$router.back()">
        <span class="iconfont iconjiantou2"></span>
      </div>
      <div class="center">
        <span class="iconfont iconnew"></span>
      </div>
      <div class="right">
        <div class="followed" v-if="post.has_follow" @click="unfollow">已关注</div>
        <div class="follow" v-else @click="follow">关注</div>
      </div>
    </div>
    <div class="content">
      <div class="title">{{post.title}}</div>
      <div class="name">
        <span>{{post.user.nickname}}</span>&nbsp;&nbsp;
        <span>{{post.created_date | time}}</span>
      </div>
      <div v-if="post.type === 1" class="info" v-html="post.content"></div>
      <video v-else :src="getUrl(post.content)" controls autoplay muted></video>
      <div class="buttons">
        <div class="good" :class="{active:post.has_like}" @click="like">
          <span class="iconfont icondianzan"></span>
          <span>{{post.like_length}}</span>
        </div>
        <div class="share">
          <span class="iconfont iconweixin"></span>
          <span>微信</span>
        </div>
      </div>
    </div>
    <!-- 评论  -->
    <div class="comment-list">
      <h3>精彩跟帖</h3>
      <hm-comment :comment="comment" v-for="comment in commentList" :key="comment.id" @reply="onReply" ></hm-comment>
    </div>
    <!-- 底部 -->
    <div class="footer-textarea" v-if="isShowTextarea">
      <textarea @blur="onBlur" :placeholder="'回复:' + nickname" ref="textarea" v-model="content"></textarea>
      <van-button @click="publish">发送</van-button>
    </div>
    <div class="footer-input" v-else >
      <div class="search">
       <input type="text" placeholder="回复" @focus="onFocus">
      </div>
       <span class="iconfont iconpinglun-"><i>20</i></span>
       <span class="iconfont iconshoucang" :class="{now:post.has_star}" @click="star"></span>
       <span class="iconfont iconfenxiang"></span>
    </div>

  </div>
</template>

<script>
export default {
  data () {
    return {
      // 拿一个空对象接收data的数据
      post: {
        // 因为当数据请求的时候还没有渲染出来，会出现user没有，报错，先用一个空对象替代 或者在标签里v-if="post.user",判断有没有
        user: {}
      },
      commentList: [],
      isShowTextarea: false,
      content: '',
      nickname: '',
      replyId: ''
    }
  },
  created () {
    // 获取文章内容
    this.getInfo()
    // 获取评论列表
    this.getCommentList()
    // 父组件给bus注册自定义事件
    // this.$bus.$on('reply', async (id, nickname) => {
    //   // 事件处理函数
    //   this.isShowTextarea = true
    //   await this.$nextTick()
    //   this.$refs.textarea.focus()
    //   // 回显nickname
    //   this.nickname = nickname
    //   this.replyId = id
    // })
    this.$bus.$on('reply', this.onReply)
  },
  destroyed () {
    this.$bus.$off('reply', this.onReply)
  },
  methods: {
    // 验证是否登录
    onLogin () {
      const token = localStorage.getItem('token')
      if (!token) {
        this.$touter.push({
          path: '/login',
          params: {
            back: true
          }
        })
        // 代表没有登录  ?
        return true
      } else {
        // 代表登录，跳出当前循环执行后面代码
        return false
      }
    },
    // 获取页面详情
    async getInfo () {
      // 发送请求，需要当前页文章的id，从这条路由里解构出ID，发送请求带上去
      const { id } = this.$route.params
      const res = await this.$axios.get(`/post/${id}`)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.post = data
        // console.log(this.post)
      }
    },
    getUrl (url) {
      const div = document.createElement('div')
      div.innerHTML = url
      return div.innerText
    },
    // 关注
    async follow () {
      // 获取当前的token
      // const token = localStorage.getItem('token')
      // // 判断有没有token，没有的话就去登录
      // if (!token) {
      //   this.$router.push({
      //     path: '/login',
      //     query: {
      //       back: true
      //     }
      //   })
      //   return
      // }
      if (this.onLogin()) return
      // 发送 ajax请求，进行关注
      const res = await this.$axios.get(`/user_follows/${this.post.user.id}`)
      const { statusCode } = res.data
      if (statusCode === 200) {
        this.$toast.success('关注成功')
        this.getInfo()
      }
    },
    // 取消关注
    async unfollow () {
      const res = await this.$axios.get(`/user_unfollow/${this.post.user.id}`)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        this.getInfo()
      }
    },
    // 点赞
    async like () {
      if (this.onLogin()) return
      const res = await this.$axios.get(`/post_like/${this.post.id}`)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        this.getInfo()
      }
    },
    // 收藏
    async star () {
      if (this.onLogin()) return
      const res = await this.$axios.get(`/post_star/${this.post.id}`)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        this.getInfo()
      }
    },
    // 评论
    async getCommentList () {
      const { id } = this.$route.params
      const res = await this.$axios.get(`/post_comment/${id}`)
      console.log(res.data)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.commentList = data
      }
    },
    // 评论框显示
    async onFocus () {
      this.isShowTextarea = true
      // 等dom元素更新后给textarea焦点
      await this.$nextTick()
      this.$refs.textarea.focus()
    },
    // 发布评论
    async publish () {
      const res = await this.$axios.post(`/post_comment/${this.post.id}`, {
        content: this.content,
        parent_id: this.replyId
      })
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        this.getCommentList()
        this.content = ''
        this.replyId = ''
        this.nickname = ''
        this.isShowTextarea = false
      }
    },
    // 回复评论
    async onReply (id, nickname) {
      // console.log(id, nickname)
      this.isShowTextarea = true
      await this.$nextTick()
      this.$refs.textarea.focus()
      // 回显nickname
      this.nickname = nickname
      this.replyId = id
    },
    // textarea失去焦点
    onBlur () {
      // 如果没有内容的话
      if (!this.content) {
        this.isShowTextarea = false
        this.nickname = ''
        this.replyId = ''
      }
    }
  }
}
</script>

<style lang="less" scoped>
.post-detail {
  padding-bottom: 50px;
}
.header {
  display: flex;
  padding: 0 10px;
  border-bottom: 1px solid #ccc;
  height: 50px;
  align-items: center;
  .left {
    span {
      line-height: 50px;
    }
  }
  .center {
    flex: 1;
    span {
      font-size: 50px;
    }
  }
  .right {
    font-size: 14px;
    div {
      width: 60px;
      height: 30px;
      text-align: center;
      line-height: 30px;
      border-radius: 15px;
    }
    .followed {
      border: 1px solid #ccc;

    }
    .follow {
      color: #fff;
      background-color: #f00;
    }
  }
}
.content {
  padding: 10px;
  border-bottom: 3px solid #ccc;
  .title {
    font-weight: 700;
    font-size: 18px;
  }
  .name {
    font-size: 14px;
    color: #666;
    margin: 10px 0;
    span:first-child {
      margin-right: 20px;
    }
  }

  .info {
    font-size: 14px;
    /deep/ img {
      width: 100%;
    }
  }
  video {
    width: 100%;
  }
  .buttons {
    padding: 20px 0;
    display: flex;
    justify-content: space-around;
    > div {
      width: 120px;
      height: 40px;
      line-height: 40px;
      border-radius: 20px;
      border: 1px solid #ccc;
      text-align: center;
      font-size: 16px;
      .iconfont {
        font-size: 18px;
        margin-right: 5px;
      }
      .iconweixin {
        color: lime;
      }
    }
    .active {
      border-color: red;
      color: red;
    }
  }

}
.comment-list {
  h3 {
    text-align: center;
    padding: 10px 0;
  }
}
.footer-input{
  background-color: #fff;
  width: 100%;
  height: 50px;
  display: flex;
  border-top: 1px solid #ccc;
  position: fixed;
  bottom: 0;
  align-items: center;
  justify-content: space-around;
  padding: 0 10px;
  .iconfont {
    font-size: 24px;
  }
  .now {
    color: red;
  }
  .iconpinglun- {
    position: relative;
    i {
      position: absolute;
      right: 0;
      top: 0;
      background-color: red;
      font-size: 10px;
      color: #fff;
      padding: 0 3px;
      right: -5px;
      border-radius: 5px;
      font-style: normal;
    }
  }
  .search {
    width: 180px;
    padding-right: 10px;
    input {
      height: 30px;
      background-color: #ddd;
      border-radius: 15px;
      width: 100%;
      border: none;
      font-size: 14px;
      padding-left: 20px;
    }
  }
}
.footer-textarea{
  width: 100%;
  height: 100px;
  display: flex;
  position: fixed;
  z-index: 999;
  bottom: 0;
  padding: 10px;
  align-items: flex-end;
  background-color: #fff;
  border-top: 1px solid #ccc;
  justify-content: space-around;
  textarea{
    width: 260px;
    height: 80px;
    background-color: #ccc;
    border-radius: 10px;
    border: 0;
    padding: 10px;
    font-size: 14px;
  }
}
</style>
