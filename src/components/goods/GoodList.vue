<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card
      ><el-row type="flex" justify="start">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4"
          ><el-button type="primary" @click="goAddpage"
            >添加商品</el-button
          ></el-col
        >
      </el-row>
      <el-table :data="goodlist" border stripe>
        <el-table-column
          align="center"
          type="index"
          label="#"
        ></el-table-column>
        <el-table-column
          align="center"
          label="商品名称"
          prop="goods_name"
        ></el-table-column>
        <el-table-column
          align="center"
          label="商品价格"
          prop="goods_price"
        ></el-table-column>
        <el-table-column
          align="center"
          label="商品重量"
          prop="goods_weight"
        ></el-table-column>
        <el-table-column align="center" label="创建时间" prop="add_time">
          <template slot-scope="{ row }">
            {{ row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      goodlist: [],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
    }
  },
  created() {
    this.getGoodList()
  },
  methods: {
    async getGoodList() {
      console.log(this.queryInfo.query)
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取列表失败！')
      }
      this.goodlist = res.data.goods
      console.log(this.goodlist)
    },
    goAddpage() {
      this.$router.push('/goods/add')
    },
  },
}
</script>
<style lang="scss" scoped>
</style>