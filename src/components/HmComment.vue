<template>
  <div class="hm-comment">
    <div class="title">
      <div class="left">
        <img :src="$base + comment.user.head_img" alt="">
      </div>
      <div class="center">
        <p>{{comment.user.nickname}}</p>
        <p>{{comment.create_date | now}}</p>
      </div>
      <div class="right" @click="reply">回复</div>
    </div>
    <!-- <hm-floor :count="count" class="first" :comment="comment.parent" v-if="comment.parent"  ></hm-floor> -->
    <!-- 让递归不在评论组件执行，去楼层组件 -->
    <hm-floor class="first" :comment="comment.parent" v-if="comment.parent"  ></hm-floor>
    <div class="content">{{comment.content}}</div>
  </div>
</template>

<script>
export default {
  // data () {
  //   return {
  //     count: this.getCount(0, this.comment)
  //   }
  // },
  props: {
    comment: Object
  },
  methods: {
    // // 使用递归统计次数
    // getCount (num, data) {
    //   // 判断当前的数据是否有parent
    //   if (data.parent) {
    //     // 有的话就再次执行，num+1，看他还有没有parent，循环直到没有parent就结束循环，返回最后的num
    //     return this.getCount(num + 1, data.parent)
    //   } else {
    //     return num
    //   }
    // },
    reply () {
      // 把评论组件的数据传递给父组件
      // this.$emit('reply', this.comment.id, this.comment.user.nickname)
      this.$bus.$emit('reply', this.comment.id, this.comment.user.nickname)
    }
    // onReply (id, nickname) {
    //   // 把楼层组件的数据传给父组件
    //   this.$emit('reply', id, nickname)
    // }
  }
}
</script>

<style lang="less" scoped>
.hm-comment{
  padding: 10px;
  // margin-top: -1px;
  border-bottom: 1px solid #ccc;
  .title{
    display: flex;
    .left{
      img{
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
    }
    .center{
      padding-left: 10px;
      flex: 1;
      font-size: 14px;
      p{
        line-height: 24px;
      }
    }
    .right{
      font-size: 14px;
      color: #666;
    }
    .content{
      font-size: 18px;
    }
  }
}
</style>
