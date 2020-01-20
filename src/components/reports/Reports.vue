<template>
    <div>
<!--      面包屑-->
      <MyBread level1="数据统计" level2="数据报表"></MyBread>
      <el-card class="card">
        <div id="main" style="width: 600px;height: 400px;"></div>
      </el-card>
    </div>
</template>

<script>
 import MyBread from '../cuscom/myBread'
 let eCharts = require('echarts');
 export default {
   name: "Reports",
   components:{
     MyBread,
   },
   mounted(){
     this.useEchart()
   },
   methods:{
    async useEchart(){
       // 基于准备好的dom，初始化echarts实例
       let myChart = eCharts.init(document.getElementById('main'));
       // 获取图表数据
       const  res = await this.$http.get('/reports/type/1')
       console.log(res)
       let { data, meta } =  res.data
       if(meta.status === 200){
         let option2 = data
         let option1 ={
           title: {
             text: '堆叠区域图'
           },
           tooltip: {
             trigger: 'axis',
             axisPointer: {
               type: 'cross',
               label: {
                 backgroundColor: '#6a7985'
               }
             }
           },
           toolbox: {
             feature: {
               saveAsImage: {}
             }
           },
           grid: {
             left: '3%',
             right: '4%',
             bottom: '3%',
             containLabel: true
           },
         }
         // 展开运算府
         let option = { ...option1,...option2 }
         myChart.setOption(option)
       } else {
         this.$message.warning('数据报表获取失败!')
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
