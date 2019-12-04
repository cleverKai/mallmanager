<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="4">
          <div class="grid-content bg-purple">
          <img src="../../assets/logo.png" alt="图片无法显示" style="width: 25%;">
        </div>
        </el-col>
        <el-col :span="18" class="middle">
          <div class="grid-content bg-purple-light">
          <h3>电商后台管理系统</h3>
        </div>
        </el-col>
        <el-col :span="2">
          <div class="grid-content bg-purple">
          <a href="#" @click="handleToLogout" class="logout">退出</a>
        </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside class="aside" width="200px">
        <el-menu :unique-opened="true" :router="true">
<!--          开启路由模式-->
<!--          1-->
          <el-submenu :index=" '' + item1.order" v-for="(item1,index) in menus" :key="index">
            <template slot="title">
              <i class="el-icon-user"></i>
              <span>{{ item1.authName }}</span>
            </template>
              <el-menu-item v-for="(item2,index) in item1.children" :key="index" :index="item2.path">
                <i class="el-icon-menu"></i>
                <span>{{ item2.authName}}</span>
              </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data(){
    return{
      menus:[]
    }
  },
  beforeCreate () {
    // 验证登录权限
    const token = localStorage.getItem('token')
    if (!token) {
      this.$router.push({name: 'login'})
    }
  },
  mounted () {
    this.getMenus()
  },
  methods: {
    handleToLogout () {
      localStorage.removeItem('token')
      this.$message.success('退出成功')
      this.$router.push({name: 'login'})
    },
    // 获取导航菜单数据
    async getMenus () {
      const res = await this.$http.get('/menus')
      console.log(res)
      this.menus = res.data.data
    }
  }
}
</script>

<style scoped lang="css">
 .container{
   height: 100%;
 }
  .header{
    background-color: #b3c0d1;
  }
  .aside{
    background-color: #d3dce6;
  }
  .main{
    background-color: #e9eef3;
  }
  /*
    头部样式调整
  */
  .middle{
    text-align: center;
  }
  .logout{
    line-height: 60px;
    text-decoration: none;
  }
</style>
