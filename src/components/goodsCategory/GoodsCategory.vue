<template>
    <div>
<!--       面包屑-->
      <MyBread level1="商品管理" level2="商品分类"></MyBread>
       <el-card class="card">
<!--          添加分类按钮-->
         <el-button type="primary" @click="showAddCateDia">添加分类</el-button>
<!--         表格-->
         <el-table
           :data="cateData"
           border
           style="width: 100%;margin-top: 20px;">
           <el-table-column
             type="index"
             label="#"
             align="center"
             width="80">
           </el-table-column>
<!--           <el-table-column-->
<!--             prop="cat_name"-->
<!--             label="分类名称"-->
<!--             align="center"-->
<!--             width="300">-->
<!--&lt;          &ndash;&gt;-->
<!--&              treeKey - 节点的唯一标识-->
<!--                parentKey- 父节点唯一标识-->
<!--                levelKey&#45;&#45; 当前节点的级别-->
<!--                childKey&#45;&#45; 子节点的key&ndash;&gt;-->
<!--           </el-table-column>-->
           <el-tree-grid
             prop="cat_name"
             label="分类名称"
             treeKey="cat_id"
             parentKey="cat_pid"
             folder-icon=""
             levelKey="cat_level"
             :indentSize="20"
             childKey="children">
           </el-tree-grid>
           <el-table-column
             prop="address"
             align="center"
             label="是否有效">
             <template slot-scope="scope">
               <i class="el-icon-success" style="color: lightgreen;"></i>
             </template>
           </el-table-column>
           <el-table-column
             prop="address"
             align="center"
             label="排序">
             <template slot-scope="scope">
               <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
               <el-tag type="success" v-if="scope.row.cat_level ===1">二级</el-tag>
               <el-tag type="warning" v-if="scope.row.cat_level === 2">三级</el-tag>
             </template>
           </el-table-column>
           <el-table-column
             prop="address"
             align="center"
             label="操作">
             <template slot-scope="scope">
               <el-row>
                 <el-button plain size="mini"  type="primary" icon="el-icon-edit" circle></el-button>
                 <el-button plain size="mini"  type="danger" icon="el-icon-delete" circle></el-button>
               </el-row>
             </template>
           </el-table-column>
         </el-table>
         <!--      4.分页-->
         <el-pagination
           @size-change="handleSizeChange"
           @current-change="handleCurrentChange"
           :current-page="pageNum"
           :page-sizes="[5, 10, 15, 20]"
           :page-size="2"
           layout="total, sizes, prev, pager, next, jumper"
           :total="total">
         </el-pagination>
<!--          对话框-->
<!--          1.添加分类对话框-->
         <el-dialog width="30%" title="添加分类" :visible.sync="dialogFormVisibleAddCate">
           <el-form >
             <el-form-item label="分类名称" label-width="70px">
               <el-input v-model="cateName" autocomplete="off"></el-input>
             </el-form-item>
             <el-form-item label="父级分类" label-width="70px">
               <el-cascader
                 expandTrigger = "hover"
                 v-model="selectedOptions"
                 change-on-select
                 :options="options"
                 :props="defaultProp"
                 clearable
                 @change="handleChange">
               </el-cascader>
             </el-form-item>
           </el-form>
           <div slot="footer" class="dialog-footer">
             <el-button @click="dialogFormVisibleAddCate = false">取 消</el-button>
             <el-button type="primary" @click="addCategory">确 定</el-button>
           </div>
         </el-dialog>
       </el-card>
    </div>
</template>

<script>
  import MyBread from '../cuscom/myBread'
  //引入elementui-tree-grid
  import ElTreeGrid from 'element-tree-grid'
  export default {
    name: "GoodsCategory",
    components:{
      MyBread,
      ElTreeGrid
    },
    data(){
      return{
        cateData:[],
        // 当前页码
        pageNum:1,
        // 当前页数量
        pageSize:5,
        // 总数
        total: -1,
        // 添加分类相关数据
        cateName:'',
        selectedOptions:[],
        // 添加分类对话框相关属性
        dialogFormVisibleAddCate:false,
        // 级联选择器数据
        options:[],
        defaultProp: {
          label: 'cat_name',
          value: 'cat_id',
          children: 'children'
        },
        // 添加分类级别
        cat_level:-1,
        // 添加分类父级id
        cat_pid:-1
      }
    },
    mounted() {
      this.getCategoriesData()
    },
    methods:{
      // 获取分类全部数据
      async getCategoriesData(){
        const  res = await this.$http.get('/categories?type=3&pagenum=' + this.pageNum + '&pagesize=' + this.pageSize)
        console.log(res)
        const { data , meta } = res.data
        if(meta.status === 200){
          this.cateData = data.result
          this.total = data.total
        }
      },
      // 改变页数
      handleSizeChange(val){
        this.pageSize = val
        this.pageNum = 1
        this.getCategoriesData()
      },
      handleCurrentChange(val){
        this.pageNum = val
        this.getCategoriesData()
      },
      // 获取级联二级分类数据
      async getGoodsCate(){
        const res = await this.$http.get('categories?type=2')
        if(res.data.meta.status === 200){
           this.options = res.data.data
        }
      },
      // 点击添加分类按钮，打开对话框
      showAddCateDia(){
        this.dialogFormVisibleAddCate = true
        // 请求级联内二级分类的数据
        this.getGoodsCate()
      },
      // 点击添加分类对话框，添加数据
      addCategory(){
        this.$http.post('/categories/',{
          cat_pid:this.cat_pid,
          cat_name:this.cateName,
          cat_level:this.cat_level
        }).then((res) =>{
          console.log(res)
          let { data ,meta} = res.data
          if(meta.status === 201){
            // 关闭对话框
            this.dialogFormVisibleAddCate = false
            // 提示
            this.$message.success(meta.msg)
            // 更新数据
            this.cateName = ''
            this.selectedOptions = []
            this.getCategoriesData()
          } else {
            this.dialogFormVisibleAddCate = false
            this.$message.warning('添加分类失败!')
          }
        })
      },
      handleChange(val){
        console.log(val)
        if(val.length === 1){
          this.cat_level = 1
        }else {
          this.cat_level = 2
        }
        this.cat_pid = val[val.length-1]
      }
    }
  }
</script>

<style scoped lang="css">
  .card{
    margin-top: 20px;
  }
  .fileIcon{
    width: 0;
  }
</style>
