<template>
  <div class="brand_main">
    <!-- <el-card class="search-main card" shadow="never">
      <div slot="header">
        <span>条件查询</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="4" :offset="0">
          <el-input
            v-model="search.name"
            class="search-input"
            size="small"
            placeholder="商品名称/模糊查询"
          />
        </el-col>

        <el-col :span="4" :offset="0">
          <el-button
            type="default"
            size="mini"
            @click="doReset"
          >重置
          </el-button>
          <el-button
            type="primary"
            size="mini"
            @click="doSearch"
          >搜索</el-button>
        </el-col>
      </el-row>
    </el-card> -->

    <el-card class="card" shadow="never">
      <div slot="header">
        <el-button type="primary" size="small" @click="goAdd">新增</el-button>
      </div>
      <!-- 品牌列表 -->

      <el-table v-loading="loading" :data="brandList" border style="width: 100%">
        <el-table-column type="index" label="序号" fixed="left" />

        <el-table-column align="center" prop="name" label="品牌名称" width="150" />

        <el-table-column align="center" label="展示状态" :width="180">
          <template slot-scope="scope">
            <p>
              是否展示:
              <el-switch
                v-model="scope.row.showStatus" size="small" :active-value="1" :inactive-value="0"
                @change="switchCode(scope.row)" />
            </p>

          </template>
        </el-table-column>

        <el-table-column align="center" label="logo" width="200">
          <template slot-scope="scope">
            <!-- <router-link></router-link> -->
            <img :src="scope.row.logo" class="table_img">
          </template>
        </el-table-column>
        <el-table-column align="center" label="专区大图" width="200">
          <template slot-scope="scope">
            <!-- <router-link></router-link> -->
            <img :src="scope.row.bigPic" class="table_img">
          </template>
        </el-table-column>
        <el-table-column align="center" prop="brandStory" label="品牌故事" width="150" />
        <el-table-column align="center" prop="createTime" label="创建时间" width="300" />
        <el-table-column align="center" prop="sort" label="排序" width="150" />
        <el-table-column align="center" prop="productCommentCount" label="产品评论数量" width="150" />
        <el-table-column align="center" prop="productCount" label="产品数量" width="150" />
        <el-table-column align="center" label="是否品牌制造商" width="150">
          <template slot-scope="scope">
            <p>{{ scope.row.factoryStatus===1?"是":"不是" }}</p>
          </template>
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="goEdit(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="goDelete(scope.row)"><span style="color: red">删除</span>
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        :current-page="page.currentPage" :page-sizes="page.pageSizes" :page-size="page.size"
        layout="total, sizes, prev, pager, next, jumper" :total="page.total" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </el-card>
    <skuComponent ref="detail" @success="detailSuccess" />
  </div>
</template>

<script>
import skuManageApi from '@/api/goodsManage/skuManage/index'
import skuComponent from '@/views/product/brand/skuComponent/index.vue'
import mix from '@/mixins/index'
// import brandApi from '@/api/brand/index'
// import mixin from '@/mixins/index'
// import detailCom from '@/views/product/brand/components/detail'
export default {
    name: 'ProductBrand',
    components: { skuComponent },
    mixins: [mix],
    data() {
        return {
            search: { gname: '', pcode: '', brandId: '', price: '' }, // 查询列表
            brandList: [],
            loading: false
        }
    },
    created() {
        this.getBrandList()
    },
    methods: {
        getBrandList() {
            this.loading = true
            skuManageApi
                .findBrandByPage(this.page.currentPage, this.page.size)
                .then((res) => {
                    if (res.success) {
                        this.brandList = res.data.rows
                        this.page.total = res.data.total
                        this.loading = false
                    } else {
                        this.loading = false

                        this.$message.error('获取列表失败')
                    }
                })
        },
        doReset() {
            this.search = this.$options.data().search
        },
        // 搜索按钮
        doSearch() {
            console.log('搜索', this.page.currentPage)
            // this.page.currentPage = 1
            // this.getBrandList()
        },

        switchCode(item) {
            // console.log(item.factoryStatus)
            // 暂存改变之前的状态,防止改变状态失败
            var tempStatus = item.showStatus === 0 ? 1 : 0
            skuManageApi
                .switchShowStatus({
                    // + ''转化为字符串
                    id: item.id + '',
                    status: item.showStatus
                })
                .then((res) => {
                    if (res.success) {
                        this.$message.success('修改状态成功')
                    } else {
                        this.$message.error('修改状态失败')
                        item.showStatus = tempStatus
                    }
                })
                .catch((res) => {
                    item.showStatus = tempStatus
                    this.$message.error('修改状态失败')
                })
        },
        //   分页size改变
        handleSizeChange(val) {
            this.page.size = val
            this.page.currentPage = 1
            this.getBrandList()
        },
        // 点击分页事件
        handleCurrentChange(val) {
            this.page.currentPage = val
            this.getBrandList()
        },
        // 删除
        goDelete(row) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    skuManageApi
                        .delBrand(row.id)
                        .then((res) => {
                            if (res.success) {
                                this.getBrandList()
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                })
                            } else {
                                this.$message.error(res.message)
                            }
                        })
                        .catch((res) => {
                            this.$message.error(res.message)
                        })
                })
                .catch((rej) => {
                    console.log('ss', rej)
                })
        },
        // 新增或者编辑品牌成功回调函数
        detailSuccess() {
            this.doReset()
            this.page.currentPage = 1
            this.getBrandList()
        },
        // 新增品牌
        goAdd() {
            // 操作dom元素
            this.$refs.detail.openDetail()
        },
        // 编辑
        goEdit(item) {
            const obj = Object.assign({}, item)
            this.$refs.detail.openDetail(obj)
        }
    }
}
</script>

<style lang="scss" scoped>
.brand_main {
  .card {
    margin: 30px;
  }
  .search-main {
    .search-input {
      width: 200px;
    }
  }
  .table_img {
    width: 100px;
    height: 100px;
  }
}
</style>
