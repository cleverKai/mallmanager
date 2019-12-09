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
                expandTrigger = "hover"
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
            <!--            添加商品的静态信息-->
            <el-form-item v-for="(item3,index) in staticDyParams" :key="index" :label="item3.attr_name">
              <el-input v-model="item3.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="4" label="商品图片">
<!--              上传商品图片-->
            <el-form-item>
              <el-upload
                action="http://api.xiaomadagege.cn:8800/api/private/v1/upload"
                :headers="headers"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                list-type="picture">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="5" label="商品内容">
            <el-form-item>
<!--              商品内容-->
<!--              1.富文本-->
              <quillEditor style="height: 200px" v-model="form.goods_introduce"></quillEditor>
<!--              2.点击添加按钮-->
              <el-button class="el-btn" type="primary" @click="addGoods">添加商品</el-button>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
</template>

<script>
import {addQuillTitle} from '../../../util/quill-title'
import MyBread from '../../cuscom/myBread'
// 富文本插件样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 富文本组件
import { quillEditor } from 'vue-quill-editor'
export default {
  name: 'GoodsAdd',
  data () {
    return {
      active: '1',
      // 添加商品的表单数据
      form: {
        goods_name: '',
        // 以','号分割的分类列表 不能为空
        goods_cat: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        // 上传图片的临时路径
        // pics为数组, [{pics: 图片临时路径}]
        pics: [],
        // 商品的参数, 动态参数+静态参数
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
      staticDyParams: [],
      // 图片上传设置请求头
      headers: {
        Authorization: localStorage.getItem('token')
      }
    }
  },
  components: {
    MyBread,
    quillEditor
  },
  mounted () {
    this.getGoodsCate()
    addQuillTitle()
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
        if (this.selectedOptions.length !== 3) {
          this.$message.warning('请选择商品的三级分类')
        } else {
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
    },
    // 图片上传的相关方法
    // file指当前操作图片的相关信息(图片名/图片路径)
    handlePreview (file) {

    },
    // 图片移除时触发
    handleRemove (file) {
      // 图片上传到的临时路径 file.response.data.tmp_path
      // console.log('移除')
      // console.log(file)
      // 获取移除的图片对象在数组的下标
      let Index = this.form.pics.findIndex((item) => {
        return item.pic === file.response.data.tmp_path
      })
      this.form.pics.splice(Index, 1)
    },
    // 图片上传成功时触发
    handleSuccess (file) {
      // file.data.tmp_path 图片上传到的临时路径
      // console.log('上传成功')
      // console.log(file)
      // 将图片的临时路径放到pics数组中
      this.form.pics.push({
        pic: file.data.tmp_path
      })
    },
    // 点击添加商品按钮
    addGoods () {
      // 发送请求之前,处理this.form里面未处理的数据
      // goods_cat
      this.form.goods_cat = this.selectedOptions.join(',')
      // pics [{pic:路径}]
      // 动态参数
      // attr [{attr_id:?,attr_value:?}]
      let arr1 = this.arrDyParams.map((item) => {
        return {attr_id: item.attr_id, attr_value: item.attr_vals}
      })
      // 静态参数
      // attr [{attr_id:?,attr_value:?}]
      let arr2 = this.staticDyParams.map((item) => {
        return {attr_id: item.attr_id, attr_value: item.attr_vals}
      })

      // 将动态参数和静态参数数组进行合并
      this.form.attrs = [...arr1, ...arr2]

      this.$http.post('/goods/', this.form).then((res) => {
        console.log(res)
        if (res.data.meta.status === 201) {
          // 提示
          this.$message.success(res.data.meta.msg)
          // 跳转
          this.$router.push({name: 'goods'})
        } else {
          this.$message.warning(res.data.meta.msg)
        }
      })
    }
  }
}
</script>

<style scoped>
.alert{
  margin-top: 30px;
}
  .steps{
    margin-top: 30px;
  }
  .el-btn{
    margin-top: 120px;
    margin-left: 500px;
  }
</style>
