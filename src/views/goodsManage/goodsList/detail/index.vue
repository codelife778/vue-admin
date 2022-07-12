<template>
  <div
    v-loading="pageLoading" :element-loading-text="loadingOption.text"
    :element-loading-spinner="loadingOption.spinner" :element-loading-background="loadingOption.background"
    class="detail-main">
    <div class="stpe-main">
      <el-steps :active="step" finish-status="success" align-center="">
        <el-step title="商品基本信息" />
        <el-step title="添加库存信息" />
        <el-step title="添加移动端详情" />
      </el-steps>
    </div>
    <el-card>
      <div slot="header" />
      <el-form ref="form" class="form" :rules="rules" :model="form" label-width="80px">
        <div v-show="step === 1">
          <div>基本信息</div>
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item label="商品名称" size="small" prop="name">
                <el-input v-model="form.name" placeholder="" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="商品编码" size="small" prop="productSn">
                <el-input v-model="form.productSn" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="商品分类" size="small" prop="productCategoryId">
                <el-select v-model="form.productCategoryId" placeholder="商品分类">
                  <el-option v-for="item in productCategoryList" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="商品品牌" size="small" prop="brandId">
                <el-select v-model="form.brandId" placeholder="品牌">
                  <el-option v-for="item in brandList" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="商品描述" size="small">
                <el-input v-model="form.description" placeholder="商品描述" type="textarea" />
              </el-form-item>
            </el-col>
          </el-row>
          <div class="form-section-head">商品属性</div>
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item label="商品原价" size="small" prop="originalPrice">
                <el-input-number v-model="form.originalPrice" @input="originalPriceChange" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="促销原价">
                <el-select v-model="form.promotionType" placeholder="促销类型">
                  <el-option
                    v-for="(item, index) in promotionTypeList" :key="index" :label="item.name"
                    :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="活动价格" size="small">
                <el-input-number v-model="form.price" disabled class="myInput" placeholder="当前价格" type="number" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="重量(kg)" size="small" prop="weight">
                <el-input-number v-model="form.weight" class="myInput" placeholder="重量" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <el-col :span="8" :offset="0">
              <el-form-item label="审核状态" size="small">
                <el-switch v-model="form.verifyStatus" :active-value="1" :inactive-value="0" />
              </el-form-item>
            </el-col>

            <el-col :span="8" :offset="0">
              <el-form-item label="是否上架" size="small">
                <el-switch v-model="form.publishStatus" :active-value="1" :inactive-value="0" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <el-form-item label="缩略图" size="small" prop="pic">
              <el-upload
                class="avatar-uploader" :action="uploadUrl" :headers="headers" :show-file-list="false"
                :on-success="handleAvatarSuccess">
                <img v-if="form.pic" :src="form.pic" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
            </el-form-item>
          </el-row>
          <div class="form-section-head">
            其他信息
          </div>
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="推荐状态">
                <el-switch v-model="form.recommendStatus" active-value="1" inactive-value="0" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="新品状态">
                <el-switch v-model="form.newStatus" active-value="1" inactive-value="0" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="预告商品">
                <el-switch v-model="form.previewStatus" active-value="1" inactive-value="0" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="搜索关键词" size="small" label-width="100px">
                <el-input v-model="form.keywords" class="myInput" placeholder="关键词" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="库存预警" size="small" prop="lowStock">
                <el-input-number v-model="form.lowStock" class="myInput" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="商品排序" size="small" prop="sort">
                <el-input-number v-model="form.sort" class="myInput" placeholder="排序" />
              </el-form-item>
            </el-col>
            <el-col :span="16" :offset="0">
              <el-form-item label="产品服务" size="small">
                <el-checkbox-group v-model="serviceIds">
                  <el-checkbox label="1" name="type">无忧退货</el-checkbox>
                  <el-checkbox label="2" name="type">快速退款</el-checkbox>
                  <el-checkbox label="3" name="type">免费包邮</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div v-show="step===2">
          <div class="form-section-head">商品sku信息</div>
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="标题">
                <el-input v-model="form.detailTitle" placeholder="标题" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="副标题">
                <el-input v-model="form.detailTitle" placeholder="副标题" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="画册图片">
            <el-upload
              :action="uploadUrl" :headers="headers" :on-remove="handleRemove" :file-list="fileList"
              :on-success="imgUploadSuccess" :limit="5" :on-preview="handlePictureCardPreview" list-type="picture-card">
              <i class="el-icon-plus" />
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
          <el-form-item ref="form" :model="form" label-width="80px">
            <div v-show="1">
              颜色:
              <el-checkbox-group v-model="skuColorSel">
                <el-checkbox :key="1" :label="2">
                  <span>{{ skuColorSel.index }}</span>
                  <el-button
                    size="mini" type="text" style="color: red; margin-left: 10px"
                    @click="delParam(item, 'skuColorList', 'skuColorSel')">删除</el-button>
                </el-checkbox>
              </el-checkbox-group>
            </div>
            <div class="sku_flex">
              <div>
                <el-input v-model="skuColorObj.text" placeholder="颜色描述：比如土豪金" />
                <el-button type="primary">创建颜色选项</el-button>
              </div>
              <div>
                <el-input v-model="skuCapacityObj.text" placeholder="大小" />
                <el-button type="primary">创建大小选项</el-button>
              </div>
              <div>
                <el-button type="primary">生成sku列表</el-button>
                <el-button type="primary">新增sku</el-button>
              </div>
            </div>
            <div class="sku_table">
              <!-- 生成sku列表 -->
              <el-table>
                <el-table-column type="index" label="#" fixed="left" />
                <el-table-column label="图片" width="120">
                  <template slot-scope="scope">
                    <el-upload
                      style="width: 100px; height: 100px" :action="uploadUrl" :headers="headers"
                      :show-file-list="false" :on-success="handleTableSuccess" @click.native="getTableItem(scope.row)">
                      <img v-if="scope.row.pic" src="" alt="">
                      <i
                        v-else style="width: 100px; height: 100px; margin-top: -31px"
                        class="el-icon-plus avatar-uploader-icon" />
                      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                  </template>
                </el-table-column>

                <el-table-column label="颜色" :width="160">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.spData[0].value" />
                  </template>
                </el-table-column>

                <el-table-column label="大小" :width="160">
                  <template slot-scope="scope">
                    <el-input v-if="scope.row.spData[1]" v-model="scope.row.spData[1].value" />
                  </template>
                </el-table-column>

                <el-table-column header-align="center" align="center" prop="prop" label="库存">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.stock" size="mini" placeholder="自定义库存" />
                  </template>
                </el-table-column>

                <el-table-column header-align="center" align="center" prop="prop" label="预警库存">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.lowStock" size="mini" placeholder="预警库存" />
                  </template>
                </el-table-column>

                <el-table-column header-align="center" align="center" prop="prop" label="锁定库存">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.lockStock" size="mini" placeholder="锁定库存" />
                  </template>
                </el-table-column>

                <el-table-column header-align="center" align="center" prop="prop" label="sku编码">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.skuCode" size="mini" placeholder="自定义sku编码" />
                  </template>
                </el-table-column>

                <el-table-column header-align="center" align="center" prop="prop" label="价格">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.price" size="mini" placeholder="价格,单位:分" />
                  </template>
                </el-table-column>

                <el-table-column header-align="center" align="center" prop="prop" label="销量">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.sale" size="mini" />
                  </template>
                </el-table-column>

                <el-table-column header-align="center" align="center" prop="prop" label="操作">
                  <template slot-scope="scope">
                    <el-button style="color: red" size="mini" type="text" @click="removeSku(scope.row)">删除</el-button>
                  </template>
                </el-table-column>

              </el-table>
            </div>
          </el-form-item>
        </div>
        <div v-show="step===3">
          <div class="form-section-head">详情描述</div>
          <el-form-item label="商品详情">
            <TinEditor ref="tin" />
          </el-form-item>

          <el-form-item label="label">
            <el-input v-model="form.note" type="textarea" class="myInput" placeholder="备注" />
          </el-form-item>

        </div>

        <!-- 底部 -->
        <div class="bottom_main">
          <el-button v-show="step > 1" class="submit_button" size="small" @click="preBtn">返回上一步
          </el-button>
          <el-button v-show="step < 3" size="small" class="submit_button" type="primary" @click="nextBtn">
            {{ nextBtnText }}
          </el-button>
          <el-button
            v-show="step == 3" size="small" class="submit_button" type="primary" :loading="couldNext"
            @click="onSubmit">提交保存</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import mix from '@/mixins/index'
import TinEditor from '@/components/Tinymce'
import {
    findAllBrand,
    getAllCategory,
    productSkusDetail
} from '@/api/goodsManage/goodsList/index'
export default {
    name: '',
    components: {
        TinEditor
    },
    mixins: [mix],
    data() {
        return {
            pageLoading: false,
            couldNext: false, // button的loading动画
            step: 1,
            id: '',
            // sku的table  list
            skuList: [],
            tempSkuList: [], // 暂存的skuList
            tempTableObj: {}, // 暂时存放的table选中对象，在上传图片时反显用到
            // sku参数列表
            skuParamsList: [],
            // 添加sku颜色参数
            skuColorObj: {}, // 颜色暂存
            skuColorList: [], // 颜色列表
            skuColorSel: [], // 选中颜色列表
            // 添加sku大小参数
            skuCapacityObj: {}, // 大小暂存
            skuCapacityList: [], // 大小列表
            skuCapacitySel: [], // 选中大小列表
            // 品牌列表
            brandList: [],
            productCategoryList: [], // 商品类型列表
            // 类型列表
            promotionTypeList: [
                { name: '没有促销使用原价', id: 0 },
                { name: '使用促销价', id: 1 },
                { name: '使用会员价', id: 2 },
                { name: '使用阶梯价格', id: 3 },
                { name: '使用满减价格', id: 4 },
                { name: '限时购', id: 5 }
            ],
            form: {
                productSn: '',
                name: '', // 名字
                brandId: '', // 品牌ID
                price: '', // 当前价格
                originalPrice: '', // 原价
                sort: '', // 排序
                keywords: '', // 关键词
                description: '', // 商品描述
                note: '', // 商品备注
                deleteStatus: '0', // 删除状态
                newStatus: '0', // 新品状态
                previewStatus: '0', // 是否预告商品
                publishStatus: '0', // 是否上架
                recommendStatus: '1', // 是否推荐
                verifyStatus: '1', // 审核状态
                weight: '', // 商品重量 单位千克
                detailTitle: '', // 标题
                detailDesc: '', // 副标题
                pic: '', // 展示图片
                lowStock: '', // 库存预警 doing
                productAttributeCategoryId: '', // 属性分类
                productCategoryId: '', // 商品分类
                promotionType: 0 // 促销类型
            },
            dialogImageUrl: '', // 点开大图 图片地址
            dialogVisible: false, // 是否显示
            serviceIds: [], // 产品服务
            imgList: [], // 需要上传的图片地址列表
            // fileList: [], // 图片列表
            fileList: [], // 文件列表 画册反显要用
            firstPageValidFiles: [
                'name',
                'productSn',
                'productCategoryId',
                'brandId',
                'originalPrice',
                'weight',
                'pic',
                'lowStock',
                'sort'
            ], // 第一页需要验证的字段
            secondPageValidFiles: ['detailTitle', 'detailDesc'],
            rules: {
                name: [
                    { required: true, message: '请输入活动名称', trigger: 'blur' }
                    // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
                ],
                productSn: [
                    { required: true, message: '请输入商品编码', trigger: 'blur' }
                ],
                productCategoryId: [
                    { required: true, message: '请选择商品分类', trigger: 'change' }
                ],
                brandId: [
                    { required: true, message: '请选择商品品牌', trigger: 'change' }
                ],
                originalPrice: [
                    {
                        required: true,
                        pattern: /1/,
                        message: '商品原价要求为大于 0 的数',
                        trigger: 'blur',
                        transform(value) {
                            return value > 0 ? '1' : '0'
                        }
                    }
                ],
                weight: [
                    {
                        required: true,
                        pattern: /1/,
                        message: '商品重量要求为大于 0 的数',
                        transform(value) {
                            return value > 0 ? '1' : '0'
                        },
                        trigger: 'blur'
                    }
                ],
                pic: [{ required: true, message: '请上传缩略图' }],
                lowStock: [
                    {
                        required: true,
                        pattern: /1/,
                        message: '库存预警要求为大于 0 的数',
                        transform(value) {
                            return value > 0 ? '1' : '0'
                        },
                        trigger: 'blur'
                    }
                ],
                sort: [
                    {
                        required: true,
                        pattern: /1/,
                        message: '商品排序要求为大于 0 的数',
                        transform(value) {
                            return value > 0 ? '1' : '0'
                        },
                        trigger: 'blur'
                    }
                ],
                detailTitle: [
                    { required: true, message: '请填写标题', trigger: 'blur' }
                ],
                detailDesc: [
                    { required: true, message: '请填写副标题', trigger: 'blur' }
                ]
            }
        }
    },
    computed: {
    // 点击下一步按钮显示内容
        nextBtnText() {
            let text = ''
            switch (this.step) {
                case 1:
                    text = '下一步,填写库存信息'
                    break
                case 2:
                    text = '下一步,填写移动端详情'
                    break
                default:
                    break
            }
            return text
        }
    // 是否可以上传图片
    // couldUpload() {
    //   if (this.imgList.length === 5) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // },
    },
    async created() {
        this.id = this.$route.params.id
        await this.getBrandList()
        await this.getCategory()
        if (this.id) {
            this.getDetail()
        }
    },
    methods: {
        getDetail() {
            productSkusDetail(this.id).then((res) => {
                console.log('res: ', res)
                res.data.skus.forEach((item) => {
                    this.skuList.push({
                        ...item,
                        spData: JSON.parse(item.spData)
                    })
                    // 增加一个暂存的skuList，用于编辑时候新增sku
                    this.tempSkuList.push({
                        ...item,
                        spData: JSON.parse(item.spData)
                    })
                })
                if (this.form.albumPics) {
                    console.log('this.form.albumPics: ', this.form.albumPics)
                    const imgArr = this.form.albumPics.split(',')
                    imgArr.forEach((item) => {
                        this.fileList.push({
                            url: item
                        })
                    })
                }
                // 处理产品服务

                if (this.form.serviceIds && this.form.serviceIds.length > 0) {
                    this.serviceIds = this.form.serviceIds.split(',')
                }
                // 赋值富文本
                this.setTin(this.form.detailMobileHtml)
                // 处理sku图片列表
                // if (this.skuList) {
                //   this.skuList.forEach((item) => {
                //     this.skuParamsList.push(item.pic);
                //   });
                // }
                this.pageLoading = false
            }).catch(error => {
                this.$message.error(error)
                this.pageLoading = false
            })
        },
        getCategory() {
            getAllCategory().then((res) => {
                if (res.success) {
                    res.data.items.forEach((item) => {
                        if (item.category.name === '乐居') {
                            this.productCategoryList = item.children
                        }
                    })
                }
            })
        },
        getBrandList() {
            findAllBrand().then((res) => {
                if (res.success) {
                    this.brandList = res.data.items
                }
            })
        },
        handlePictureCardPreview() {},
        imgUploadSuccess() {},
        handleRemove() {},
        originalPriceChange() {},
        handleAvatarSuccess() {},
        preBtn() {
            this.step--
        },
        nextBtn() {
            // 进入下一步前，做表单验证
            let valid_all = true // 要验证的字段是否都验证通过
            let valid_fileds = []
            if (this.step == 1) {
                valid_fileds = this.firstPageValidFiles
            } else if (this.step == 2) {
                valid_fileds = this.secondPageValidFiles
            }
            this.$refs.form.validateField(valid_fileds, (valid) => {
                if (valid) {
                    valid_all = valid_all && false
                } else {
                    valid_all = valid_all && true
                }
            })

            if (true) {
                // 全部验证通过
                this.step++
            } else {
                this.$message.error('请注意表单验证！！！')
            }
        },
        onSubmit() {}
    }
}
</script>

<style lang="scss" scoped></style>
