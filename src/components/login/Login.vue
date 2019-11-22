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
        <el-button  @click="handleToLogin" class="login-btn" type="primary">登录</el-button>
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
      }
    }
  },
  methods: {
    handleToLogin () {
      this.$http.post('/login', this.formData).then((res) => {
        let status = res.data.meta.status
        // 登录成功
        if (status === 200) {
          this.$router.push('/home')
          this.$message.success(res.data.meta.msg)
        } else {
          this.$message.error(res.data.meta.msg)
        }
        // 1. 跳转首页
        // 2. 提示登录成功
        // 登录失败
        // 1. 提醒失败原因
      })
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
