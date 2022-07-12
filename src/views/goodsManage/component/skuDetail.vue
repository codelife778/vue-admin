<template>
  <div class="sku_detail">
    <el-dialog width="65%" title="sku列表" :visible.sync="open">
      <div slot="footer" class="dialog-footer">
        <el-button style="margin-bottom:20px" type="primary" size="default" @click="addSku">新增</el-button>

        <!-- 生成sku的列表 -->
        <!-- 表格 el-table  -->
        <el-table v-loading="pageLoading" size="mini" :data="skuList" border stripe>
          <el-table-column type="index" label="#" fixed="left" />

          <el-table-column label="图片" :width="120">
            <template slot-scope="scope">
              <el-upload
                style="width: 100px; height: 100px" :action="uploadUrl" :headers="headers"
                :show-file-list="false" :on-success="handleTableSuccess" @click.native="getTableItem(scope.row)">
                <img v-if="scope.row.pic" style="width: 100px; height: 100px" :src="scope.row.pic" class="avatar">
                <i
                  v-else style="width: 100px; height: 100px; margin-top: -31px"
                  class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
            </template>
          </el-table-column>

          <el-table-column label="颜色" :width="160">
            <template slot-scope="scope">
              <el-input v-model="scope.row.spData[0].value" size="mini" />
            </template>
          </el-table-column>

          <el-table-column label="大小" :width="160">
            <template slot-scope="scope">
              <!-- 这里必须加 v-if，因为有些没有大小， 不加v-if会报错 -->
              <el-input v-if="scope.row.spData[1]" v-model="scope.row.spData[1].value" size="mini" />
            </template>
          </el-table-column>

          <el-table-column label="库存" :width="200">
            <template slot-scope="scope">
              <el-input v-model="scope.row.stock" size="mini" placeholder="自定义库存" />
            </template>
          </el-table-column>

          <el-table-column label="预警库存" :width="200">
            <template slot-scope="scope">
              <el-input v-model="scope.row.lowStock" size="mini" placeholder="预警库存" />
            </template>
          </el-table-column>

          <el-table-column label="锁定库存" :width="200">
            <template slot-scope="scope">
              <el-input v-model="scope.row.lockStock" size="mini" placeholder="锁定库存" />
            </template>
          </el-table-column>

          <el-table-column label="sku编码" :width="200">
            <template slot-scope="scope">
              <el-input v-model="scope.row.skuCode" size="mini" placeholder="自定义sku编码" />
            </template>
          </el-table-column>

          <el-table-column label="价格" :width="160">
            <template slot-scope="scope">
              <el-input v-model="scope.row.price" size="mini" placeholder="价格,单位:分" />
            </template>
          </el-table-column>

          <el-table-column label="销量" :width="160">
            <template slot-scope="scope">
              <el-input v-model="scope.row.sale" size="mini" />
            </template>
          </el-table-column>

          <el-table-column fixed="right" label="操作" :width="160">
            <template slot-scope="scope">
              <span v-if="scope.row.id">
                <el-button style="color: red" size="mini" type="text" @click="removeSku(scope.row)">删除
                </el-button>
                <el-button size="mini" type="text" @click="editSku(scope.row)">修改编辑
                </el-button>
              </span>
              <span v-else>
                <el-button style="color: red" size="mini" type="text" @click="removeNewSku(scope.row)">删除
                </el-button>
                <el-button size="mini" type="text" @click="saveNewSku(scope.row)">保存
                </el-button>
              </span>

            </template>
          </el-table-column>

        </el-table>

        <el-button style="margin-top:20px" @click="open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import skuApi from '@/api/goodsManage/goodsList/sku/index'
import mixin from '@/mixins/index'
import { uuid } from 'vue-uuid'
export default {
    name: 'SkuDetail',
    mixins: [mixin],
    data() {
        return {
            tempTableObj: {}, // 暂时存放的选中sku对象, 用于上传图片返显示
            productId: '', // 商品ID
            pageLoading: false, // 页面加载
            couldNext: false, // 能否提交判断
            open: false, // 打开dialog
            skuList: []
        }
    },
    methods: {
    // 返显 图片
        handleTableSuccess(res, file) {
            this.skuList.forEach((item) => {
                if (item === this.tempTableObj) {
                    item.pic = res.data.fileUrl
                }
            })
        },
        getTableItem(value) {
            this.tempTableObj = value
        },
        // 获取sku信息

        getSkuList() {
            this.pageLoading = true
            this.skuList = []
            skuApi.getSkusByProductId(this.productId).then((res) => {
                if (res.success) {
                    res.data.items.forEach((item) => {
                        this.skuList.push({
                            ...item,
                            spData: JSON.parse(item.spData)
                        })
                    })
                }
                this.pageLoading = false
            })
        },
        openDetail(productId) {
            this.open = true
            this.productId = productId
            this.skuList = []
            this.getSkuList()
        },

        // 删除sku
        removeSku(row) {
            this.$confirm(`是否删除sku?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.pageLoading = true
                    skuApi.delSku(row.id).then((res) => {
                        if (res.success) {
                            this.$message.success('删除sku成功')
                            this.getSkuList()
                        } else {
                            this.$message.error('删除sku失败')
                        }
                        this.pageLoading = false
                    })
                })
                .catch((rej) => {
                    console.log('quxiao')
                })
        },

        // 编辑 sku
        editSku(row) {
            const obj = {
                id: row.id,
                lockStock: row.lockStock,
                lowStock: row.lowStock,
                stock: row.stock,
                pic: row.pic,
                price: row.price,
                productId: row.productId,
                sale: row.sale,
                skuCode: row.skuCode,
                spData: JSON.stringify(row.spData)
            }
            this.pageLoading = true
            skuApi.updateSkuInfo(obj).then((res) => {
                if (res.success) {
                    this.$message.success('修改sku成功')
                } else {
                    this.$message.error('修改sku失败')
                }
                this.pageLoading = false
            })
        },
        addSku() {
            const obj = {
                productId: this.productId,
                lockStock: '',
                lowStock: '',
                stock: '',
                pic: '',
                price: '',
                sale: '',
                skuCode: '',
                spData: [
                    { key: '颜色', value: '' },
                    { key: '容量', value: '' }
                ],
                tempId: uuid.v1()
            }
            this.skuList.push(obj)
        },
        // 删除新的newSku
        removeNewSku(row) {
            this.$confirm(`是否删除sku?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.skuList = this.skuList.filter(
                        (item) => item.tempId != row.tempId
                    )
                })
                .catch((rej) => {
                    console.log('quxiao')
                })
        },
        // 保存新的 sku
        saveNewSku(row) {
            delete row.tempId
            this.pageLoading = true
            skuApi
                .addProductSkus({
                    ...row,
                    spData: JSON.stringify(row.spData)
                })
                .then((res) => {
                    if (res.success) {
                        this.getSkuList()
                        this.$message.success('新增成功')
                    } else {
                        this.$message.error('新增失败')
                    }
                })
            this.pageLoading = false
        }
    }
}
</script>

<style  scoped lang="scss">
.sku_detail {
  .card {
    margin: 30px;
  }

  .table_img {
    width: 100px;
    height: 100px;
  }
}
</style>
