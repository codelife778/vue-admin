<template>
  <div>
    <el-card>
      <div slot="header">
        <el-button type="primary" @click="toAdd">新增</el-button>
      </div>
      <div>
        <el-table :data="roleList" style="width: 100%" border>
          <el-table-column align="center" type="index" label="序号" />
          <el-table-column align="center" prop="roleName" label="角色编码" width="200" />
          <el-table-column align="center" label="角色编码" prop="roleCode" width="200" />
          <el-table-column align="center" label="备注" prop="remark" />
          <el-table-column align="center" label="添加时间" prop="createTime" width="200" />
          <el-table-column align="center" label="操作" prop="nickName" width="300">
            <template slot-scope="scope">
              <el-button type="success" size="mini" @click="goEdit(scope.row.id)">编辑</el-button>
              <el-button type="error" size="mini" @click="goDel(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        style="margin-top: 30px; text-align: right" :current-page="page.currentPage"
        :page-sizes="page.pageSizes" :page-size="page.size" layout="total, sizes, prev, pager, next, jumper"
        :total="page.total" @size-change="sizeChange" @current-change="currentChange" />
    </el-card>
    <popup ref="popup" :menu-list="menuList" />
  </div>
</template>

<script>
import roleApi from '@/api/authority/role/index'
import mix from '@/mixins/index'
import popup from './popup/index.vue'
export default {
    name: '',
    components: {
        popup
    },
    mixins: [mix],
    data() {
        return {
            roleList: [],
            menuList: []
        }
    },
    created() {
        this.getRoleList()
        this.getfindAllPermissions()
    },
    methods: {
        getfindAllPermissions() {
            roleApi.findAllPermissions().then(res => {
                console.log('res: ', res)
                if (res.success) {
                    this.menuList = res.data.menus
                } else {
                    this.$message.error('请求失败')
                }
            }).catch(res => {

            })
        },
        toAdd() {
            this.$refs.popup.openPopup()
        },
        goEdit(id) {
            this.$refs.popup.openPopup(id)
        },
        sizeChange() {},
        currentChange() {},
        goDel(id) {
            this.$confirm('确认删除角色11?').then((res) => {
                roleApi.removeRole(id).then((res) => {
                    if (res.success) {
                        this.$message.success('删除成功!')
                        this.getRoleList()
                    } else {
                        this.$message.error('删除失败')
                    }
                })
            })
        },
        getRoleList() {
            roleApi.findUsersByfindAllRolesPage(this.page.currentPage, this.page.limit).then((res) => {
                if (res.success) {
                    this.roleList = res.data.items
                    this.page.total = res.data.total
                } else {
                    this.$message.error(res.message)
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
