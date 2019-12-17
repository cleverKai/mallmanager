<template>
  <div>
    <!--    面包屑-->
    <MyBread level1="订单管理" level2="订单列表"></MyBread>
    <el-card class="card">
      <!--  搜索-->
      <el-row class="searchRow">
        <el-col>
          <el-input @clear="loadOrderList"  clearable placeholder="请输入订单编号" @keyup.enter.native="searchOrder" v-model="orders" class="inputSearch">
            <el-button   @click="searchOrder" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
<!--       数据表格-->
      <el-table
        :data="orderList"
        stripe
        border
        style="width: 100%;margin-top: 30px">
        <el-table-column
          type="index"
          label="#"
          align="center"
          width="80">
        </el-table-column>
        <el-table-column
          prop="name"
          label="订单编号"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="address"
          align="center"
          label="订单价格">
        </el-table-column>
        <el-table-column
        prop="address"
        align="center"
        label="是否付款">
       </el-table-column>
        <el-table-column
          prop="address"
          align="center"
          label="是否发货">
        </el-table-column>
        <el-table-column
          prop="address"
          align="center"
          label="下单时间">
        </el-table-column>
        <el-table-column
          prop="address"
          align="center"
          label="操作">
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import MyBread from '../cuscom/myBread'
export default {
  name: 'OrderList',
  components: {
    MyBread
  },
  data(){
    return{
      //订单数据
      orderList:[],
      orders:'',
      // 页码
      pageNum: 1,
      // 一页展示数量
      pageSize: 5,
      query: '',
    }
  },
  // 当页面一挂载完毕，发送网络请求
  mounted(){
    this.getOrderList()
  },
  methods:{
    async getOrderList(){
      const res = await this.$http.get('/orders?query=' + this.query + '&pagenum=' +this.pageNum
        +'&pagesize=' + this.pageSize)
      console.log(res)
    },
    searchOrder(){

    },
    //  清空搜索框
    loadOrderList(){

    }
  }
}
</script>

<style scoped lang="css">
  .card{
    margin-top: 20px;
  }
  .inputSearch{
    width: 300px;
  }
</style>
