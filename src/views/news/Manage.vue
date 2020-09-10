<template>
  <div class="manage">
    <hm-header>栏目管理</hm-header>
    <div class="content">
      <div class="active" >
        <h3>点击删除以下频道</h3>
        <div class="list">
          <div class="item" v-for="item in activeList" :key="item.id" @click="delTab(item.id)">{{item.name}}</div>
        </div>
      </div>
      <div class="deactive" >
        <h3>点击添加以下频道</h3>
        <div class="list">
          <div class="item" v-for="item in deactiveList" :key="item.id" @click="addTab(item.id)">{{item.name}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeList: [],
      deactiveList: []
    }
  },
  // 获取list数据
  async created () {
    // 在渲染的时候，先从localstorage里获取数据，如果没有就发送请求获取
    const activeList = JSON.parse(localStorage.getItem('activeList'))
    const deactiveList = JSON.parse(localStorage.getItem('deactiveList'))
    // 如果activeList有值就执行以下判断，没有就发送请求获取
    if (activeList) {
      this.activeList = activeList
      this.deactiveList = deactiveList
      return
    }
    const res = await this.$axios.get('category')
    const { statusCode, data } = res.data
    if (statusCode === 200) {
      this.activeList = data
    }
  },
  methods: {
    delTab (id) {
      if (this.activeList.length <= 4) return
      const index = this.activeList.findIndex(item => item.id === id)
      this.deactiveList.push(this.activeList[index])
      this.activeList.splice(index, 1)
    },
    addTab (id) {
      const index = this.deactiveList.findIndex(item => item.id === id)
      this.activeList.push(this.deactiveList[index])
      this.deactiveList.splice(index, 1)
    }
  },
  watch: {
    activeList: {
      // deep 因为监听的是数组，就深度监听
      deep: true,
      // 发生变化执行的
      handler (value) {
        // 存到本地存储，因为是数组，要转换以下数据类型字符串
        localStorage.setItem('activeList', JSON.stringify(this.activeList))
        localStorage.setItem('deactiveList', JSON.stringify(this.deactiveList))
      }
    }
  }

}
</script>

<style lang="less" scoped>
.content{
  padding: 10px;
  .active,
  .deactive{
    h3{
      font-size: 14px;
      font-weight: 400;
      margin: 10px 0;
    }
    .list{
      overflow: hidden;
    }
    .item{
      width: 60px;
      height: 30px;
      border: 1px solid #ccc;
      background-color: #eee;
      text-align: center;
      line-height: 30px;
      font-size: 16px;
      float: left;
      margin: 5px;
    }
  }
}
</style>
