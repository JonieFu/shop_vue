<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card
      ><div id="echartContainer" style="width: 500px; height: 500px"></div
    ></el-card>
  </div>
</template>
<script>
var echarts = require('echarts')
export default {
  data() {
    return {
      orgOptions: {},
    }
  },
  created() {},
  async mounted() {
    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) {
      return this.$message.error('获取失败')
    }
    var myChart = echarts.init(document.getElementById('echartContainer'))
    myChart.setOption(res.data)
  },

  methods: {},
}
</script>
<style lang="scss" scoped>
</style>