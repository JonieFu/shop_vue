<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col :span="2"
          ><el-button type="primary">添加角色</el-button></el-col
        >
      </el-row>
      <el-table :data="rolelist" border stripe>
        <el-table-column type="expand">
          <template slot-scope="{ row }">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in row.children"
              :key="item1.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(row, item1.id)">{{
                  item1.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(row, item2.id)"
                      >{{ item2.authName }} </el-tag
                    ><i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      closable
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      @close="removeRightById(row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column
          align="center"
          label="#"
          type="index"
        ></el-table-column>
        <el-table-column
          align="center"
          label="角色名称"
          prop="roleName"
        ></el-table-column>
        <el-table-column
          align="center"
          label="角色描述"
          prop="roleDesc"
        ></el-table-column>
        <el-table-column align="center" label="操作" width="300px">
          <template slot-scope="{ row }">
            <el-button size="mini" type="primary" icon="el-icon-edit"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeRole(row.id)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-s-tools"
              @click="showRightDialog(row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        title="分配权限"
        :visible.sync="setRightDialogVisible"
        width="50%"
        @close="setRightDialogClosed"
      >
        <el-tree
          :data="rightlist"
          :props="treeProps"
          :default-expanded-keys="defKeys"
          :default-checked-keys="defKeys"
          show-checkbox
          node-key="id"
          ref="treeRef"
        >
        </el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allogtRights">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rolelist: [],
      setRightDialogVisible: false,
      rightlist: [],
      treeProps: {
        children: 'children',
        label: 'authName',
      },
      defKeys: [],
      roleId: '',
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async removeRole(roleId) {
      console.log(roleId)
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消删除')
      } else {
        const { data: res } = await this.$http.delete(`roles/${roleId}`)
        if (res.meta.status !== 200) {
          return this.$message.error('删除权限失败')
        }
        this.$message.success('删除成功')
        this.getRolesList()
      }
    },
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取列表失败！')
      }
      this.rolelist = res.data
      console.log(this.rolelist)
    },
    async removeRightById(role, rightId) {
      console.log(typeof roleId)
      // 弹框提示用户是否删除
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消删除')
      } else {
        const { data: res } = await this.$http.delete(
          `roles/${role.id}/rights/${rightId}`
        )
        if (res.meta.status !== 200) {
          return this.$message.error('删除权限失败')
        }
        role.children = res.data
      }
    },
    async showRightDialog(role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取列表失败！')
      } else {
        this.rightlist = res.data
        this.getLeafKeys(role, this.defKeys)
        this.setRightDialogVisible = true
      }
    },
    // 获取三级节点,如果当前node节点不包含三级
    getLeafKeys(node, arr) {
      if (!node.children) {
        console.log(arr)
        return arr.push(node.id)
      } else {
        node.children.forEach((item) => {
          return this.getLeafKeys(item, arr)
        })
      }
    },
    setRightDialogClosed() {
      this.defKeys = []
    },
    async allogtRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('失败')
      } else {
        this.getRolesList()
        this.setRightDialogVisible = false
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eeeeee;
}
.bdbottom {
  border-bottom: 1px solid #eeeeee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>