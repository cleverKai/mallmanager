<template>
    <el-card class="box-card">
<!--     1. 面包屑-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>用户</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
<!--      2.搜索-->
      <el-row class="searchRow">
        <el-col>
          <el-input placeholder="请输入用户名" v-model="user" class="inputSearch">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
          <el-button type="success" class="addUser">添加用户</el-button>
        </el-col>
      </el-row>
<!--      3.表格-->
      <el-table
        :data="userList"
        style="width: 100%">
        <el-table-column
          type="index"
          label="#"
          width="60">
        </el-table-column>
        <el-table-column
          prop="username"
          label="姓名"
          width="100">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="电话">
        </el-table-column>

        <el-table-column
          prop="create_time"
          label="创建时间">
<!--          如果单元格内显示的内容不是字符串，而是组件-->
<!--          需要给被显示内容外层包裹一个template-->
<!--         template内部需要需要使用数据，需要设置slot-scope属性
             该属性值是插值表达式数据的数据源(自动从最外层传过来 = scope) 数据源.row就是数据源的每一项-->
          <template slot-scope="scope">
            {{scope.row.create_time | fmtDate}}
          </template>
        </el-table-column>

        <el-table-column
          label="用户状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作">
          <template slot-scope="scope">
            <el-row>
              <el-button plain="true" size="mini" type="primary" icon="el-icon-edit" circle></el-button>
              <el-button plain="true" size="mini" type="danger" icon="el-icon-delete" circle></el-button>
              <el-button plain="true" size="mini" type="success" icon="el-icon-check" circle></el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
<!--      4.分页-->
    </el-card>
</template>

<script>
export default {
  name: 'Users',
  data () {
    return {
      user: '',
      userList: [],
      // 分页相关数据
      pageNum: 1,
      pageSize: 10,
      total: 0,
      // 用户状态相关数据
      value: true
    }
  },
  mounted () {
    this.getUserList()
  },
  methods: {
    // 发送网络请求，获取用户列表数据
    async getUserList () {
      // query 查询参数  可以为空
      // pagenum 当前页码 不能为空
      // pagesize 每页显示条数  不能为空
      // eslint-disable-next-line no-unused-vars
      // 需要授权的API 必须设置请求头，并且要携带token
      const AUTH_TOKEN = localStorage.getItem('token')
      // eslint-disable-next-line no-undef
      this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
      const res = await this.$http.get('/users?query=' + this.user + '&pagenum=' + this.pageNum +
      '&pagesize=' + this.pageSize).then()
      console.log(res)

      // eslint-disable-next-line no-unused-vars,standard/object-curly-even-spacing
      const { meta: {msg, status}, data: { total, users}} = res.data

      if (status === 200) {
        // 1.渲染数据
        this.userList = users
        // 2.total赋值
        this.total = total
        // 3.提示
        this.$message.success(msg)
      } else {
        // 提示信息获取失败
        this.$message.warning(msg)     }
    }
  }
}
</script>
<style scoped lang="css">
  .box-card{
    height: 100%;
  }
  .searchRow{
    margin-top: 25px;
  }
  .inputSearch{
    width: 300px;
  }
  .addUser{
    margin-left: 20px;
  }
</style>
