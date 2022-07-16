<template>
  <div>
    <el-card>
      <div slot="header">
        <span>条件查询</span>
      </div>
      <div>
        <el-form ref="form" :model="searchForm" label-width="80px">
          <el-row :gutter="10">

            <el-col :span="6">
              <el-form-item label="订单编号">
                <el-input v-model="searchForm.orderSn" />
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="退单状态">
                <el-select v-model="searchForm.status" placeholder="退单状态">
                  <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-button type="primary" @click="toSeset">重置</el-button>
              <el-button type="primary" @click="toSearch">搜索</el-button>
            </el-col>

          </el-row>
        </el-form>
      </div>
    </el-card>

    <el-card>
      <el-table :data="orderList" style="width: 100%" border>
        <el-table-column type="index" label="#" width="100" />

        <el-table-column align="center" prop="prop" label="订单编号" width="100">
          <template slot-scope="scope">
            {{ scope.row.orderSn }}
          </template>
        </el-table-column>

        <el-table-column header-align="center" align="center" prop="prop" label="退单状态" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status==0" type="danger">
              {{ statusList[scope.row.status].name }}
            </el-tag>
            <el-tag v-if="scope.row.status==1" type="warning  ">
              {{ statusList[scope.row.status].name }}
            </el-tag>
            <el-tag v-if="scope.row.status==2">
              {{ statusList[scope.row.status].name }}
            </el-tag>
            <el-tag v-if="scope.row.status==3" type="info">
              {{ statusList[scope.row.status].name }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="描述" prop="description" width="200" />
        <el-table-column align="center" label="退单原因" prop="reason" width="200" />
        <el-table-column align="center" label="商品名称" width="150" prop="productName" />
        <el-table-column align="center" prop="productAttr" label="商品属性" width="300">
          <template slot-scope="scope">
            {{ scope.row.productAttr }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="handleNote" label="商家备注" width="200" />
        <el-table-column align="center" prop="createTime" label="添加时间" width="200" />
        <el-table-column align="center" prop="prop" label="操作" fixed="right" width="200">
          <template slot-scope="scope">
            <el-button type="primary" @click="toCheckOrder(scope.row)">查看订单</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-pagination
      :current-page="page.currentPage" :page-sizes="page.pageSizes" :page-size="page.size"
      layout="total, sizes, prev, pager, next, jumper" :total="page.total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
  </div>
</template>

<script>
import RefundOrderApi from '@/api/orderManage/refundeList/index'
import mix from '@/mixins/index'
export default {
    name: '',
    mixins: [mix],
    data() {
        return {
            searchForm: {
                orderSn: '',
                status: ''
            },
            search: {
                orderSn: '', // 订单编号
                status: '' // 订单状态
            },
            orderList: [], // 订单列表
            statusList: [
                { name: '待处理', id: 0 },
                { name: '退货中', id: 1 },
                { name: '已完成', id: 2 },
                { name: '已拒绝', id: 3 }
            ] // 秒杀类型列表
        }
    },
    created() {
        this.getOrderList()
    },
    methods: {
        toCheckOrder(row) {
            this.$router.push({ name: 'RefundDetail', params: { id: row.id }})
        },
        toSeset() {
            this.searchForm = this.$options.data().searchForm
            this.search = this.$options.data().search
        },
        toSearch() {
            this.page.currentPage = 1
            this.search = Object.assign({}, this.searchForm)
            this.getOrderList()
        },
        getOrderList() {
            const sendSeach = {}
            for (const key in this.search) {
                if (this.search[key] || this.search[key] + '' == '0') {
                    sendSeach[key] = this.search[key]
                }
            }

            RefundOrderApi.findReturnApply(this.page.currentPage, this.page.size, {
                ...sendSeach
            }).then((res) => {
                if (res.success) {
                    this.orderList = res.data.rows
                    this.page.total = res.data.total
                }
            })
        },
        // 分页规格改变
        handleSizeChange(val) {
            this.page.size = val
            this.page.currentPage = 1
            this.getOrderList()
        },
        // 分页点击
        handleCurrentChange(val) {
            this.page.currentPage = val
            this.getOrderList()
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
