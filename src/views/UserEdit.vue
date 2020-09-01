<template>
  <div class="user-edit">
    <hm-header>编辑资料</hm-header>
    <!-- 头像 -->
    <div class="avatar">
      <img :src="$axios.defaults.baseURL + user.head_img" alt="">
      <van-uploader :after-read="afterRead" />
    </div>
    <!-- 导航 -->
    <hm-navitem @click="showNickname">
      <template>昵称</template>
      <template #content>{{user.nickname}}</template>
    </hm-navitem>
     <hm-navitem @click="showPassword">
      <template >密码</template>
      <template #content>******</template>
    </hm-navitem>
     <hm-navitem @click="showGender">
      <template>性别</template>
      <template #content>{{user.gender === 1 ? '男' : '女'}}</template>
    </hm-navitem>

    <!-- 渲染dialog组件 -->
    <!-- 修改用户名 -->
     <van-dialog v-model="isShowNickname" title="编辑昵称" show-cancel-button @confirm="updateNickname">
        <van-field v-model="nickname" ref="nickname" placeholder="请输入用户名"   />
      </van-dialog>
    <!-- 修改密码 -->
     <van-dialog v-model="isShowPassword" title="修改密码" show-cancel-button @confirm="updatePassword">
      <van-field v-model="password" ref="password" placeholder="请输入密码"  />
     </van-dialog>
    <!-- 修改性别 -->
    <van-dialog v-model="isShowGender" title="修改性别" show-cancel-button @confirm="updateGender">
          <van-radio-group v-model="gender">
           <van-cell-group>
            <van-cell title="男" clickable @click="gender = 1">
              <template #right-icon>
                <van-radio :name="1" />
               </template>
            </van-cell>
          <van-cell title="女" clickable @click="gender = 0">
           <template #right-icon>
             <van-radio :name="0" />
           </template>
          </van-cell>
         </van-cell-group>
      </van-radio-group>
    </van-dialog>

    <!-- 裁剪的模态框 -->
    <div class="mask" v-show="isShowMask">
      <van-button type="danger" class="cancel" @click="isShowMask = false">取消</van-button>
      <van-button type="primary" class="crop" @click="crop">确定</van-button>
      <VueCropper ref="aa"
      :img="img"
      autoCrop
      autoCropWidth="100"
      autoCropHeight="100"
      fixed
      >
      </VueCropper>
    </div>
  </div>
</template>

<script>
import { VueCropper } from 'vue-cropper'
export default {
  components: {
    VueCropper
  },
  // 发送请求前data里的user是空的
  data () {
    return {
      user: '',
      isShowNickname: false,
      nickname: '',
      isShowPassword: false,
      password: '',
      isShowGender: false,
      gender: 1,
      isShowMask: false,
      img: ''

    }
  },
  // 数据渲染前发送请求获取用户信息
  created () {
    this.getUserInfo()
  },
  methods: {
    // 发送获取用户信息请求
    async getUserInfo () {
      // 先获取到用户的id
      const userId = localStorage.getItem('userId')
      // 发送请求，把用户的id带上,获取当前用户的信息
      const res = await this.$axios.get(`/user/${userId}`)
      // 解构出当前的状态码和data里的信息
      const { statusCode, data } = res.data
      // 判断状态码为200的时候，把当前data里的信息，给到user
      if (statusCode === 200) {
        this.user = data
      }
    },
    async updateUser (data) {
      const userId = localStorage.getItem('userId')
      // 发送数据到指定位置，带上当前修改用户的id，和修改的内容
      const res = await this.$axios.post(`/user_update/${userId}`, data)
      if (res.data.statusCode === 200) {
        // 重新获取信息渲染页面
        this.getUserInfo()
        this.$toast.success('修改成功')
      }
    },
    // 点击修改昵称的时候，显示修改框，将user之前的昵称放到当前的文本框，并且复制给当前的nickname
    async showNickname () {
      this.isShowNickname = true
      this.nickname = this.user.nickname
      // 等待Dom的更新
      await this.$nextTick()
      // 需要自动获取焦点
      this.$refs.nickname.focus()
    },
    // 确认修改，发送请求数据
    async updateNickname () {
      // const userId = localStorage.getItem('userId')
      // // 发送数据到指定位置，带上当前修改用户的id，和修改的内容
      // const res = await this.$axios.post(`/user_update/${userId}`, {
      //   // 数据库的nickname:当前修改的nickname
      //   nickname: this.nickname
      // })
      // if (res.data.statusCode === 200) {
      //   // 重新获取信息渲染页面
      //   this.getUserInfo()
      //   this.$toast.success('修改成功')
      // }
      this.updateUser({ nickname: this.nickname })
    },
    async showPassword () {
      this.isShowPassword = true
      this.password = this.user.password
      await this.$nextTick()
      this.$refs.password.focus()
    },
    async updatePassword () {
      this.updateUser({
        password: this.password
      })
    },
    showGender () {
      this.isShowGender = true
      this.gender = this.user.gender
    },
    updateGender () {
      this.updateUser({
        gender: this.gender
      })
    },
    // 限制上传图片的格式和大小
    isImg (name) {
      // 如果name是以***.jpg---结尾的
      if (name.endsWith('.jpg') || name.endsWith('.gif') || name.endsWith('.png') || name.endsWith('.jpeg')) {
        return true
      } else {
        return false
      }
    },
    afterRead (file) {
      // 将当前的图片name传进去，执行isImg函数，判断是否是符合要求的图片，不是的话就提示上传正确图片
      if (!this.isImg(file.file.name)) {
        return this.$toast.fial('请上传正确格式图片')
      }
      if (file.file.size >= 20 * 1024) {
        return this.$toast.fail('上传图片太大')
      }
      // 显示裁剪框
      this.isShowMask = true
      // 设置裁剪图片，此处不能用file.file，要裁剪的是图片本身file.content
      this.img = file.content
    },
    // 点击确认裁剪
    crop () {
      // 带有aa标记的那个组件的 获取截图的blob数据
      this.$refs.aa.getCropBlob(async (blob) => {
      // 此时可以自行将文件上传至服务器
      // 发送请求上传文件，如果是通过ajax发送请求，请求头不能是一个普通的对象，必须是 FormData对象
        const fd = new FormData()
        // 给formdata对象添加上上传的文件
        fd.append('file', blob)
        const res = await this.$axios.post('/upload', fd)
        const { statusCode, data } = res.data
        console.log(data)
        if (statusCode === 200) {
          this.updateUser({
            head_img: data.url
          })
        }
        // 隐藏裁剪框
        this.isShowMask = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.avatar{
  padding:40px 0;
  text-align: center;
  position: relative;
  img{
    width: 100px;
    height: 100px;
    border-radius:50%
  }
  .van-uploader{
  position: absolute;
  left: 50%;
  top: 40px;
  transform: translate(-50%);
  width: 100px;
  height: 100px;
  opacity: 0;
  }
}
// 深度选择权
/deep/ .van-dialog__content {
  padding: 15px !important;
  .van-field {
    // ？
    border: 1px solid #ccc;
  }
}
// 裁剪框
.mask{
  width: 100%;
  height: 100%;
  z-index: 999;
  position: fixed;
  top: 0;
  left: 0;
  .crop,
  .cancel{
    position: fixed;
    top: 0;
    z-index: 1;
  }
  .crop{
  right: 0;
  }
  // /deep/.vue-cropper{
  //   background-color: black;
  // }
}
</style>
