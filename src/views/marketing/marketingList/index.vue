<template>
  <div>
    <el-card>
      <div slot="header">
        <el-button type="primary" @click="toAddMarketing">新增</el-button>
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
          <el-table-column align="center" prop="prop" label="操作" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click="toDelete(scope.row)"><span style="color:red">删除</span></el-button>
            </template>
          </el-table-column>

        </el-table>
      </div>
    </el-card>
    <addMarketing ref="popUp" @success="popUpSuccess" />
  </div>
</template>

<script>
import marketListApi from '@/api/marketing/marketingListApi/index'
import addMarketing from '@/views/marketing/marketingList/addMarketingPopup/index.vue'
export default {
    name: '',
    components: {
        addMarketing
    },
    data() {
        return {
            list: []
        }
    },
    created() {
        this.getList()
    },
    methods: {
        popUpSuccess() {
            this.getList()
        },
        toAddMarketing() {
            this.$refs.popUp.openPopup()
        },
        toDelete(row) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                marketListApi.delRecommend(row.recommendId).then(res => {
                    if (res.success) {
                        this.getList()
                        this.$message({
                            type: 'success',
                            message: '删除成功!'

                        })
                    } else {
                        this.$message.error(res.message)
                    }
                }).catch(res => {

                })
            }).catch(res => {

            })
        },
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
                .catch((res) => {

                })
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
