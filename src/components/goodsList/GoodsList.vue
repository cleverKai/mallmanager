<template>
    <el-card>
      <!--      面包屑-->
      <MyBread level1="商品管理" level2="商品列表"></MyBread>
      <!--      2.搜索-->
      <el-row class="searchRow">
        <el-col>
          <el-input @clear="loadUserList"  clearable placeholder="请输入商品名称" @keyup.enter.native="searchUser" v-model="goods" class="inputSearch">
            <el-button   @click="searchUser" slot="append" icon="el-icon-search"></el-button>
          </el-input>
          <el-button type="success" class="addUser" @click="$router.push({name:'goodsAdd'})">添加商品</el-button>
        </el-col>
      </el-row>
<!--      商品表格-->
      <el-table
        class="table"
        border
        height="480px"
        :data="goodsList"
        v-loading="loading"
        style="width: 100%">
        <el-table-column
          type="index"
          label="#"
          width="60"
          align="center">
        </el-table-column>
        <el-table-column
          prop="goods_name"
          label="商品名称"
          width="400"
          align="center">
        </el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格(元)"
          align="center">
        </el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量"
          align="center">
        </el-table-column>
        <el-table-column
          prop="goods_number"
          label="商品数量"
          align="center">
        </el-table-column>
        <el-table-column
          label="创建日期"
          align="center">
          <!--          如果单元格内显示的内容不是字符串，而是组件-->
          <!--          需要给被显示内容外层包裹一个template-->
          <!--         template内部需要需要使用数据，需要设置slot-scope属性
                       该属性值是插值表达式数据的数据源(自动从最外层传过来 = scope) 数据源.row就是数据源的每一项-->
          <template slot-scope="scope">
            {{scope.row.add_time | fmtDate}}
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作"
          align="center">
          <template slot-scope="scope">
            <el-row>
              <el-button plain size="mini" @click="showEditGoodsDia(scope.row)" type="primary" icon="el-icon-edit" circle></el-button>
              <el-button plain size="mini" @click="showDeleGoodsMsgBox(scope.row.goods_id)" type="danger" icon="el-icon-delete" circle></el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <!--      4.分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[20, 40, 70, 100]"
        :page-size="20"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      <!--     2. 编辑商品的对话框-->
      <el-dialog width="30%" title="编辑商品" :visible.sync="dialogFormVisibleEditGoods">
        <el-form class="e-form" :model="form">
          <el-form-item label="商品名称" label-width="70px">
            <el-input  v-model="form.goodsName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" label-width="70px">
            <el-input v-model="form.goodsPrice" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" label-width="70px">
            <el-input v-model="form.goodsWeight" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" label-width="70px">
            <el-input v-model="form.goodsNum" autocomplete="off" ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button style="margin-right: 20px;" @click="dialogFormVisibleEditGoods = false">取 消</el-button>
          <el-button type="primary" @click="editGoods">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
</template>

<script>
import MyBread from '../cuscom/myBread'
export default {
  name: 'GoodsList',
  data () {
    return {
      goodsList: [],
      goods: '',
      pageNum: 1,
      pageSize: 20,
      total: 0,
      // 编辑商品 相关属性
      dialogFormVisibleEditGoods: false,
      // 商品相关数据
      form: {
        goodsName: '',
        goodsPrice: 0,
        goodsWeight: 0,
        goodsNum: 0
      },
      // 当前商品id
      currGoodsId: 0 ,
      loading: true
    }
  },
  mounted () {
    this.getGoodsList()
  },
  components: {
    MyBread
  },
  methods: {
    // 获取商品列表信息
    async getGoodsList () {
      const res = await this.$http.get('/goods?query=' + this.goods + '&pagenum=' + this.pageNum +
        '&pagesize=' + this.pageSize)
      // eslint-disable-next-line no-unused-vars
      const {data: {goods, total}, meta: {msg, status}} = res.data
      if (status === 200) {
        this.loading = false
        this.goodsList = goods
        this.total = total
      }
    },
    // 搜索商品
    searchUser () {
      if (this.goods === '') {
        this.$message.warning('请输入要搜索的商品！')
      } else {
        this.getGoodsList()
      }
    },
    // 分页方法
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.pageNum = 1
      this.getGoodsList()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pageNum = val
      this.getGoodsList()
    },
    // 清空搜索框，重新加载
    loadUserList () {
      this.getGoodsList()
    },
    // 删除商品信息
    showDeleGoodsMsgBox (goodsId) {
      this.$confirm('此操作将删除该商品 , 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(async () => {
        // 发送删除用户的请求
        // eslint-disable-next-line no-unused-vars
        const res = await this.$http.delete('/goods/' + goodsId)
        // console.log(res)
        if (res.data.meta.status === 200) {
          this.pageNum = 1
          // 更新视图
          this.getGoodsList()
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
    // 点击编辑按钮，打开编辑商品对话框
    showEditGoodsDia (goods) {
      this.dialogFormVisibleEditGoods = true
      this.form.goodsName = goods.goods_name
      this.form.goodsPrice = goods.goods_price
      this.form.goodsWeight = goods.goods_weight
      this.form.goodsNum = goods.goods_number
      this.currGoodsId = goods.goods_id
    },
    // 点击编辑商品确定按钮，更改商品信息
    editGoods () {
      this.$http.put('/goods/' + this.currGoodsId, {
        goods_name: this.form.goodsName,
        goods_price: this.form.goodsPrice,
        goods_number: this.form.goodsNum,
        goods_weight: this.form.goodsWeight
      }).then((res) => {
        console.log(res)
      })
    }
  }
}
</script>

<style scoped lang="css">
.searchRow{
  margin-top: 25px;
}
.inputSearch{
  width: 300px;
}
.addUser{
  margin-left: 20px;
}
  .table{
    margin-top: 20px;
  }
</style>
