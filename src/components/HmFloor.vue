<template>
<div>
  <!-- 在此判断是否还有父评论，有的话就渲染出来 -->
  <!-- <hm-floor :@reply="replyFn" count="count-1" :comment="comment.parent" v-if="comment.parent"></hm-floor> -->
  <hm-floor :count="count-1" :comment="comment.parent" v-if="comment.parent"></hm-floor>
  <!-- 楼层组件的渲染样式 -->
  <div class="hm-floor" >
    <div class="title">
       <div class="left">{{getCount(1, comment)}}.{{comment.user.nickname}}</div>
       <div class="center">{{comment.create_date | now}}</div>
       <div class="right" @click ="reply" >回复</div>
    </div>
    <div class="content">{{comment.content}}</div>
  </div>
</div>
</template>

<script>
export default {
  // 组件中想要用本身，要有name，调用
  name: 'hm-floor',
  props: {
    comment: Object,
    count: Number
  },
  methods: {
    reply () {
      // this.$emit('reply', this.comment.id, this.comment.user.nickname)
      // 子组件提供数据，子组件给个触发bus的自定义事件
      this.$bus.$emit('reply', this.comment.id, this.comment.user.nickname)
    },
    // replyFn (id, nickname) {
    //   this.$emit('reply', id, nickname)
    // }
    // 使用递归统计次数
    getCount (num, data) {
      // 判断当前的数据是否有parent
      if (data.parent) {
        // 有的话就再次执行，num+1，看他还有没有parent，循环直到没有parent就结束循环，返回最后的num
        return this.getCount(num + 1, data.parent)
      } else {
        return num
      }
    }
  }
}
</script>

<style lang="less" scoped>
.first>.hm-floor{
border-bottom: 1px solid #ccc;
}
.hm-floor{
  padding: 10px;
  border: 1px solid #ccc;
  border-bottom:none;
  .title{
    display: flex;
    font-size: 14px;
    .center{
      flex: 1;
      font-size: 12px;
      color: #666;
      padding-left: 10px;
    }
    .right{
      color: #666;
    }
  }
  .content{
      font-size: 14px;
      margin-top: 10px;
    }
}
</style>
