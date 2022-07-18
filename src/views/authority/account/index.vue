<template>
  <div>
    <el-card>
      <div>
        <el-form ref="form" :model="search" label-width="80px" :inline="false" size="mini">
          <el-row :gutter="10">

            <el-col :span="6">
              <el-form-item label="昵称">
                <el-input v-model="search.nickName" placeholder="昵称模糊搜索" size="mini" clearable />
              </el-form-item>
            </el-col>

            <el-col :span="6" :offset="0">
              <el-form-item label="用户名" size="mini" prop="username">
                <el-input v-model="search.username" placeholder="用户名模糊搜索" size="mini" clearable />
              </el-form-item>
            </el-col>

          </el-row>

          <el-row :gutter="20">
            <el-col :span="6" :offset="18">
              <el-button type="default" size="mini" @click="doReset">重置</el-button>
              <el-button type="primary" size="mini" @click="doSearch">查询</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>

    <el-card>
      <div slot="header">
        <el-button type="primary" @click="toAdd">新增</el-button>
      </div>
      <div>
        <el-table :data="userList" style="width: 100%" border stripe>
          <el-table-column type="index" label="#" width="width" />
          <el-table-column align="center" prop="username" label="用户名" width="200" />
          <el-table-column align="center" prop="nick_name" label="昵称" width="200" />
          <el-table-column align="center" prop="prop" label="用户头像" width="200">
            <template slot-scope="scope">
              <img :src="scope.row.salt" alt="" style="width:100px;height:100px">
            </template>
          </el-table-column>
          <el-table-column align="center" label="角色" prop="roles" width="150" />
          <el-table-column label="添加时间" align="center" prop="create_time" width="200" />
          <el-table-column align="center" prop="prop" label="操作">
            <template slot-scope="scope">
              <el-button type="success" size="mini" @click="toEditor(scope.row.id)">编辑</el-button>
              <el-button type="danger" size="mini" @click="toDelete(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>

        </el-table>
      </div>
      <el-pagination
        style="margin-top: 30px; text-align: right" :current-page="page.currentPage"
        :page-sizes="page.pageSizes" :page-size="page.size" layout="total, sizes, prev, pager, next, jumper"
        :total="page.total" @size-change="sizeChange" @current-change="currentChange" />
    </el-card>
    <Popup ref="popup" @refresh="getAccountList" />
  </div>
</template>

<script>
import accountApi from '@/api/authority/account/index'
import mix from '@/mixins/index'
import Popup from './Popup/index.vue'
export default {
    name: '',
    components: {
        Popup
    },
    mixins: [mix],
    data() {
        return {
            search: {
                nickName: '',
                username: ''
            },
            userList: []
        }
    },
    created() {
        this.getAccountList()
    },
    methods: {
        currentChange(val) {
            this.page.currentPage = val
            this.getAccountList()
        },
        sizeChange(val) {
            this.page.size = val
            this.page.currentPage = 1
            this.getAccountList()
        },
        toAdd() {
            this.$refs.popup.openPopup()
        },
        toEditor(id) {
            this.$refs.popup.openPopup(id)
        },
        toDelete(id) {
            this.$confirm('确认删除?')
                .then((res) => {
                    accountApi.removeUser(id).then((res) => {
                        if (res.success) {
                            this.$message.success('删除成功!')
                            this.getAccountList()
                        } else {
                            this.$message.error(res.message)
                        }
                    })
                })
                .catch(() => {
                    this.$message.info('已取消')
                })
        },

        doReset() {},
        doSearch() {},
        getAccountList() {
            accountApi
                .findUsersByPage(1, 10)
                .then((res) => {
                    console.log('res: ', res)
                    if (res.success) {
                        this.userList = res.data.rows
                        this.page.total = res.data.total
                    } else {
                        this.$message.error('获取信息失败')
                    }
                })
                .catch((res) => {})
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
