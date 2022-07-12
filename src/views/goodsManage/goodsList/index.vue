<template>
  <div class="product-main">
    <BfCollapse title="商品管理介绍">
      <div>
        商品管理模块可以对客户端的商品进行增删改查等相关操作,来控制客户端商品的列表展示和商品详情
      </div>
    </BfCollapse>
    <BfCollapse title="条件查询">
      <el-form :model="search" label-width="80px" :inline="false" class="search" size="normal">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="商品名称" size="mini">
              <el-input v-model="search.name" placeholder="商品名称/模糊查询" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商品货号" size="mini">
              <el-input v-model="search.productSn" placeholder="商品货号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="品牌" size="mini">
              <el-select v-model="search.brandId" placeholder="品牌">
                <el-option v-for="item in brandList" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="上架状态" size="mini">
              <el-select v-model="search.publishStatus" placeholder="上架状态">
                <el-option :value="1" label="上架" />
                <el-option :value="0" label="未上架" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="审核状态" size="mini">
              <el-select v-model="search.verifyStatus" placeholder="审核状态">
                <el-option :value="1" label="上架" />
                <el-option :value="0" label="未上架" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="toReset">重置</el-button>
            <el-button type="primary" @click="toSearch">搜索</el-button>
          </el-col>
        </el-row>
      </el-form>
    </BfCollapse>
    <el-card>
      <div slot="header">
        <el-button type="primary" @click="addSku">新增</el-button>
        <el-button type="primary">导出excel文件</el-button>
      </div>
      <el-table v-loading="loading" :data="productList" border style="width: 100%">
        <el-table-column prop="prop" type="index" label="序号" fixed="left" />
        <el-table-column header-align="center" align="center" prop="prop" label="商品图片" width="150">
          <template slot-scope="scope">
            <img :src="scope.row.pic" alt="" style="width: 50px; height: 50px">
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
        <el-table-column align="center" prop="prop" label="标签" width="180">
          <template slot-scope="scope">
            <p>
              最新:
              <el-switch
                v-model="scope.row.newStatus" size="small" :active-value="1" :inactive-value="0"
                @change="switchCode('newStatus', scope.row)" />
            </p>
            <p>
              推荐:
              <el-switch
                v-model="scope.row.recommendStatus" size="small" :active-value="1" :inactive-value="0"
                @change="switchCode('recommendStatus', scope.row)" />
            </p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="标签2">
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
        <el-table-column align="center" label="sku">
          <template slot-scope="scope">
            <el-button type="text" size="default" @click="toSkuDetail(scope.row)">编辑sku</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="weight" label="重量" />
        <el-table-column align="center" prop="sort" label="排序" />
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="toEditor(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="toDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="page.currentPage" :page-sizes="page.pageSizes" :page-size="page.size"
        layout="total, sizes, prev, pager, next, jumper" :total="page.total" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </el-card>
    <skuDetail ref="skuDetail" />
  </div>
</template>

<script>
import mix from '@/mixins/index'
import { productsByPage, findAllBrand } from '@/api/goodsManage/goodsList/index'
import skuDetail from '@/views/goodsManage/component/skuDetail'
export default {
    name: '',
    components: {
        skuDetail
    },
    mixins: [mix],
    data() {
        return {
            search: {},
            loading: false,
            productList: [],
            brandList: []
        }
    },
    created() {
        this.getProductByPage()
        this.getFindAllBrand()
    },
    methods: {
        addSku() {
            this.$router.push({ name: 'addDetail' })
        },
        toEditor(row) {
            this.$router.push({ name: 'editorDetail', params: { id: row.id }})
        },
        toSkuDetail(row) {
            this.$refs.skuDetail.openSKuDetail(row.id)
        },
        getFindAllBrand() {
            findAllBrand().then((res) => {
                this.brandList = res.data.items
            })
        },
        getProductByPage() {
            this.loading = true

            productsByPage(this.page.currentPage, this.page.size).then((res) => {
                this.productList = res.data.rows
                this.page.total = res.data.total
                this.loading = false
            })
        },
        handleSizeChange(value) {
            this.page.size = value
            this.page.currentPage = 1
            this.getProductByPage()
        },
        handleCurrentChange(value) {
            this.page.currentPage = value
            this.getProductByPage()
        },
        switchCode() {},
        toReset() {},
        toSearch() {}
    }
}
</script>

<style lang="scss" scoped></style>
