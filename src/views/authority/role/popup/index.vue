<template>
  <div>
    <el-dialog title="编辑角色" :visible.sync="dialogVisible" width="30%" @close="handleClose">
      <el-form ref="form" :model="form" label-width="80px" :inline="false" size="normal">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" size="small" />
        </el-form-item>
        <el-form-item label="角色编码" prop="roleCode">
          <el-input v-model="form.roleCode" size="small" />
        </el-form-item>
        <el-form-item label="角色描述" prop="remark">
          <el-input v-model="form.remark" type="textarea" size="small" />
        </el-form-item>
        <el-form-item label="选择菜单">
          <el-row :gutter="20">
            <el-col :span="6" :offset="0">
              <el-checkbox v-model="isExpand" :indeterminate="false" @change="handelExpand">展开/关闭</el-checkbox>
            </el-col>
            <el-col :span="6" :offset="0">
              <el-checkbox v-model="isSelectAll" :indeterminate="false" @change="handleSelectAll">全选/取消权限</el-checkbox>
            </el-col>
          </el-row>
          <!-- 选择菜单 -->
          <el-tree ref="tree" v-loading="treeLoad" node-key="id" show-checkbox :data="menuList" :props="defaultProps" />

        </el-form-item>

      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import roleApi from '@/api/authority/role/index'
export default {
    name: '',
    props: {
        menuList: {
            type: Array,
            require: true,
            default() {
                return []
            }
        }
    },
    data() {
        return {
            treeLoad: false,
            dialogVisible: false,
            form: {},
            isExpand: false,
            isSelectAll: false,
            defaultProps: {
                label: 'title',
                children: 'children'
            }, // 树形控件的配置项
            selectKeys: []

        }
    },
    methods: {

        handleClose() {
            this.dialogVisible = false
            this.$refs.form.resetFields()
            this.$refs.tree.setCheckedKeys([])
        },
        openPopup(id) {
            this.dialogVisible = true
            if (id) {
                roleApi.findRolePermissions(id).then((res) => {
                    if (res.success) {
                        this.treeLoad = true
                        if (res.data.role.permissionIds) {
                            this.$refs.tree.setCheckedKeys(res.data.role.permissionIds)
                            // 避免form的无效数据
                            delete res.data.role.permissionIds
                        }
                        this.form = res.data.role
                    } else {
                        this.$message.error('查询失败!')
                    }
                    this.treeLoad = false
                })
            }
        },
        handelExpand(v) {
            this.setAllExpand(v)
        },
        setAllExpand(state) {
            var nodes = this.$refs.tree.store.nodesMap

            for (var i in nodes) {
                nodes[i].expanded = state
            }
        },
        handleSelectAll(v) {
            if (v) {
                this.seltAllSelect(this.menuList)
                this.$refs.tree.setCheckedKeys(this.selectKeys)
            } else {
                this.$refs.tree.setCheckedKeys([])
            }
        },
        // 递归处理
        seltAllSelect(menuList) {
            for (var i = 0; i < menuList.length; i++) {
                var item = menuList[i]
                this.selectKeys.push(item.id)
                if (item.children && item.children.length > 0) {
                    this.seltAllSelect(item.children)
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
