<template>
  <div>
    <!--    面包屑-->
    <MyBread level1="订单管理" level2="订单列表"></MyBread>
    <el-card class="card">
      <!--  搜索-->
      <el-row class="searchRow">
        <el-col>
          <el-input  clearable placeholder="请输入订单编号" @keyup.enter.native="searchOrder" v-model="orders" class="inputSearch">
            <el-button   @click="searchOrder" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
<!--       数据表格-->
      <el-table
        :data="orderList"
        stripe
        border
        height="400px"
        style="width: 100%;margin-top: 30px">
        <el-table-column
          type="index"
          label="#"
          align="center"
          width="80">
        </el-table-column>
        <el-table-column
          prop="order_number"
          label="订单编号"
          align="center"
          width="250">
        </el-table-column>
        <el-table-column
          prop="order_price"
          align="center"
          label="订单价格">
        </el-table-column>
        <el-table-column
        prop="address"
        align="center"
        label="是否付款">
          <template slot-scope="scope">
            <span v-if="scope.row.pay_status === '0'"><el-tag type="danger">未付款</el-tag></span>
            <span v-else ><el-tag type="success">已付款</el-tag></span>
          </template>
       </el-table-column>
        <el-table-column
          prop="is_send"
          align="center"
          label="是否发货">
        </el-table-column>
        <el-table-column
          prop="address"
          align="center"
          label="下单时间">
          <template slot-scope="scope">
            {{scope.row.create_time | fmtDate}}
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          align="center"
          label="操作">
          <template slot-scope="scope">
             <el-row>
               <el-button type="primary" @click="showOrderEditDia" plain size="mini" icon="el-icon-edit" circle></el-button>
               <el-button type="success" @click="showOrderDetail(scope.row)" plain size="mini" icon="el-icon-check" circle></el-button>
             </el-row>
          </template>
        </el-table-column>
      </el-table>
<!--      &#45;&#45;      4.分页&ndash;&gt;-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[5, 10, 15]"
        :page-size="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
<!--      订单详情对话框-->
      <el-dialog title="订单详情" :visible.sync="dialogVisibleOrderDetail" width="30%">
      <el-form :model="orderDetailData">
        <el-form-item label="订单编号:" label-width="80px">
          {{orderDetailData.order_number}}
        </el-form-item>
        <el-form-item label="订单价格:" label-width="80px">
          {{orderDetailData.order_price}}
        </el-form-item>
        <el-form-item label="支付状态:" label-width="80px">
          <span v-if="orderDetailData.pay_status === '0'">未付款</span>
          <span v-else>已付款</span>
        </el-form-item>
        <el-form-item label="发货状态:" label-width="80px">
          {{orderDetailData.is_send}}
        </el-form-item>
        <el-form-item label="订单发票:" label-width="80px">
          {{orderDetailData.order_fapiao_title}}
        </el-form-item>
        <el-form-item label="公司名称:" label-width="80px">
          <span v-if="orderDetailData.order_fapiao_company === ''">暂无</span>
          <span v-else>{{ orderDetailData.order_fapiao_company }}</span>
        </el-form-item>
        <el-form-item label="发票内容:" label-width="80px">
          <span v-if="orderDetailData.order_fapiao_content === ''">暂无</span>
          <span v-else>{{ orderDetailData.order_fapiao_content }}</span>
        </el-form-item>
        <el-form-item label="发货地址:" label-width="80px">
          <span v-if="orderDetailData.consignee_addr === ''">暂无</span>
          <span v-else>{{ orderDetailData.consignee_addr }}</span>
        </el-form-item>

        <span slot="footer" class="dialog-footer">;
        <el-button @click="dialogVisibleOrderDetail = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisibleOrderDetail = false">确 定</el-button>
      </span>
      </el-form>
      </el-dialog>
<!--      修改订单地址对话框-->
      <el-dialog width="35%" title="修改订单地址" :visible.sync="dialogFormVisibleEditOrderAddr">
        <el-form >
          <el-form-item label="收获地址" label-width="70px">
            <el-cascader
              expandTrigger = "hover"
              v-model="selectedOptions"
              clearable
              :options="options"
              ></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" label-width="70px">
            <el-input v-model="Address" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleEditOrderAddr = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisibleEditOrderAddr = false">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import MyBread from '../cuscom/myBread'
import cityList from  '@/assets/city_data2017_element.js'
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
      // 订单总数
      total:-1,
      // 订单详情对话框
      dialogVisibleOrderDetail:false,
      orderDetailData:{},
      // 修改订单地址相关属性
      dialogFormVisibleEditOrderAddr:false,
      // 详细地址
      Address:'',
      selectedOptions:[],
      options:[]
    }
  },
  // 当页面一挂载完毕，发送网络请求
  mounted(){
    this.getOrderList()
  },
  methods:{
    async getOrderList(){
      const res = await this.$http.get('/orders?query=' + this.orders +  '&pagenum=' +this.pageNum
        +'&pagesize=' + this.pageSize)
      const { data , meta} = res.data
      if(meta.status === 200){
        this.orderList = data.goods
        this.total = data.total
      } else {
        this.$message.success('订单数据获取失败!')
      }
    },
    // 改变每页数据量
    handleSizeChange(val){
      this.pageSize  = val
      this.pageNum = 1
      this.getOrderList()
    },
    handleCurrentChange(val){
      this.pageNum = val
      this.getOrderList()
    },
    searchOrder(){
      if(this.orders === ''){
        this.$message.warning('请输入要查询的订单编号')
      } else {
        this.getOrderList()
      }
    },
    // 查看用户订单详情
    showOrderDetail(order){
      this.dialogVisibleOrderDetail = true
        this.$http.get('/orders/' + order.order_id).then((res)=>{
          console.log(res)
          const { data, meta } = res.data
          if(meta.status === 200){
            this.orderDetailData = data
          }
        })
    },
    //  打开修改订单地址对话框
    showOrderEditDia(){
      this.dialogFormVisibleEditOrderAddr = true
      this.options = cityList
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
