<template>
  <div class="nav-item" @click="clickFn">
    <div class="title"><slot></slot></div>
    <div class="content"><slot name="content"></slot></div>
    <div class="arrow">
      <span class="iconfont iconjiantou1"></span>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    clickFn () {
      // 点击，如果有父组件传过来的to属性，那么就跳转到那个链接
      if (this.to) {
        this.$router.push(this.to)
      }
    }
  },
  // 接收父组件传过来的
  props: {
    // 判断是否是字符串类型的
    to: String
  }
}
</script>

<style lang="less" scopeed>
.nav-item{
  display:flex;
  border-bottom:1px solid #ddd;
  height:50px;
  align-items:center;
  margin-left:10px;
  padding-right:10px;
  font-size:16px;
  .content{
    flex:1;
    text-align:right;
    color:#666;
  }
  .arrow{
    padding-left:10px;
  }
}
</style>
