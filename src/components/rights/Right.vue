<template>
    <el-card>
<!--     1. 面包屑-->
      <MyBread level1="权限管理" level2="权限列表"></MyBread>
<!--     2.表格-->
    </el-card>
</template>

<script>
import MyBread from '../cuscom/myBread'
export default {
  name: 'right',
  data () {
    return {
      rightList: []
    }
  },
  components: {
    MyBread
  },
  mounted () {
    this.getRightList()
  },
  methods: {
    // 获取所有权限列表数据
    async getRightList () {
      // 需要授权的API 必须设置请求头，并且要携带token --- 该功能重构到请求拦截中
      // const AUTH_TOKEN = localStorage.getItem('token')
      // // eslint-disable-next-line no-undef
      // this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
      const res = await this.$http.get('/rights/list')
      // console.log(res)
      this.rightList = res.data.data
    }
  }
}
</script>

<style scoped>

</style>
