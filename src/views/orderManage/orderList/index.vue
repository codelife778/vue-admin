<template>
  <div>
    <el-card>
      <div slot="header">
        条件查询
      </div>
      <el-form ref="searchForm" :model="searchForm" label-width="80px">
        <el-row :gutter="10">

          <el-col :span="6">
            <el-form-item label="订单编号">
              <el-input v-model="searchForm.orderSn" placeholder="请填写订单编号" clearable />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="订单类型">
              <el-select v-model="searchForm.orderType" placeholder="订单类型" clearable>
                <el-option v-for="item in orderTypeList" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="支付方式">
              <el-select v-model="searchForm.payType" placeholder="支付方式" clearable>
                <el-option v-for="item in payTypeList" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="订单状态">
              <el-select v-model="searchForm.status" placeholder="订单状态" clearable>
                <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>
      <div>
        <el-button type="primary" @click="reset">重置</el-button>
        <el-button type="primary" @click="toSearch">搜索</el-button>
      </div>
    </el-card>

    <el-card>
      <div slot="header">
        <el-table :data="orderList" style="width: 100%" border>
          <el-table-column type="index" label="#" width="width" />
          <el-table-column align="center" prop="orderSn" label="订单编号" width="200">
            <template slot-scope="scope">
              {{ scope.row.orderSn }}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="payType" label="支付方式" width="200">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.payType==0" type="info">
                未支付
              </el-tag>

              <el-tag v-else-if="scope.row.payType===1" effect="dark" style="font-size:25px">
                <svg-icon icon-class="aliPay" class="aliPay" />
              </el-tag>

              <el-tag v-else type="success" effect="dark" style="font-size:25px">
                <svg-icon icon-class="weixin" class="weixin" />
              </el-tag>

            </template>
          </el-table-column>

          <el-table-column label="订单状态" width="200">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status === 0" type="danger" effect="dark">待付款</el-tag>
              <el-tag v-else-if="scope.row.status === 1" type="warning" effect="dark">待发货</el-tag>
              <el-tag v-else-if="scope.row.status === 2">已发货</el-tag>
              <el-tag v-else-if="scope.row.status === 3">已完成</el-tag>
              <el-tag v-else-if="scope.row.status === 4" type="info" effect="dark">退货</el-tag>
              <el-tag v-else type="info">无效订单</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="添加时间" prop="createTime" width="200" />
          <el-table-column align="center" label="用户账户" prop="memberUsername" width="200" />
          <el-table-column align="center" label="订单类型">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.orderType === 1" type="warning">秒杀订单</el-tag>
              <el-tag v-else type="success">正常订单</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="备注" width="300" />
          <el-table-column align="center" label="操作" fixed="right" width="200">
            <template slot-scope="scope">
              <el-button type="primary" @click="goEdit(scope.row)">
                <i class="el-icon-view">查看订单</i>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div>1</div>
    </el-card>
    <el-pagination
      :current-page="page.currentPage" :page-sizes="page.pageSizes" :page-size="page.size"
      layout="total, sizes, prev, pager, next, jumper" :total="page.total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
  </div>
</template>

<script>
import mix from '@/mixins/index'
import orderListApi from '@/api/orderManage/orderList/index'
export default {
    name: '',
    mixins: [mix],
    data() {
        return {
            orderTypeList: [
                { name: '正常订单', id: 0 },
                { name: '秒杀订单', id: 1 }
            ], // 秒杀类型列表
            payTypeList: [
                { name: '未支付', id: 0 },
                { name: '支付宝', id: 1 },
                { name: '微信', id: 2 }
            ], // 秒杀类型列表
            statusList: [
                { name: '待付款', id: 0 },
                { name: '待发货', id: 1 },
                { name: '已发货', id: 2 },
                { name: '已完成', id: 3 },
                { name: '退货', id: 4 },
                { name: '无效订单', id: 5 }
            ], // 秒杀类型列表
            searchForm: {
                orderSn: '', // 订单编号
                orderType: '', // 订单类型
                payType: '', // 支付类型
                status: '' // 订单状态
            },
            search: {
                orderSn: '', // 订单编号
                orderType: '', // 订单类型
                payType: '', // 支付类型
                status: '' // 订单状态
            },
            orderList: [] // 订单列表
        }
    },
    created() {
        this.getorderList()
    },
    methods: {
        goEdit(row) {
            this.$router.push({ name: 'OrderDetail', params: { id: row.id }})
        },
        reset() {
            this.searchForm = this.$options.data().searchForm
            this.search = this.$options.data().search
        },
        toSearch() {
            this.page.currentPage = 1
            this.search = Object.assign({}, this.searchForm)
            this.getorderList()
        },
        handleSizeChange(val) {
            this.page.size = val
            this.page.currentPage = 1
            this.getorderList()
        },
        handleCurrentChange(val) {
            this.page.currentPage = val
            this.getorderList()
        },
        getorderList() {
            // 发送的搜索框信息,如果没有信息, 则不传

            const sendSearch = {}
            // 即使没有内容,也会遍历
            for (const key in this.search) {
                // 如果搜索框有的内容
                if (this.search[key] || this.search[key] + '' === '0') {
                    sendSearch[key] = this.search[key]
                }
            }
            orderListApi
                .findOrdersByPage(this.page.currentPage, this.page.size, {
                    ...sendSearch
                })
                .then((res) => {
                    console.log('res: ', res)
                    if (res.success) {
                        this.orderList = res.data.rows
                        this.page.total = res.data.total
                    } else {
                        this.$message('获取信息失败')
                    }
                })
                .catch((res) => {})
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
