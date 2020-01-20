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
          type="expand"
          width="100">
<!--          每行展开容器-->
          <template slot-scope="scope">
              <el-row v-for="(item1,index) in scope.row.children" :key="index">
<!--                一级权限-->
                <el-col :span="4">
                  <el-tag @close="deleRight(scope.row,item1.id)" closable>{{ item1.authName }}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
<!--                二级权限-->
                <el-col :span="20">
                  <el-row v-for="(item2,index) in item1.children" :key="index">
                    <el-col :span="4">
                      <el-tag @close="deleRight(scope.row,item2.id)" closable type="success">{{ item2.authName }}</el-tag>
                      <i class="el-icon-arrow-right"></i>
                    </el-col>
<!--                    三级权限-->
                    <el-col  :span="20">
                      <el-tag closable @close="deleRight(scope.row,item3.id)" type="warning" v-for="(item3,index) in item2.children" :key="index">
                        {{ item3.authName }}
                      </el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
<!--            未分配任何权限-->
            <span v-if="scope.row.children.length === 0">该角色未分配任何权限!</span>
          </template>
        </el-table-column>
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
              <el-button plain size="mini" @click="showSetRightDia(scope.row)" type="success" icon="el-icon-check" circle></el-button>
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
<!--       修改角色对话框-->
      <el-dialog title="修改权限" :visible.sync="dialogFormVisibleRight">
          <!--
          树形结构
          data -> 数据源 []
          show-checkbox -> 选择框
          node-key ->每个节点的唯一标识，通常是data数据源中key名id
          default-expanded-keys 默认展开的节点id
          default-checked-keys 默认选择的节点id
          props -> 配置项 { label,children}
          label 节点的文字标题和children节点的子节点
          其值来源于data绑定数据源中该数据的key名 "label" , "children"
          :default-checked-keys="[5]"
         -->
        <el-tree
          ref="tree"
          :data="treeList"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="checkedArr"
          :props="defaultProps">
        </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleR = false">取 消</el-button>
        <el-button type="primary" @click="setRoleRight">确 定</el-button>
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
      currRoleId: -1,
      // 修改权限相关属性
      dialogFormVisibleRight: false,
      // 树形权限列表数据
      treeList: [],
      defaultProps: {
        label: 'authName',
        children: 'children'
      },
      // 需要默认展开的节点id
      arrExpand: [] ,
      // 该角色已有的权限id
      checkedArr: []
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
        // eslint-disable-next-line no-empty-pattern,standard/object-curly-even-spacing
        const {data: {}, meta: { msg, status}} = res.data
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
          // 重新赋值roleList
          this.roleList = res.data.data
          // // 更新视图
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
    },
    // 取消角色权限
    deleRight (role, rightId) {
      // 接口路径 roles/:roleid/rights/rightId
      this.$confirm('此操作将永久取消该角色权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(async () => {
        const res = await this.$http.delete('/roles/' + role.id + '/rights/' + rightId)
        if (res.data.meta.status === 200) {
          // 用户提示
          this.$message({
            type: 'success',
            message: res.data.meta.msg
          })
          // 刷新视图 ,将剩余返回的值赋值给当前角色.children
          role.children = res.data.data
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 添加角色权限 ，打开对话框
    showSetRightDia (role) {
      this.currRoleId = role.id
      let arrtemp2 = []
      role.children.forEach((item1) => {
        // arrtemp2.push(item1.id)
        item1.children.forEach((item2) => {
          // arrtemp2.push(item2.id)
          item2.children.forEach((item3) => {
            arrtemp2.push(item3.id)
          })
        })
      })
      this.checkedArr = arrtemp2
      this.$http.get('/rights/tree').then((res) => {
        if (res.data.meta.status === 200) {
          this.treeList = res.data.data
          // 将所有节点的id 放到 数组里面
          // let arrtemp1 = []
          // this.treeList.forEach((item1) => {
          //   arrtemp1.push(item1.id)
          //   item1.children.forEach((item2) => {
          //     arrtemp1.push(item2.id)
          //     item2.children.forEach((item3) => {
          //       arrtemp1.push(item3.id)
          //     })
          //   })
          // })
          // this.arrExpand = arrtemp1
        }
      })
      this.dialogFormVisibleRight = true
    },
    // 点击修改权限对话框确定按钮，发送请求
    async setRoleRight () {
      // rids 是树形节点中 所有全选和半选的label的id []
      // 1.获取全选id的数组 arr1 getCheckedKeys()
      let arr1 = this.$refs.tree.getCheckedKeys()
      // 在vue中，调用dom元素的js方法
      // 1. 给dom元素添加ref属性值，
      // 2. this.$refs.ref属性值
      // 2.获取半选id的数组 arr2 getHalfCheckedKeys()
      let arr2 = this.$refs.tree.getHalfCheckedKeys()
      let arr = [...arr1, ...arr2]
      const res = await this.$http.post('/roles/' + this.currRoleId + '/rights/', {rids: arr.join(',')})
      const  {msg, status} = res.data.meta
      if (status === 200) {
        // 请求成功
        // 1. 关闭对话框
        this.dialogFormVisibleRight = false
        // 2. 提示用户
        this.$message.success(msg)
        // 3. 更新视图
        this.getRoleList()
      } else {
        this.dialogFormVisibleRight = false
        this.$message.warning(msg)
      }
    }
  }

}
</script>

<style scoped lang="css">
  .btn{
    margin-top: 20px;
  }
</style>
