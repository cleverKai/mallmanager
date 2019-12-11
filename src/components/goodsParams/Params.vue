<template>
    <div>
      <!--      1.面包屑-->
      <MyBread level1="商品管理" level2="分类参数"></MyBread>
      <el-card class="card">
<!--        2.提示-->
        <el-alert :closable="false" title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon></el-alert>
<!--        3.级联选择器-->
        <el-form label-position="right" label-width="120px" style="margin-top: 20px">
          <el-form-item label="请选择商品分类:">
            <el-cascader
              expandTrigger = "hover"
              v-model="selectedOptions"
              :options="options"
              :props="defaultProp"
              @change="handleChange"></el-cascader>
          </el-form-item>
        </el-form>
<!--          4.标签页-->
        <el-tabs v-model="activeName" @tab-click="tabClick">
          <el-tab-pane label="动态参数" name="1">
            <el-button :disabled="isDisable" @click="isShowAddDyParams" style="margin-top: 10px" size="mini" type="primary">添加参数</el-button>
            <el-table
              :data="dyParamsData"
              border
              style="width: 100%;margin-top: 20px">
              <el-table-column
                type="expand"
                align="center"
                width="80">
                <!--                每行展开的容器-->
                <template slot-scope="scope">
                      <el-tag
                        v-if="scope.row.attr_vals !== ''"
                        :key="tag"
                        v-for="tag in (scope.row.attr_vals).split(' ')"
                        closable
                        :disable-transitions="false"
                        @close="handleClose(tag)">
                        {{tag}}
                      </el-tag>
                      <el-input
                        class="input-new-tag"
                        v-if="inputVisible"
                        v-model="inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputDyParamsConfirm(scope.row)"
                        @blur="handleInputDyParamsConfirm(scope.row)"
                      >
                      </el-input>
                      <el-button v-if="!inputVisible" class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                </template>
              </el-table-column>
              <el-table-column
                label="#"
                type="index"
                align="center"
                width="80">
              </el-table-column>
              <el-table-column
                prop="attr_name"
                label="参数名称"
                align="center"
                width="400">
              </el-table-column>
              <el-table-column
                align="center"
                label="操作">
<!--                按钮组件-->
                <template slot-scope="scope">
                  <el-row>
                    <el-button @click="showEditDyParamsDia(scope.row)"  plain size="mini" type="primary" icon="el-icon-edit" round >编辑</el-button>
                    <el-button @click="deleteDyParams(scope.row.cat_id,scope.row.attr_id)" plain size="mini" type="danger" icon="el-icon-delete" round>删除</el-button>
                  </el-row>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="静态属性" name="2">
            <el-button :disabled="isDisable" @click="showAddStaticParams" style="margin-top: 10px" size="mini" type="primary">添加属性</el-button>

            <el-table
              :data="staticParamsData"
              border
              style="width: 100%;margin-top: 20px">
              <el-table-column
                type="expand"
                align="center"
                width="80">
<!--                每行展开的容器-->
                <template slot-scope="scope">
                    <el-tag
                      v-if="scope.row.attr_vals !== ''"
                      :key="tag"
                      v-for="tag in (scope.row.attr_vals).split(' ')"
                      closable
                      :disable-transitions="false"
                      @close="handleClose(tag)">
                      {{tag}}
                    </el-tag>
                    <el-input
                      class="input-new-tag"
                      v-if="inputVisible"
                      v-model="inputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputDyParamsConfirm(scope.row)"
                      @blur="handleInputDyParamsConfirm"
                    >
                    </el-input>
                    <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                </template>
              </el-table-column>
              <el-table-column
                label="#"
                type="index"
                align="center"
                width="80">
              </el-table-column>
              <el-table-column
                prop="attr_name"
                label="属性名称"
                align="center"
                width="400">
              </el-table-column>
              <el-table-column
                align="center"
                label="操作">
<!--                操作组件-->
                <template slot-scope="scope">
                      <el-row>
                        <el-button @click="showEditStaticParams(scope.row)" plain size="mini" type="primary" icon="el-icon-edit" round>编辑</el-button>
                        <el-button @click="deleteStaticParams(scope.row.cat_id,scope.row.attr_id)" plain size="mini" type="danger" icon="el-icon-delete" round>删除</el-button>
                      </el-row>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
<!--        编辑动态参数对话框-->
        <el-dialog title="修改动态参数" width="30%" :visible.sync="dialogFormVisibleParamsEdit">
          <el-form   ref="ruleForm" class="demo-ruleForm">
            <el-form-item label="动态参数" label-width="80px">
              <el-input v-model="currDyParamsName" ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button style="margin-right: 20px;" @click="dialogFormVisibleParamsEdit = false">取 消</el-button>
            <el-button type="primary" @click="editDyParams">确 定</el-button>
          </div>
        </el-dialog>
        <!--        添加参数对话框-->
        <el-dialog title="添加动态参数" width="30%" :visible.sync="dialogFormVisibleParamsAdd">
          <el-form   ref="ruleForm" class="demo-ruleForm">
            <el-form-item label="动态参数" label-width="80px">
              <el-input v-model="newDyParamsName" placeholder="请输入要添加的动态参数名称"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button style="margin-right: 20px;" @click="dialogFormVisibleParamsAdd = false">取 消</el-button>
            <el-button type="primary" @click="addDyParams">确 定</el-button>
          </div>
        </el-dialog>
        <!--        编辑静态属性对话框-->
        <el-dialog title="修改静态属性" width="30%" :visible.sync="dialogFormVisibleStaticParamsEdit">
          <el-form   ref="ruleForm" class="demo-ruleForm">
            <el-form-item label="静态属性" label-width="80px">
              <el-input v-model="currStaticParamsName"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button style="margin-right: 20px;" @click="dialogFormVisibleStaticParamsEdit = false">取 消</el-button>
            <el-button type="primary" @click="editStaticParams">确 定</el-button>
          </div>
        </el-dialog>
        <!--        添加参数对话框-->
        <el-dialog title="添加静态属性" width="30%" :visible.sync="dialogFormVisibleStaticParamsAdd">
          <el-form   ref="ruleForm" class="demo-ruleForm">
            <el-form-item label="静态属性" label-width="80px">
              <el-input v-model="newStaticParamsName" placeholder="请输入要添加的静态属性名称"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button style="margin-right: 20px;" @click="dialogFormVisibleStaticParamsAdd = false">取 消</el-button>
            <el-button type="primary" @click="addStaticParams">确 定</el-button>
          </div>
        </el-dialog>
      </el-card>
    </div>
</template>

<script>
import MyBread from '../cuscom/myBread'
export default {
  name: "Params",
  data(){
    return{
      formLabelAlign:'',
      selectedOptions:[],
      // 基本商品信息联级选择器数据
      options: [],
      defaultProp: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      activeName:'1',
      // 动态参数列表
      dyParamsData:[],
      // 静态属性
      staticParamsData:[],
      // 按钮是否禁用
      isDisable:true,
      // 编辑动态参数对话框相关属性
      dialogFormVisibleParamsEdit: false,
      // 当前动态参数名称
      currDyParamsName:'',
      // 当前动态参数分类id和属性id
      currCateId:-1,
      currParamsId:-1,
      // 新添加动态参数
      newDyParamsName:'',
      // 添加动态参数对话框相关属性
      dialogFormVisibleParamsAdd: false,
      // 静态参数属性
      dialogFormVisibleStaticParamsEdit:false,
      //当前静态属性名称
      currStaticParamsName: '',
      // 当前静态属性分类id和和属性id
      currStaticCateId:-1,
      currStaticParamsId:-1,
      //添加静态属性相关属性
      dialogFormVisibleStaticParamsAdd:false,
      // 新添加的静态属性
      newStaticParamsName: '',
      // 当前动态参数值
      currAttrVal:[],
      inputVisible: false,
      inputValue: ''
    }
  },
  components:{
    MyBread
  },
  mounted() {
    this.getGoodsCate()
  },

  methods:{
    async getGoodsCate(){
      const  res = await  this.$http.get('categories?type=3')
      console.log(res);
      const  { data, meta } = res.data
      if(meta.status === 200){
        this.options = data
      }
    },
    // 获取动态参数数据
    getDyParamsData(){
      this.$http.get('categories/' + this.selectedOptions[2] + '/attributes?sel=many').then((res) =>{
        if(res.data.meta.status == 200){
          this.dyParamsData = res.data.data
          this.currCateId =this.dyParamsData[0].cat_id
        } else {
          this.$message.warning(res.data.meta.msg)
        }
      })
    },
    // 获取静态属性数据
    getStaticParamsData(){
      this.$http.get('categories/' + this.selectedOptions[2] + '/attributes?sel=only').then((res) =>{
        console.log(res)
        if(res.data.meta.status == 200){
          this.staticParamsData = res.data.data
          console.log(res)
        } else {
          this.$message.warning(res.data.meta.msg)
        }
      })
    },
    // 当级联选择器数据发生变化时触发
    handleChange(){
      if(this.activeName === '1'){
        if(this.selectedOptions.length === 3){
          this.isDisable = false
          this.getDyParamsData()
        }
      } else if(this.activeName === '2' && this.selectedOptions.length === 3 ){
          this.getStaticParamsData()
      }

    },
    // 切换tab是触发
    tabClick(){
      this.handleChange()
    },
    showEditDyParamsDia(params){
      this.dialogFormVisibleParamsEdit = true
      this.currDyParamsName = params.attr_name
      this.currCateId = params.cat_id
      this.currParamsId = params.attr_id

    },
    // 点击确定，发送请求
    async editDyParams(){
      let res = await this.$http.put('/categories/'+ this.currCateId  +'/attributes/'
        +this.currParamsId,{attr_name:this.currDyParamsName,attr_sel:'many'})
      console.log(res)
      const  { data , meta } = res.data
      if(meta.status = 200){
        //关闭对话框
        this.dialogFormVisibleParamsEdit = false
          // 提示
        this.$message.success(meta.msg)
        // 刷新视图
        this.getDyParamsData()
      }else {
        this.$message.error(meta.msg)
      }
    },
    // 打开添加动态参数对话框
    isShowAddDyParams(){
      this.dialogFormVisibleParamsAdd = true
    },
    async addDyParams(){
      const  res = await this.$http.post('/categories/' + this.currCateId +'/attributes/',
        {
          attr_name:this.newDyParamsName,
          attr_sel:'many',
          attr_vals: this.selectedOptions.join(',')
        })
      let { data, meta} = res.data
      if(meta.status === 201){
        // 提示
        this.$message.success(meta.msg)
        // 关闭对话框
        this.dialogFormVisibleParamsAdd = false
        this.newDyParamsName = ''
        // 更新视图
        this.getDyParamsData()
      } else {
        this.$message.warning(meta.msg)
      }
    },
    // 删除动态参数
    deleteDyParams(cate_id,attr_id){
      this.$confirm('此操作将永久删除该动态参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(async () => {
        const res = await this.$http.delete('/categories/'+ cate_id +'/attributes/' + attr_id)
        if(res.data.meta.status === 200){
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          //更新视图
          this.getDyParamsData()
        } else {
          this.message.error(res.data.meta.msg)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 点击静态参数编辑按钮，弹出对话框
    showEditStaticParams(staticParams){
      this.dialogFormVisibleStaticParamsEdit = true
      this.currStaticParamsName = staticParams.attr_name
      this.currStaticCateId = staticParams.cat_id
      this.currStaticParamsId = staticParams.attr_id
    },
    // 参数修改过后，点击确定按钮，发送网络请求
   async editStaticParams(){
      const  res = await this.$http.put('/categories/'+ this.currStaticCateId+'/attributes/'+
      this.currStaticParamsId, {attr_name:this.currStaticParamsName,attr_sel:'only'})
      let {data, meta} = res.data
      if(meta.status === 200){
        // 关闭对话框
        this.dialogFormVisibleStaticParamsEdit = false
        // 清空
        this.newStaticParamsName = ''
        // 提示
        this.$message.success(meta.msg)
        // 刷新视图
        this.getStaticParamsData()
      } else {
        this.$message.warning(meta.status)
      }
    },
    // 点击添加静态属性按钮 打开对话框
    showAddStaticParams(){
      this.dialogFormVisibleStaticParamsAdd = true
    },
    // 点击添加静态属性对话框确定按钮，发送请求
    addStaticParams(){
      this.$http.post('/categories/'+ this.staticParamsData[0].cat_id  +'/attributes/',
        {
          attr_name: this.newStaticParamsName,
          attr_sel:'only',
          attr_vals: this.selectedOptions.join(',')
         }).then((res) =>{
         if(res.data.meta.status === 201){
           // 关闭对话框
           this.dialogFormVisibleStaticParamsAdd = false
           //提示
           this.$message.success(res.data.meta.msg)
           // 更新视图
           this.getStaticParamsData()
         } else {
           this.$message.warning(res.data.meta.msg)
         }
      })
    },
    // 删除静态属性
    deleteStaticParams(cat_id,attr_id){
      this.$confirm('此操作将永久删除该静态属性, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then( async () => {
        const  res = await this.$http.delete('/categories/'+ cat_id + "/attributes/" + attr_id)
        const { msg, status } = res.data.meta
        if(status === 200){
          this.$message({
            type: 'success',
            message: msg
          });
          this.getStaticParamsData()
        }

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },

    showInput(dyParams) {
      if(dyParams.attr_id === this.currParamsId){
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      }
    },
    // 点击enter键或者鼠标失去焦点时触发，修改动态分类参数
    async handleInputDyParamsConfirm(dyParams) {
      this.inputVisible = false
      if(this.inputValue !== ''){
        const res = await this.$http.put('/categories/' + dyParams.cat_id + '/attributes/' + dyParams.attr_id,
          {
            attr_name: dyParams.attr_name,
            attr_sel: 'many',
            attr_vals: dyParams.attr_vals?dyParams.attr_vals+ ' ' +this.inputValue:this.inputValue
          })
        if (res.data.meta.status === 200) {
          //提示
          this.$message.success('修改参数项成功')
          //  刷新视图
          dyParams.attr_vals = res.data.data.attr_vals
          this.inputVisible = false
          this.inputValue = ''
        } else {
          this.$message.error('修改参数项失败')
        }
      }
    },
    // 失去焦点，触发修改动态参数
    // handleInputDyParamsConfirm(dyParams){
    //
    //   this.handleInputDyParamsConfirm(dyParams)
    // }
  }
}
</script>

<style scoped lang="css">
.card{
  margin-top: 20px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
