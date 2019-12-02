<template>
    <el-card>
<!--     1. 面包屑-->
      <MyBread level1="权限管理" level2="权限列表"></MyBread>
<!--     2.表格-->
      <el-table
        v-loading="loading"
        class="table"
        :data="rightList"
        height="550px"
        border
        style="width: 100%">
        <el-table-column
          type="index"
          label="#"
          width="100"
          align="center">
        </el-table-column>
        <el-table-column
          prop="authName"
          label="权限名称"
          width="200"
          align="center">
        </el-table-column>
        <el-table-column
          prop="path"
          label="路径"
          width="350"
          align="center">
        </el-table-column>
        <el-table-column
          label="层级"
          align="center">
<!--          在第三方组件内使用标签，必须写在template里面-->
          <template slot-scope="scope">
            <span v-if="scope.row.level ==='0'">一级</span>
            <span v-if="scope.row.level ==='1'">二级</span>
            <span v-if="scope.row.level ==='2'">三级</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
</template>

<script>
import MyBread from '../cuscom/myBread'
export default {
  name: 'right',
  data () {
    return {
      rightList: [],
      loading: true
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
      this.loading = false
      console.log(res)
      this.rightList = res.data.data
    }
  }
}
</script>

<style scoped lang="css">
  .table{
    margin-top: 30px;
  }
</style>
