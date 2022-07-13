<template>
  <div class="product-main">
    <BfCollapse title="商品管理介绍">
      <div>商品管理模块可以对客户端的商品进行增删改查等相关操作,来控制客户端商品的列表展示和商品详情</div>
    </BfCollapse>

    <BfCollapse style="margin:30px" title="条件查询">
      <el-form :model="search" label-width="80px" :inline="false" class="search" size="normal">
        <el-row :gutter="10">
          <el-col class="searchItem" :span="6" :offset="0">
            <el-form-item label="商品名称" size="mini">
              <el-input v-model="search.name" class="search-input" size="mini" placeholder="商品名称/模糊查询" />
            </el-form-item>
          </el-col>
          <el-col class="searchItem" :span="6" :offset="0">
            <el-form-item label="商品货号" size="mini">
              <el-input v-model="search.productSn" class="search-input" size="mini" placeholder="商品货号" />
            </el-form-item>
          </el-col>
          <el-col class="searchItem" :span="6" :offset="0">
            <el-form-item label="品牌" size="mini">
              <el-select v-model="search.brandId" class="search-input" size="mini" clearable placeholder="品牌">
                <el-option v-for="item in brandList" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col class="searchItem" :span="6" :offset="0">
            <el-form-item label="上架状态" size="mini">
              <el-select v-model="search.publishStatus" class="search-input" size="mini" clearable placeholder="上架状态">
                <el-option label="上架" value="1" />
                <el-option label="未上架" value="0" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col class="searchItem" :span="6" :offset="0">
            <el-form-item label="审核状态" size="mini">
              <el-select v-model="search.verifyStatus" class="search-input" size="mini" clearable placeholder="审核状态">
                <el-option label="审核" value="1" />
                <el-option label="未审核" value="0" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col style="float:right" :span="4" :offset="0">
            <el-button type="default" size="mini" @click="doReset">重置
            </el-button>
            <el-button type="primary" size="mini" @click="doSearch">搜索</el-button>
          </el-col>
        </el-row>
      </el-form>
    </BfCollapse>

    <el-card class="card" shadow="never">
      <div slot="header">
        <el-button type="primary" size="mini" @click="addProduct">新增</el-button>
        <!-- <BtnPermission permission="productList.add">
          <el-button
            slot="btn"
            type="primary"
            size="small"
            @click="addProduct"
          >新增</el-button>
        </BtnPermission> -->
        <el-button type="primary" size="mini" :loading="downloadLoading" @click="handleDownload">
          导出商品列表excel文件
        </el-button>
      </div>
      <!-- 商品列表 -->

      <el-table v-loading="loading" :data="productList" border style="width: 100%">
        <el-table-column type="index" label="序号" fixed="left" />

        <!-- 商品列表内容 -->
        <el-table-column label="商品图片" width="150">
          <template slot-scope="scope">
            <!-- <router-link></router-link> -->
            <img :src="scope.row.pic" class="table_img" style="height:100px;width:100px">
          </template>
        </el-table-column>
        <el-table-column align="center" label="商品名称" width="350">
          <template slot-scope="scope">
            <p>{{ scope.row.name }}</p>
            <p>品牌: {{ scope.row.brandName }}</p>
            <p>{{ scope.row.description }}</p>
          </template>
        </el-table-column>

        <el-table-column align="center" label="商品价格" width="150">
          <template slot-scope="scope">
            <p>原价: {{ scope.row.originalPrice }}</p>
            <p>现价: {{ scope.row.price }}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="productCategoryName" label="商品类别" width="150" />
        <!-- doing -->
        <el-table-column align="center" label="标签" :width="180">
          <template slot-scope="scope">
            <p>
              最新:
              <el-switch
                v-model="scope.row.newStatus" size="small" :active-value="1" :inactive-value="0"
                @change="switchCode('newStatus', scope.row)" />
            </p>
            <!-- 预告暂时没用, 之后会开放 -->
            <!-- <p>
              预告:
              <el-switch
                v-model="scope.row.previewStatus"
                size="small"
                :active-value="1"
                :inactive-value="0"
                @change="switchCode('previewStatus', scope.row)"
              />
            </p> -->
            <p>
              推荐:
              <el-switch
                v-model="scope.row.recommendStatus" size="small" :active-value="1" :inactive-value="0"
                @change="switchCode('recommendStatus', scope.row)" />
            </p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="标签2" :width="180">
          <template slot-scope="scope">
            <p>
              发布:
              <el-switch
                v-model="scope.row.publishStatus" size="small" :active-value="1" :inactive-value="0"
                @change="switchCode('publishStatus', scope.row)" />
            </p>
            <p>
              审核:
              <el-switch
                v-model="scope.row.verifyStatus" size="small" :active-value="1" :inactive-value="0"
                @change="switchCode('verifyStatus', scope.row)" />
            </p>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="keywords" label="sku" width="150">
          <template slot-scope="scope">
            <el-button type="text" size="default" @click="skuDetail(scope.row)">编辑sku</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="weight" label="重量" width="80" />
        <el-table-column align="center" prop="sort" label="排序" width="150" />

        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="goEdit(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="goDelete(scope.row)"><span
              style="color: red">删除</span></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        :current-page="page.currentPage" :page-sizes="page.pageSizes" :page-size="page.size"
        layout="total, sizes, prev, pager, next, jumper" :total="page.total" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </el-card>
    <skuDetailCom ref="skuDetail" @success="detailSuccess" />
  </div>
</template>

<script>
import {
    findAllBrand,
    productsByPage,
    del
} from '@/api/goodsManage/goodsList/index'
import swtichStatus from '@/api/goodsManage/goodsList/switch/index'
// import productApi from '@/api/product/index'
// import brandApi from '@/api/brand/index'
import mixin from '@/mixins/index'
import skuDetailCom from '@/views/goodsManage/component/skuDetail.vue'
export default {
    name: 'ProductList',
    components: { skuDetailCom },
    mixins: [mixin],
    data() {
        return {
            downloadLoading: false,
            search: {
                productSn: '',
                publishStatus: '',
                verifyStatus: '',
                name: ''
            },
            searchForm: {},
            loading: false, // 加载
            productList: [], // 商品列表
            brandList: []
        }
    },
    created() {
        this.getProductList()
        this.getBrandList()
    },
    methods: {
    // 切换状态
        switchCode(key, item) {
            var id = item.id
            // 暂存状态，修改失败的时候反选回去
            var tempStatus = item[key] === 0 ? 1 : 0
            let str = ''
            // doing

            // 根据key 选择接口
            switch (key) {
                case 'newStatus':
                    str = 'switchNewStatus'
                    break
                case 'previewStatus':
                    str = 'switchPreviewStatus'
                    break
                case 'publishStatus':
                    str = 'switchPublishStatus'
                    break
                case 'recommendStatus':
                    str = 'switchRecommendStatus'
                    break
                case 'verifyStatus':
                    str = 'switchVerifyStatus'
                    break
                default:
                    break
            }

            swtichStatus[str]({
                productId: id,
                status: item[key]
            })
                .then((res) => {
                    if (res.success) {
                        this.$message.success('修改状态成功')
                    } else {
                        item[key] = tempStatus
                        this.$message.error('修改状态失败')
                    }
                })
                .catch((rej) => {
                    item[key] = tempStatus
                    this.$message.error('修改状态失败')
                })
        },

        // 获取品牌列表
        getBrandList() {
            findAllBrand()
                .then((res) => {
                    this.brandList = res.data.items
                })
                .catch((rej) => {})
        },
        //   分页size改变
        handleSizeChange(val) {
            this.page.size = val
            this.page.currentPage = 1
            this.getProductList()
        },
        handleCurrentChange(val) {
            this.page.currentPage = val
            this.getProductList()
        },
        // 重置搜索栏
        doReset() {
            this.search = {
                gname: '',
                pcode: '',
                brandId: '',
                price: ''
            }
            this.searchForm = {}
        },
        // 搜索按钮
        doSearch() {
            this.page.currentPage = 1
            this.searchForm = Object.assign({}, this.search)

            this.getProductList()
        },
        // 新增商品
        addProduct() {
            this.$router.push({ name: 'addDetail' })
        },
        // 获取商品列表
        getProductList() {
            const sendSearch = {}
            for (const key in this.searchForm) {
                // 如果搜索框有的内容
                if (this.searchForm[key] || this.searchForm[key] + '' === '0') {
                    sendSearch[key] = this.searchForm[key]
                }
            }
            this.loading = true
            //   get数组传参， 第一个是页数，第二个是每页显示几个
            productsByPage(this.page.currentPage, this.page.size, {
                ...sendSearch
            })
                .then((res) => {
                    console.log('res: ', res)
                    this.productList = res.data.rows
                    this.page.total = res.data.total
                    this.loading = false
                })
                .catch((rej) => {
                    this.loading = false
                })
        },
        // 编辑
        goEdit(row) {
            // 路由跳转
            this.$router.push({ name: 'editorDetail', params: { id: row.id }})
        },
        // 删除
        goDelete(row) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    del(row.id)
                        .then((res) => {
                            if (res.success) {
                                this.getProductList()
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
                .catch((rej) => {})
        },
        // 编辑skuDetail
        skuDetail(row) {
            this.$refs.skuDetail.openDetail(row.id)
        },
        // 编辑成功后的回调函数
        detailSuccess() {
            this.getProductList()
        },

        handleDownload() {
            //      <p>{{ scope.row.name }}</p>
            //     <p>品牌: {{ scope.row.brandName }}</p>
            //     <p>{{ scope.row.description }}</p>
            //   </template>
            // </el-table-column>

            // <el-table-column align="center" label="商品价格" width="150">
            //   <template slot-scope="scope">
            //     <p>原价: {{ scope.row.originalPrice | money }}</p>
            //     <p>现价: {{ scope.row.price | money }}</p>

            this.downloadLoading = true
      import('@/vendor/Export2Excel').then((excel) => {
          const tHeader = ['商品名称', '商品品牌', '商品价格']
          const filterVal = ['name', 'brandName', 'price']
          const list = this.productList
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: '你可拉倒吧',
              autoWidth: this.autoWidth,
              bookType: this.bookType
          })
          this.downloadLoading = false
      })
        },
        formatJson(filterVal, jsonData) {
            return jsonData.map((v) =>
                filterVal.map((j) => {
                    return v[j]
                })
            )
        }
        // 处理上传excel
        // handleDownLoad() {
        //     import('@/vendor/Export2Excel').then(excel => {
        //         const tHeader = ['name', 'age']
        //         const data = [{ name: 'ss', age: 22 }, { name: 'hh', age: 33 }]

        //         excel.export_json_to_excel({
        //             header: tHeader, // 表头 必填
        //             data // 具体数据 必填

    //         })
    //     })
    // }
    }
}
</script>

<style  scoped lang="scss">
// .product-main {
//   .search {
//     ::v-deep .el-form-item {
//       label {
//         font-weight: normal;
//       }
//     }
//   }
//   .card {
//     margin: 30px;
//   }
//   .search-main {
//     .search-input {
//       width: 90%;
//     }
//   }
//   .table_img {
//     width: 100px;
//     height: 100px;
//   }
// }
</style>
