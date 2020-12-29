<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="rightsList" border>
        <el-table-column
          align="center"
          label="#"
          type="index"
        ></el-table-column>
        <el-table-column
          align="center"
          label="权限名称"
          prop="authName"
        ></el-table-column>
        <el-table-column
          align="center"
          label="路径"
          prop="path"
        ></el-table-column>
        <el-table-column align="center" label="权限等级" prop="level">
          <template slot-scope="{ row }">
            <el-tag v-show="row.level === '0' ? true : false">一级 </el-tag>
            <el-tag v-show="row.level === '1' ? true : false" type="success"
              >二级</el-tag
            >
            <el-tag v-show="row.level === '2' ? true : false" type="warning"
              >三级</el-tag
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rightsList: [],
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    async getRightsList() {
      const { data: res } = await this.$http.get('rights/list')
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取列表失败！')
      }
      this.rightsList = res.data
    },
  },
}
</script>
<style lang="scss" scoped>
</style>