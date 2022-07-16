<template>
  <div>
    <el-card>
      <div slot="header">注册用户列表</div>
      <div>
        <el-table :data="userList" style="width: 100%" border>
          <el-table-column type="index" prop="#" align="center" label="序号" />
          <el-table-column align="center" prop="username" label="用户名" width="200" />
          <el-table-column align="center" prop="prop" label="头像" width="200">
            <template slot-scope="scope">
              <!-- <img :src="scope.row.icon" alt="" style="width:100px;height:100px;border-radius:50%"> -->
              <el-avatar style="width:60px;height:60px" size="small" :src="scope.row.icon" />
            </template>
          </el-table-column>
          <el-table-column align="center" prop="nickname" label="昵称" width="200" />
          <el-table-column align="center" prop="realname" label="真实姓名" width="200" />
          <el-table-column align="center" prop="sex" label="性别" width="200" />
          <el-table-column align="center" prop="phone" label="电话" width="200" />
          <el-table-column align="center" prop="email" label="邮箱" width="200" />
          <el-table-column align="center" prop="birthday" label="生日" width="200" />
          <el-table-column align="center" prop="createTime" label="注册时间" width="200" />

        </el-table>

        <el-pagination
          :current-page="page.currentPage" :page-sizes="page.pageSizes" :page-size="page.size"
          layout="total, sizes, prev, pager, next, jumper" :total="page.total" @size-change="handleSizeChange"
          @current-change="handleCurrentChange" />
      </div>
    </el-card>
  </div>
</template>

<script>
import mix from '@/mixins/index'
import registerUserApi from '@/api/registerUser/index'
export default {
    name: '',
    mixins: [mix],
    data() {
        return {
            userList: []
        }
    },
    created() {
        this.getUserList()
    },
    methods: {
        handleSizeChange(val) {
            this.page.size = val
            this.page.currentPage = 1
            this.getUserList()
        },
        handleCurrentChange(val) {
            this.page.currentPage = val
            this.getUserList()
        },
        getUserList() {
            registerUserApi
                .findMembersByPage(this.page.currentPage, this.page.size)
                .then((res) => {
                    console.log('res: ', res)
                    if (res.success) {
                        this.userList = res.data.rows
                        this.page.total = res.data.total
                    } else {
                        this.$message.warning('请求失败')
                    }
                })
                .catch((res) => {})
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
