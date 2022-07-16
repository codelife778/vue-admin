<template>
  <div>
    <el-card>
      <div slot="header">
        <el-button type="primary">新增</el-button>
      </div>
      <div>
        <el-table :data="list" style="width: 100%" border>

          <el-table-column type="index" prop="#" align="center" label="序号" />

          <el-table-column align="center" prop="prop" label="商品图片" width="200">
            <template slot-scope="scope">
              <img :src="scope.row.pic" alt="" style="width:100px;height:100px">
            </template>
          </el-table-column>

          <el-table-column align="center" prop="prop" label="活动时间" width="300">
            <template slot-scope="scope">
              <p>开始时间: {{ scope.row.promotionStartTime }}</p>
              <p>结束时间: {{ scope.row.promotionEndTime }}</p>
            </template>
          </el-table-column>

          <el-table-column align="center" prop="productSn" label="是否过期" width="100">
            <template slot-scope="scope">
              1
            </template>
          </el-table-column>

          <el-table-column align="center" prop="name" label="商品名称 " width="200" />
          <el-table-column align="center" prop="brandName" label="品牌名称" width="200" />
          <el-table-column align="center" prop="price" label="商品价格" width="200" />
          <el-table-column align="center" prop="productCategoryName" label="商品类别" width="200" />
          <el-table-column align="center" prop="createTime" label="创建时间" width="200" />
          <el-table-column header-align="center" align="center" prop="prop" label="操作">
            <template slot-scope="scope">
              <el-button type="text">删除</el-button>
            </template>
          </el-table-column>

        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import marketListApi from '@/api/marketing/marketingListApi/index'
export default {
    name: '',
    data() {
        return {
            list: []
        }
    },
    created() {
        this.getList()
    },
    methods: {
        getList() {
            marketListApi
                .findAllRecommends()
                .then((res) => {
                    console.log('res: ', res)
                    if (res.success) {
                        this.list = res.data.items
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
