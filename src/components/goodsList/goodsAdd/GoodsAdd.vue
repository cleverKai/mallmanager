<template>
    <el-card>
      <!--      1.面包屑-->
      <MyBread level1="商品管理" level2="商品列表"></MyBread>
<!--      2提示-->
      <el-alert
        v-if="active==='5'"
        class="alert"
        title="添加商品信息"
        type="success"
        center
        show-icon>
      </el-alert>
      <el-alert
        v-else
        class="alert"
        title="添加商品信息"
        type="info"
        center
        show-icon>
      </el-alert>
<!--      步骤条-->
      <el-steps class="steps" align-center :active="Number(active)" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
      </el-steps>
      <!--  tab 当v-model 里面的active绑定的值与name一致时 当前tab被选中-->
      <el-form label-position="top" label-width="80px" :model="form" style="height: 420px; overflow: auto">
        <el-tabs v-model="active" tab-position="left" style="margin-top: 20px;">
          <el-tab-pane name="1" label="基本信息">
<!--            添加商品基本信息-->
            <el-form-item label="商品名称">
              <el-input v-model="form.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格">
              <el-input v-model="form.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品数量">
              <el-input v-model="form.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量">
              <el-input v-model="form.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品重量">
              <el-cascader
                v-model="value"
                :options="options"
                :props="{ expandTrigger: 'hover' }"
                @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="2" label="商品参数">

          </el-tab-pane>
          <el-tab-pane name="3" label="商品属性">

          </el-tab-pane>
          <el-tab-pane name="4" label="商品图片">

          </el-tab-pane>
          <el-tab-pane name="5" label="商品内容">

          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
</template>

<script>
import MyBread from '../../cuscom/myBread'
export default {
  name: 'GoodsAdd',
  data () {
    return {
      active: '1',
      // 添加商品的表单数据
      form: {
        goods_name: '',
        goods_cat: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_introduce: '',
        pics: [],
        attrs: []
      },
      // 基本商品信息联级选择器数据
      options: [],
      // 联级菜单表单数据
      value: ''
    }
  },
  components: {
    MyBread
  },
  methods:{
    handleChange (val) {
      console.log(val)
    }
  }
}
</script>

<style scoped lang="css">
.alert{
  margin-top: 30px;
}
  .steps{
    margin-top: 30px;
  }
</style>
