<template>
    <div>
<!--       面包屑-->
      <MyBread level1="商品管理" level2="商品分类"></MyBread>
       <el-card class="card">
<!--          添加分类按钮-->
         <el-button type="primary">添加分类</el-button>
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
        total: -1

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
