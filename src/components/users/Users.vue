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
          <el-input @clear="loadUserList"  clearable placeholder="请输入用户名" @keyup.enter.native="searchUser" v-model="user" class="inputSearch">
            <el-button  @click="searchUser" slot="append" icon="el-icon-search"></el-button>
          </el-input>
          <el-button type="success" class="addUser" @click="showAddUserDia">添加用户</el-button>
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
              <el-button plain size="mini" @click="showEditUserDia(scope.row)" type="primary" icon="el-icon-edit" circle></el-button>
              <el-button plain size="mini" @click="showDeleUserMsgBox(scope.row.id)" type="danger" icon="el-icon-delete" circle></el-button>
              <el-button plain size="mini" type="success" icon="el-icon-check" circle></el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
<!--      4.分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="2"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>

<!--      对话框-->
<!--      1.添加用户的对话框-->
      <el-dialog width="30%" title="添加用户" :visible.sync="dialogFormVisibleAdd">
        <el-form class="e-form" :model="form">
          <el-form-item label="用户名" label-width="70px">
            <el-input v-model="form.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" label-width="70px">
            <el-input type="password" v-model="form.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" label-width="70px">
            <el-input v-model="form.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话" label-width="70px">
            <el-input v-model="form.mobile" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button style="margin-right: 20px;" @click="dialogFormVisibleAdd = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </div>
      </el-dialog>

<!--     2. 编辑用户的对话框-->
      <el-dialog width="30%" title="编辑用户" :visible.sync="dialogFormVisibleEdit">
        <el-form class="e-form" :model="form">
          <el-form-item label="用户名" label-width="70px">
            <el-input  disabled v-model="form.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" label-width="70px">
            <el-input v-model="form.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话" label-width="70px">
            <el-input v-model="form.mobile" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button style="margin-right: 20px;" @click="dialogFormVisibleEdit = false">取 消</el-button>
          <el-button type="primary" @click="editUser()">确 定</el-button>
        </div>
      </el-dialog>
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
      pageSize: 2,
      total: 0,
      // 用户状态相关数据
      value: true,
      // 添加用户 对话框属性
      dialogFormVisibleAdd: false,
      // 编辑用户 对话框属性
      dialogFormVisibleEdit: false,
      // 添加用户的表单数据
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 当前用户id
      // currentUserId: 0
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
        // this.$message.success(msg)
      } else {
        // 4.提示信息获取失败
        this.$message.warning(msg)
      }
    },
    // 分页方法
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.pageNum = 1
      this.getUserList()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pageNum = val
      this.getUserList()
    },
    // 搜索用户信息
    searchUser () {
      console.log('user')
      this.getUserList()
    },
    // 清空输入框， 重新加载用户数据
    loadUserList () {
      this.getUserList()
    },
    // 点击显示添加用户对话框
    showAddUserDia () {
      this.form = {}
      this.dialogFormVisibleAdd = true
    },
    // 点击确定,发送网络请求,添加用户
    async addUser () {
      const res = await this.$http.post('/users', this.form)
      console.log(res)
      // eslint-disable-next-line no-unused-vars,standard/object-curly-even-spacing
      const { meta: { msg, status}, data} = res.data
      if (status === 201) {
        // 请求发送成功
        // 1.提示添加成功
        this.$message.success(msg)
        // 2.关闭对话框
        this.dialogFormVisibleAdd = false
        // 3.更新视图
        this.getUserList()
        // 4.清空文本框
        this.form = {}
      } else {
        this.$message.warning(msg)
      }
    },
    // 点击删除按钮,弹出对话框
    showDeleUserMsgBox (userId) {
      this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(async () => {
        // 发送删除用户的请求
        // eslint-disable-next-line no-unused-vars
        const res = await this.$http.delete('/users/' + userId)
        console.log(res)
        if (res.data.meta.status === 200) {
          this.pageNum = 1
          // 更新视图
          this.getUserList()
          // 提示成功
          this.$message({
            type: 'success',
            message: res.data.meta.msg
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 点击编辑按钮 弹出对话框
    showEditUserDia (userInfo) {
      // 把每条用户的信息赋值给data中的form
      this.form = userInfo
      this.dialogFormVisibleEdit = true
    }, // 点击确定，编辑用户 发送网络请求
    async editUser () {
      const res = await this.$http.put('/users/' + this.form.id, {email: this.form.email, mobile: this.form.mobile})
      // 1. 关闭对话框
      this.dialogFormVisibleEdit = false
      // 2.更新数据
      this.getUserList()
      // 3.提示
      if (res.data.meta.status === 200) {
        this.$message.success(res.data.meta.msg)
      } else {
        this.$message.warning(res.data.meta.msg)
      }
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
