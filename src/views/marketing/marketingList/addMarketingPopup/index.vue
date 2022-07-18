<template>
  <div>
    <el-dialog :visible.sync="dialogVisible" width="80%" title="热销详情">
      <div>
        <el-card>
          <div slot="header">条件查询</div>
          <div>
            <el-row :gutter="10">

              <el-col :span="4">
                <el-input v-model="search.name" size="mini" placeholder="商品名称/模糊查询" clearable />
              </el-col>

              <el-col :span="4">
                <el-input v-model="search.productSn" size="mini" placeholder="商品货号" clearable />
              </el-col>

              <el-col :span="4">
                <el-select v-model="search.brandId" size="mini" placeholder="品牌" clearable>
                  <el-option v-for="item in brandList" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-col>

              <el-col :span="4">
                <el-select v-model="search.publishStatus" size="mini" placeholder="上架状态" clearable>
                  <el-option label="上架" value="1" />
                  <el-option label="未上架" value="0" />
                </el-select>
              </el-col>

              <el-col :span="4">
                <el-select v-model="search.verifyStatus" size="mini" placeholder="审核状态" clearable>
                  <el-option label="审核" value="1" />
                  <el-option label="未审核" value="0" />
                </el-select>
              </el-col>

              <el-col :span="4">
                <el-button size="mini" @click="toReset">重置</el-button>
                <el-button type="primary" size="mini" @click="toSearch">搜索</el-button>

              </el-col>
            </el-row>
          </div>
        </el-card>
        <el-card>
          <div slot="header">商品列表</div>
          <div>
            <el-radio-group v-model="productId" style="width: 100%" @change="radioChange">
              <el-table :data="productList" style="width: 100%" border>
                <el-table-column type="index" label="序号" />
                <el-table-column label="选择" align="center" width="100">
                  <template slot-scope="scope">
                    <el-radio :label="scope.row.id"><span /></el-radio>
                  </template>
                </el-table-column>
                <el-table-column label="商品图片" align="center" width="200">
                  <template slot-scope="scope">
                    <!-- <router-link></router-link> -->
                    <img :src="scope.row.pic" class="table_img" style="width:100px;height:100px">
                  </template>
                </el-table-column>
                <el-table-column align="center" label="商品名称" width="200">
                  <template slot-scope="scope">
                    <p>{{ scope.row.name }}</p>
                    <p>
                      品牌: {{ scope.row.brandName }} | {{ scope.row.brandEname }}
                    </p>
                    <p>{{ scope.row.description }}</p>
                  </template>
                </el-table-column>

                <el-table-column align="center" label="商品价格" width="200">
                  <template slot-scope="scope">
                    <p>原价: {{ scope.row.originalPrice }}</p>
                    <p>现价: {{ scope.row.price }}</p>
                  </template>
                </el-table-column>

                <el-table-column align="center" prop="productCategoryName" label="商品类别" width="200" />

                <el-table-column align="center" prop="weight" label="重量" width="180" />

              </el-table>
            </el-radio-group>

          </div>
          <el-pagination
            :current-page="page.currentPage" :page-sizes="page.pageSizes" :page-size="page.size"
            layout="total, sizes, prev, pager, next, jumper" :total="page.total" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
        </el-card>
      </div>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 编辑最热商品 -->
    <el-dialog title="编辑限时活动" :visible.sync="isEditOpen" width="50%">
      <el-form ref="form" :model="form" label-width="100px" size="mini">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="商品原价">
              <span>{{ productDetail.price }}</span>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="商品名称">
              <span>{{ productDetail.name }}</span>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="促销价格">
              <el-input-number v-model="form.promotionPrice" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="排序">
              <el-input-number v-model="form.sort" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="开始时间">
              <el-date-picker
                v-model="form.promotionStartTime" type="datetime" placeholder="开始时间"
                value-format="yyyy-MM-dd HH:mm:ss" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="结束时间">
              <el-date-picker
                v-model="form.promotionStartTime" type="datetime" placeholder="结束时间"
                value-format="yyyy-MM-dd HH:mm:ss" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="活动限购数量">
              <el-input v-model="form.promotionPerLimit" size="mini" style="width:100%" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="商品图片">
              <img :src="productDetail.pic" alt="" style="width:50px;height:50px">
            </el-form-item>
          </el-col>

        </el-row>

      </el-form>
      <div slot="footer">
        <el-button @click="isEditOpen = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import mix from '@/mixins/index'
import marketListApi from '@/api/marketing/marketingListApi/index'
export default {
    name: '',
    mixins: [mix],
    data() {
        return {
            dialogVisible: false,
            isEditOpen: false,
            brandList: [], // 品牌列表
            search: {
                productSn: '',
                publishStatus: '',
                verifyStatus: '',
                name: ''
            }, // 搜索栏z
            form: {
                productId: '', // 商品ID
                promotionPrice: '',
                promotionPerLimit: '',
                sort: '',
                promotionStartTime: '',
                promotionEndTime: ''
            }, // 添加限时活动的form
            searchForm: {
                productSn: '',
                publishStatus: '',
                verifyStatus: '',
                name: ''
            }, // 搜索栏
            productList: [], // 商品列表
            productDetail: {}, // 编辑商品的详情
            productId: '' // radio选中 商品id
        }
    },
    created() {
        this.getBrandList()
        this.getGoodsList()
    },
    methods: {
        radioChange(v) {
            this.isEditOpen = true
            this.productList.forEach((item) => {
                if (item.id === v) {
                    this.productDetail = Object.assign({}, item)
                    console.log(' this.productDetail: ', this.productDetail)
                }
            })
            this.form = {}

            this.productId = v
        },
        toReset() {
            this.search = this.$options.data().search
            this.searchForm = this.$options.data().searchForm
        },
        toSearch() {
            this.page.currentPage = 1
            this.searchForm = Object.assign({}, this.search)
            this.getGoodsList()
        },
        handleSizeChange(val) {
            this.page.size = val
            this.page.currentPage = 1
            this.getGoodsList()
        },
        handleCurrentChange(val) {
            this.page.currentPage = val
            this.getGoodsList()
        },
        openPopup() {
            this.dialogVisible = true
        },
        // 获取商品列表
        getGoodsList() {
            const sendSearch = {}
            for (const key in this.searchForm) {
                // 如果搜索框有的内容
                if (this.searchForm[key]) {
                    sendSearch[key] = this.searchForm[key]
                }
            }
            marketListApi
                .productsByPage(this.page.currentPage, this.page.size, {
                    ...sendSearch
                })
                .then((res) => {
                    console.log('res: ', res)
                    this.productList = res.data.rows
                    this.page.total = res.data.total
                })
                .catch((res) => {})
        },
        // 获取品牌列表
        getBrandList() {
            marketListApi
                .findAllBrand()
                .then((res) => {
                    this.brandList = res.data.items
                })
                .catch((rej) => {
                    console.log('error', rej)
                })
        },
        onSubmit() {
            this.isEditOpen = false
            this.$confirm('是否确认新增最热推荐商品?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    marketListApi
                        .addRecommend({
                            ...this.form,
                            productId: this.productId
                        })
                        .then((res) => {
                            if (res.success) {
                                this.isEditOpen = false // 关闭编辑弹窗
                                this.dialogVisible = false // 关闭新增弹窗
                                this.productId = ''
                                this.$emit('success')
                                this.$message.success('添加成功')
                            } else {
                                this.$message.error('添加失败')
                            }
                        })
                })
                .catch((res) => {})
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
