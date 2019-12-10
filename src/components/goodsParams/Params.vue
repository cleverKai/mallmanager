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
                    <el-button plain size="mini" type="danger" icon="el-icon-delete" round>删除</el-button>
                  </el-row>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="静态属性" name="2">
            <el-button :disabled="isDisable" style="margin-top: 10px" size="mini" type="primary">添加属性</el-button>

            <el-table
              :data="staticParamsData"
              border
              style="width: 100%;margin-top: 20px">
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
                        <el-button plain size="mini" type="primary" icon="el-icon-edit" round>编辑</el-button>
                        <el-button plain size="mini" type="danger" icon="el-icon-delete" round>删除</el-button>
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
              <el-input v-model="currDyParamsName"></el-input>
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
              <el-input v-model="newDyParamsName"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button style="margin-right: 20px;" @click="dialogFormVisibleParamsAdd = false">取 消</el-button>
            <el-button type="primary" @click="addDyParams">确 定</el-button>
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
      dialogFormVisibleParamsAdd: false
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
        // 更新视图
        this.getDyParamsData()
      } else {
        this.$message.warning(meta.msg)
      }
    }
  }
}
</script>

<style scoped lang="css">
.card{
  margin-top: 20px;
}
</style>
