<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col
          ><el-button type="primary" @click="showAddCatDialog"
            >添加分类</el-button
          ></el-col
        ></el-row
      >
      <tree-table
        class="treeTable"
        :data="catlist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <template slot="isok" slot-scope="{ row }">
          <i
            class="el-icon-success"
            v-if="row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else></i>
        </template>
        <template slot="order" slot-scope="{ row }">
          <el-tag size="mini" v-if="row.cat_level === 0">一级</el-tag>
          <el-tag size="mini" v-else-if="row.cat_level === 1" type="success"
            >二级</el-tag
          >
          <el-tag size="mini" v-else type="warning">三级</el-tag>
        </template>
        <template slot="opt">
          <el-button size="mini" type="primary" icon="el-icon-edit"
            >编辑</el-button
          >
          <el-button size="mini" type="danger" icon="el-icon-delete"
            >删除</el-button
          >
        </template>
      </tree-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400"
      >
      </el-pagination>
    </el-card>
    <el-dialog
      title="添加分类"
      :visible.sync="addCatDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <el-form
        :model="addCatForm"
        :rules="addCatFormRules"
        ref="addCatFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCatForm.cat_name"></el-input>
        </el-form-item>
        <!-- options 指定数据源 -->
        <!-- <el-form-item label="父级分类：">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCatList"
            :props="cascaderProps"
            @change="parentCatChanged"
            clearable
          ></el-cascader> -->
        <!-- </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCatDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCat">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      catlist: [],
      total: 0,
      columns: [
        { label: '分类名称', prop: 'cat_name' },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok',
        },
        {
          label: '排序',
          type: 'template',
          template: 'order',
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt',
        },
      ],
      addCatDialogVisible: false,
      addCatForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0,
      },
      addCatFormRules: {
        cat_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
        ],
      },
      parentCatList: [],
      cascaderProps: {
        value: 'cat_pid',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
      },
      selectedKeys: [],
      isResouceShow: 0,
    }
  },
  created() {
    this.getCatList()
  },
  methods: {
    addCateDialogClosed() {
      // this.$refs.addCatFormRef.resetFields()
      // this.selectedKeys = []
      // this.addCatForm.cat_level = 0
      // this.addCatForm.cat_pid = 0
    },
    addCat() {
      // this.$refs.addCatFormRef.validate(async (valid) => {
      //   console.log(valid)
      //   if (!valid) return
      //   const { data: res } = await this.$http.post(
      //     'categories',
      //     this.addCatForm
      //   )
      //   if (res.meta.status !== 201) {
      //     return this.$message.error('添加失败')
      //   }
      //   this.$message.succes('添加成功')
      //   this.getCatList()
      //   this.addCatDialogVisible = false
      // })
    },
    parentCatChanged() {
      console.log(this.selectedKeys)
      if (this.selectedKeys.length > 0) {
        this.addCatForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
        this.addCatForm.cat_level = this.selectedKeys.length
        return
      } else {
        this.addCatForm.cat_pid = 0
        this.addCatForm.cat_level = 0
      }
    },
    async getParentCatList() {
      const { data: res } = await this.$http.get('categories', { type: 0 })
      if (res.meta.status !== 200) {
        return this.$message.error('获取列表失败！')
      }
      this.parentCatList = res.data
      console.log(this.parentCatList)
    },
    showAddCatDialog() {
      this.isResouceShow = this.isResouceShow + 1
      this.getParentCatList()
      this.addCatDialogVisible = true
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCatList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCatList()
    },
    async getCatList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('失败')
      }
      this.catlist = res.data.result
    },
  },
}
</script>
<style lang="scss" scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>