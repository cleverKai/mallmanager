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
        :closable="false"
        show-icon>
      </el-alert>
      <el-alert
        :closable="false"
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
        <el-tabs @tab-click="tabChange" v-model="active" tab-position="left" style="margin-top: 20px;">
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
            <el-form-item label="商品参数">
              <el-cascader
                clearable
                props.expandTrigger = "hover"
                v-model="selectedOptions"
                :options="options"
                :props="defaultProp"
                @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="2" label="商品参数">
<!--            该三级分类的商品参数-->
              <el-form-item  :label="item1.attr_name" v-for="(item1,index) in arrDyParams" :key="index">
<!--                 复选框-->
                <el-checkbox-group  v-model="item1.attr_vals">
                  <el-checkbox border v-for="(item2,index) in item1.attr_vals" :key="index" :label="item2"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="3" label="商品属性">
            <!--            添加商品基本信息-->
            <el-form-item v-for="(item3,index) in staticDyParams" :key="index" :label="item3.attr_name">
              <el-input v-model="item3.attr_vals"></el-input>
            </el-form-item>
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
      // 级联菜单表单数据
      selectedOptions: [],
      defaultProp: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 动态参数的数据数组
      arrDyParams: [],
      // 复选框组数组
      checkList: [],
      staticDyParams: []
    }
  },
  components: {
    MyBread
  },
  mounted () {
    this.getGoodsCate()
  },
  methods: {
    // 级联选择器@change触发的事件
    handleChange (val) {
      console.log(val)
    },
    // 获取级联三级菜单信息
    async getGoodsCate () {
      const res = await this.$http.get('categories?type=3')
      console.log(res)
      const {data, meta} = res.data
      if (meta.status === 200) {
        this.options = data
      }
    },
    // tab改变时触发
    tabChange () {
      // 如果点击的是第二个tab,同时三级分类要有值
      if (this.active === '2') {
        if (this.selectedOptions.length !== 3) {
          // 提示
          this.$message.warning('请选择商品的三级分类')
        } else {
          // 发送网络请求，获取三级分类商品的属性
          // id 指当前的分类id
          this.$http.get('categories/' + this.selectedOptions[2] + '/attributes?sel=many').then((res) => {
            // eslint-disable-next-line no-unused-vars
            if (res.data.meta.status === 200) {
              this.arrDyParams = res.data.data
              // this.arrDyParams每个对象.attr_vals 字符串转为数组
              this.arrDyParams.forEach((item) => {
                item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
              })
            }
          })
        }
      }
      // 当点击的是第三个tab
      if (this.active === '3') {
        // 发送网络请求，获取三级分类商品的静态属性
        this.$http.get('categories/' + this.selectedOptions[2] + '/attributes?sel=only').then((res) => {
          // console.log(res.data)
          const {data, meta} = res.data
          if (meta.status === 200) {
            this.staticDyParams = data
          }
        })
      }
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
