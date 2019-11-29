<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item>首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{ level1 }}</el-breadcrumb-item>
    <el-breadcrumb-item>{{ level2 }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: 'myBread',
  // props 是字符串数组
  // props中的值与data中的值用法一样
  // props中的值与来源于使用它的父组件
  // props中的值也是组件的属性
  props: ['level1', 'level2']

}
</script>

<style scoped>

</style>
