<template>
  <div>
    <el-card>
      <div slot="header">
        <el-button type="primary" @click="toAddaddress">新增</el-button>
      </div>
      <div>
        <el-table v-loading="loading" :data="addressList" border>
          <el-table-column type="index" label="#" />
          <el-table-column label="地址名称" prop="addressName" width="200" />
          <el-table-column label="默认发货地址" width="200" align="center">
            <template slot-scope="scope">
              默认发货地址:
              <el-switch
                v-model="scope.row.sendStatus" :active-value="1" :inactive-value="0"
                @change="switchStatus('sendStatus', scope.row)" />
            </template>
          </el-table-column>
          <el-table-column align="center" prop="name" label="收货人姓名" width="200" />
          <el-table-column align="center" prop="phone" label="收货人电话" width="200" />
          <el-table-column align="center" prop="prop" label="收货人地址" width="260">
            <template slot-scope="scope">
              {{ scope.row.city }}
              {{ scope.row.province }}
              {{ scope.row.region }}
              {{ scope.row.detailAddress }}
            </template>
          </el-table-column>

          <el-table-column align="center" prop="prop" label="默认收货地址">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.receiveStatus" :active-value="1" :inactive-value="0"
                @change="switchStatus('receiveStatus', scope.row)" />
            </template>
          </el-table-column>

          <el-table-column align="center" prop="createTime" label="创建时间" />
          <el-table-column align="center" label="操作" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click="goEdit(scope.row)">编辑</el-button>
              <el-button type="text" style="color: red" @click="goDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <popupShow ref="popup" @success="addSuccess" />
  </div>
</template>

<script>
import addressApi from '@/api/orderManage/adressManage/index'
import popupShow from '@/views/orderManage/addressManage/popup/index.vue'
export default {
    name: '',
    components: { popupShow },
    data() {
        return {
            loading: false,
            addressList: []
        }
    },
    created() {
        this.getAddressList()
    },
    methods: {
        addSuccess() {
            this.getAddressList()
        },
        toAddaddress() {
            this.$refs.popup.openPopup()
        },
        goEdit(row) {
            console.log('row: ', row)

            this.$refs.popup.openPopup(row.id)
        },
        goDelete(row) {
            addressApi.delCompanyAddress(row.id).then(res => {
                console.log('res: ', res)
                if (res.success) {
                    this.$message('删除成功')
                } else {
                    this.$$message('删除地址失败')
                }
            }).catch(res => {

            })
        },
        // 修改状态
        switchStatus(statusName, row) {
            var switchApi =
        statusName === 'receiveStatus' ? 'setReceiveOne' : 'setSendOne'
            // 暂存原来的状态
            var tempStatus = row[statusName] === 0 ? 1 : 0
            var params = {}
            params[statusName] = row[statusName]
            params.id = row.id
            addressApi[switchApi](params).then((res) => {
                if (res.success) {
                    this.$message.success('修改状态成功')
                    this.getAddressList()
                } else {
                    // 重置switch 变回原来的状态
                    row[statusName] = tempStatus
                    this.$message.error('修改状态失败')
                }
            })
        },
        getAddressList() {
            addressApi
                .addressList()
                .then((res) => {
                    console.log('res: ', res)
                    if (res.success) {
                        this.addressList = res.data.items
                    } else {
                        this.$message('获取信息错误')
                    }
                })
                .catch((res) => {})
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
