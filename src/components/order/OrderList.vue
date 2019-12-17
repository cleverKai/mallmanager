<template>
  <el-card>
<!--    面包屑-->
  <MyBread level1="订单管理" level2="订单列表"></MyBread>
<!--  搜索-->
   <el-row class="searchRow">
    <el-col>
      <el-input @clear="loadOrderList"  clearable placeholder="请输入订单编号" @keyup.enter.native="searchOrder" v-model="orders" class="inputSearch">
        <el-button   @click="searchOrder" slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </el-col>
  </el-row>
  </el-card>
</template>

<script>
import MyBread from '../cuscom/myBread'
export default {
  name: 'OrderList',
  components: {
    MyBread
  },
  methods:{
    searchOrder(){

    },
    //  清空搜索框
    loadOrderList(){

    }
  }
}
</script>

<style scoped>

</style>
