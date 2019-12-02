<template>
    <el-card>
<!--      面包屑-->
      <MyBread level1="权限管理" level2="角色列表"></MyBread>
<!--      添加角色按钮-->
      <el-row class="btn">
        <el-col>
        <el-button @click="showAddUserRole"  type="success">添加角色</el-button>
        </el-col>
      </el-row>
<!--      表格-->
      <el-table
        :data="roleList"
        v-loading="loading"
        style="width: 100%"
      height="530px">
        <el-table-column
          type="index"
          label="#"
          width="150">
        </el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名称"
          width="200">
        </el-table-column>
        <el-table-column
          prop="roleDesc"
          width="200"
          label="角色描述">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-row>
              <el-button plain size="mini" @click="showEditUserRoleDia(scope.row)" type="primary" icon="el-icon-edit" circle></el-button>
              <el-button plain size="mini" @click="showDeleUserRoleBox(scope.row.id)" type="danger" icon="el-icon-delete" circle></el-button>
              <el-button plain size="mini" @click="showSetUserRoleDia(scope.row)" type="success" icon="el-icon-check" circle></el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <!--      对话框-->
      <!--      1.添加用户角色的对话框-->
      <el-dialog width="30%" title="添加角色" :visible.sync="dialogFormVisibleAddRole">
        <el-form class="e-form" :model="form">
          <el-form-item label="角色名称" label-width="70px">
            <el-input v-model="form.roleName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" label-width="70px">
            <el-input  v-model="form.roleDesc" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button style="margin-right: 20px;" @click="dialogFormVisibleAddRole = false">取 消</el-button>
          <el-button type="primary" @click="addUserRole">确 定</el-button>
        </div>
      </el-dialog>
      <!--      2.编辑用户角色的对话框-->
      <el-dialog width="30%" title="编辑角色" :visible.sync="dialogFormVisibleEditRole">
        <el-form class="e-form" :model="form">
          <el-form-item label="角色名称" label-width="70px">
            <el-input v-model="form.roleName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" label-width="70px">
            <el-input  v-model="form.roleDesc" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button style="margin-right: 20px;" @click="dialogFormVisibleEditRole = false">取 消</el-button>
          <el-button type="primary" @click="editUserRole">确 定</el-button>
        </div>
      </el-dialog>

    </el-card>
</template>

<script>
import MyBread from '../cuscom/myBread'
export default {
  name: 'Role',
  components: {
    MyBread
  },
  data () {
    return {
      roleList: [],
      loading: true,
      // 添加角色对话框属性
      dialogFormVisibleAddRole: false,
      // 添加角色的数据
      form: {
        roleName: '',
        roleDesc: ''
      },
      // 编辑角色对话框属性
      dialogFormVisibleEditRole: false,
      // 当前用户角色id
      currRoleId: -1
    }
  },
  mounted () {
    this.getRoleList()
  },
  methods: {
    async getRoleList () {
      const res = await this.$http.get('/roles')
      if (res.data.meta.status === 200) {
        this.loading = false
        this.roleList = res.data.data
      } else {
        this.$message.warning(res.data.meta.msg)
        this.loading = false
      }
    },
    // 点击按钮  打开对话框
    showAddUserRole () {
      this.dialogFormVisibleAddRole = true
      // 清除上次填入的数据
      this.form = {}
    },
    // 点击对话框确定按钮，发送网络请求
    addUserRole () {
      this.$http.post('/roles', {
        roleName: this.form.roleName,
        roleDesc: this.form.roleDesc
      }).then((res) => {
        // eslint-disable-next-line no-empty-pattern,no-unused-vars
        const {data: {}, meta: { msg,status}} = res.data
        if (status === 201) {
          // 提示用户修改成功
          this.$message.success(msg)
          // 关闭对话框
          this.dialogFormVisibleAddRole = false
          // 更新视图
          this.getRoleList()
        } else {
          this.$message.warning(msg)
          this.dialogFormVisibleAddRole = false
        }
      })
    },
    // 删除当前角色
    showDeleUserRoleBox (userRoleId) {
      this.$confirm('此操作将永久删除该用户角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(async () => {
        const res = await this.$http.delete('/roles/' + userRoleId)
        if (res.data.meta.status === 200) {
          // 更新视图
          this.getRoleList()
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
    // 打开编辑角色对话框
    showEditUserRoleDia (userRole) {
      // 将当前用户的ID 赋值给curRoleId
      this.currRoleId = userRole.id
      this.dialogFormVisibleEditRole = true
      this.form.roleName = userRole.roleName
      this.form.roleDesc = userRole.roleDesc
    },
    // 点击对话框确定按钮 ，修改用户信息，发送网络请求
    editUserRole () {
      this.$http.put('/roles/' + this.currRoleId,
        {roleName: this.form.roleName, roleDesc: this.form.roleDesc}).then((res) => {
        console.log(res)
        if (res.data.meta.status === 200) {
          // 提示用户
          this.$message.success('修改成功！')
          // 关闭对话框
          this.dialogFormVisibleEditRole = false
          // 刷新数据
          this.getRoleList()
        } else {
          this.dialogFormVisibleEditRole = false
          this.$message.warning('修改失败')
        }
      })
    }
  }

}
</script>

<style scoped lang="css">
  .btn{
    margin-top: 20px;
  }
</style>
