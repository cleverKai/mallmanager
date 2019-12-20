<template>
    <div class="login-wrap">
      <el-form label-position="top" label-width="80px" :model="formData" class="login-form">
        <h2>用户登录</h2>
        <el-form-item label="用户名">
          <el-input @keyup.enter.native="handleToLogin" type="text"  v-model="formData.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input @keyup.enter.native="handleToLogin" type="password" v-model="formData.password"></el-input>
        </el-form-item>
        <el-button  v-loading.fullscreen.lock="fullscreenLoading"  @click="handleToLogin" class="login-btn" type="primary">登录</el-button>
      </el-form>
    </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      formData: {
        username: '',
        password: ''
      },
      fullscreenLoading: false
    }
  },
  methods: {
    handleToLogin () {
      if (this.username === '' || this.password === '') {
        this.$message.warning('用户名或者密码不能为空')
      } else {
        this.fullscreenLoading = true
        this.$http.post('/login', this.formData).then((res) => {
          let status = res.data.meta.status
          // 登录成功
          if (status === 200) {
            // 2. 提示登录成功
            this.fullscreenLoading = false
            // 登录成功 保存token
            localStorage.setItem('token', res.data.data.token)
            this.$message.success(res.data.meta.msg)
            // 1. 跳转首页
            this.$router.push('/home')
          } else {
            // 登录失败
            this.fullscreenLoading = false
            // 1. 提醒失败原因
            this.$message.error(res.data.meta.msg)
          }
        })
      }
    }
  }
}
</script>

<style scoped lang="css">
  .login-wrap{
    height: 100%;
    background-color: #324152;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .login-form{
    width: 350px;
    background-color: #fff;
    border-radius: 5px;
    padding: 25px;
  }
  .login-btn{
    width: 100%;
  }
</style>
