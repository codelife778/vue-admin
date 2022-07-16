<template>
  <!-- 需要引入mixin loadingOption -->
  <div
    v-loading="pageLoading" :element-loading-text="loadingOption.text"
    :element-loading-spinner="loadingOption.spinner" :element-loading-background="loadingOption.background"
    class="detail-main">
    <!-- 进度条 -->
    <div class="step_main">
      <el-steps class="step-bar" :active="step" finish-status="success">
        <el-step title="商品基本信息" />
        <el-step title="添加库存信息" />
        <el-step title="添加移动端详情" />
      </el-steps>
    </div>
    <!-- form表单 -->
    <el-card shadow="never" class="box-card card">
      <div class="header" />
      <el-form ref="form" class="form" :rules="rules" :model="form" label-width="100px">
        <!-- 第一步时填写的信息 -->
        <div v-show="step === 1">
          <div class="form-section-head">基本信息</div>
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item prop="name" label="商品名称" size="small">
                <el-input v-model="form.name" class="myInput" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="productSn" label="商品编码" size="small">
                <el-input v-model="form.productSn" class="myInput" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="productCategoryId" label="商品分类" size="small">
                <el-select v-model="form.productCategoryId" class="myInput" placeholder="商品分类" clearable>
                  <el-option v-for="item in productCategoryList" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="商品品牌" size="small" prop="brandId">
                <el-select v-model="form.brandId" class="myInput" clearable placeholder="品牌">
                  <el-option v-for="item in brandList" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <el-col :span="16" :offset="0">
              <el-form-item label="商品描述" size="small">
                <el-input v-model="form.description" type="textarea" class="myInput" placeholder="商品描述" />
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 第一页第二部分 -->
          <div class="form-section-head">商品属性</div>
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item label="商品原价" size="small" prop="originalPrice">
                <el-input-number
                  v-model="form.originalPrice" class="myInput" placeholder="商品原价"
                  @input="originalPriceChange" />
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="促销类型" size="small">
                <el-select v-model="form.promotionType" class="myInput" placeholder="促销类型" clearable disabled>
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
          <!-- 第一页第三部分 -->
          <div class="form-section-head">其他信息</div>
          <el-row :gutter="30">
            <el-col :span="8" :offset="0">
              <el-form-item label="推荐状态" size="small">
                <el-switch v-model="form.recommendStatus" :active-value="1" :inactive-value="0" />
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0">
              <el-form-item label="新品状态" size="small">
                <el-switch v-model="form.newStatus" :active-value="1" :inactive-value="0" />
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0">
              <el-form-item label="预告商品" size="small">
                <el-switch v-model="form.previewStatus" :active-value="1" :inactive-value="0" />
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

          <!-- <el-switch v-model="form.isshow" active-value="1" inactive-value="0" /> -->
        </div>
        <!-- 第二步开始 -->
        <div v-show="step === 2">
          <div class="form-section-head">商品sku信息</div>
          <el-row :gutter="30">
            <el-col :span="8" :offset="0">
              <el-form-item label="标题" size="small" prop="detailTitle">
                <el-input v-model="form.detailTitle" placeholder="标题" />
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item label="副标题" size="small" prop="detailDesc">
                <el-input v-model="form.detailDesc" placeholder="副标题" />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 上传图片 -->
          <el-form-item class="albumPics" label="画册图片" size="small">
            <el-upload
              :action="uploadUrl" :headers="headers" :on-remove="handleRemove" :file-list="fileList"
              :on-success="imgUploadSuccess" :limit="5" :on-preview="handlePictureCardPreview" list-type="picture-card">
              <i class="el-icon-plus" />
              <!-- 超过五个时候 换个不能点击按钮 -->
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb,文件不超过5个</div>
            </el-upload>
          </el-form-item>

          <!-- shdoing -->
          <!-- sku添加 -->
          <el-form-item style="margin-top: 10px" label="sku设置">
            <div v-show="skuColorList.length > 0" style="display: flex">
              颜色：
              <el-checkbox-group v-model="skuColorSel">
                <!-- 必须添加lable，不然选中一个会出现全选bug -->
                <el-checkbox v-for="(item, index) in skuColorList" :key="index" :label="item">
                  <span>{{ item.text }}</span>
                  <!-- 添加参数图片 -->
                  <!-- <img style="width: 50px; height: 50px" :src="item" alt="" /> -->
                  <el-button
                    size="mini" type="text" style="color: red; margin-left: 10px"
                    @click="delParam(item, 'skuColorList', 'skuColorSel')">删除</el-button>
                </el-checkbox>
              </el-checkbox-group>
            </div>
            <div v-show="skuCapacityList.length > 0" style="display: flex">
              大小：
              <el-checkbox-group v-model="skuCapacitySel">
                <el-checkbox v-for="(item, index) in skuCapacityList" :key="index" :label="item">
                  <span>{{ item.text }}</span>
                  <el-button
                    size="mini" type="text" style="color: red; margin-left: 10px"
                    @click="delParam(item, 'skuCapacityList', 'skuCapacitySel')">删除</el-button>
                </el-checkbox>
              </el-checkbox-group>
            </div>

            <div class="sku_flex">
              <div>
                <el-input
                  v-model="skuColorObj.text" style="width: 180px" size="small" placeholder="颜色描述：比如土豪金"
                  class="sku_flex_item" />
                <el-button class="sku_flex_item" size="small" @click="addSkuObj('skuColorObj', 'skuColorList')">创建颜色选项
                </el-button>
              </div>

              <div>
                <el-input
                  v-model="skuCapacityObj.text" style="width: 180px" size="small" placeholder="大小"
                  class="sku_flex_item" />
                <el-button class="sku_flex_item" size="small" @click="addSkuObj('skuCapacityObj', 'skuCapacityList')">
                  创建大小选项
                </el-button>
              </div>
              <!-- 生成列表 -->
              <div style="margin-left: 200px">
                <el-button type="primary" size="small" @click="createSkus">生成sku列表</el-button>
                <el-button type="primary" size="small" @click="createSkus('add')">新增sku</el-button>
              </div>
            </div>
            <div class="sku_table">
              <!-- 生成sku的列表 -->
              <el-table v-show="skuList.length > 0" size="mini" :data="skuList" border stripe>
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
                    <el-button style="color: red" size="mini" type="text" @click="removeSku(scope.row)">删除</el-button>
                  </template>
                </el-table-column>

              </el-table>
            </div>
          </el-form-item>
        </div>
        <!-- 第三步 -->
        <div v-show="step === 3">

          <div class="form-section-head">详情描述</div>

          <el-form-item size="small" label="商品详情">
            <TinEditor ref="tin" v-model="content" />
          </el-form-item>

          <el-form-item label="备注" size="small">
            <el-input v-model="form.note" type="textarea" class="myInput" placeholder="备注" />
          </el-form-item>

        </div>

        <!-- 底部按钮 -->
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

    <!-- 按钮 -->
  </div>
</template>

<script>
import mixin from '@/mixins/index'
import {
    productSkusDetail,
    getAllCategory,
    findAllBrand,
    addProductAndSkus,
    updateProductAndSkus
} from '@/api/goodsManage/goodsList/index'

// import brandApi from '@/api/brand/index'
// import productApi from '@/api/product/index'
// import categoryApi from '@/api/category/index'
// CodeToText是个大对象，属性是区域码，属性值是汉字 用法例如：CodeToText['110000']输出北京市
// TextToCode是个大对象，属性是汉字，属性值是区域码 用法例如：TextToCode['北京市'].code输出110000,TextToCode['北京市']['市辖区'].code输出110100,TextToCode['北京市']['市辖区']['朝阳区'].code输出110105
// import { regionDataPlus, CodeToText } from "element-china-area-data";
import TinEditor from '@/components/Tinymce'
import { uuid } from 'vue-uuid'
export default {
    name: 'ProductDeati',
    components: { TinEditor },
    mixins: [mixin],
    data() {
        return {
            content: '',
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
            // cityOptions: regionDataPlus, // 选择城市组件的配置
            // selectedCity: [], // 选择城市的列表
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
            dialogVisible: false, // 是否显示 大图
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
        // 获取品牌列表
        await this.getBrandList()
        // 获取品牌列表
        await this.getCategory()
        if (this.id) {
            this.getDetail()
        }
    },
    methods: {
        originalPriceChange(v) {
            this.form.price = v
        },
        // 上传图片点击时候获取当前需要上传的目标对象
        getTableItem(value) {
            // 把选中的元素暂存
            this.tempTableObj = value
        },
        // 获取单个商品详情
        getDetail() {
            this.pageLoading = true

            productSkusDetail(this.id)
                .then((res) => {
                    // 大表单
                    this.form = res.data.product
                    // this.skuList = res.data.skus;

                    res.data.skus.forEach((item) => {
                        // sku款式   把数组skus中元素暂存到skuList中,并元素中的属性spData转化一下
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
                    // 处理画册 [ , ] 为什么this.form有这个albumPics属性? 答:来自后台的数据或者点击编辑
                    if (this.form.albumPics) {
                        // split 用逗号把字符串分割成数组
                        const imgArr = this.form.albumPics.split(',')
                        imgArr.forEach((item) => {
                            // 把地址作为对象存到数组fileList中
                            this.fileList.push({
                                url: item
                            })
                        })
                    }
                    // 处理产品服务

                    // 短路语句如果左为真,执行右边语句 ⭐嵌套过深,防止报错
                    if (this.form.serviceIds && this.form.serviceIds.length > 0) {
                        // this.form.serviceIds 字符串 "1,2,3",split用逗号把数组分割成字符串
                        this.serviceIds = this.form.serviceIds.split(',')
                    }
                    // 赋值富文本  把this.form.detailMobileHtml内容赋值到富文本中
                    this.setTin(this.form.detailMobileHtml)
                    // 处理sku图片列表
                    // if (this.skuList) {
                    //   this.skuList.forEach((item) => {
                    //     this.skuParamsList.push(item.pic);
                    //   });
                    // }
                    this.pageLoading = false
                })
            // 捕捉then中回调函数的错误
                .catch((error) => {
                    this.$message.error(error)
                    this.pageLoading = false
                })
        },
        // 获取商品类型列表
        getCategory() {
            getAllCategory()
                .then((res) => {
                    if (res.success) {
                        res.data.items.forEach((item) => {
                            if (item.category.name === '乐居') {
                                this.productCategoryList = item.children
                            }
                        })
                    }
                })
                .catch((rej) => {})
        },
        // 创建sku 由于决定是否清空list 所以用async函数变异步为同步
        async createSkus(type) {
            // 想要生产新的sku,必须要有颜色
            if (this.skuColorSel.length <= 0) {
                this.$message.error('请选中颜色')
                return
            }
            const publicObj = {
                // 以下空属性需要自己填写
                pic: '',
                price: this.form.price,
                sale: '',
                skuCode: '100000',
                stock: '',
                lowStock: ''
            }
            if (type !== 'add') {
                await this.$confirm(
                    '此操作将清空sku列表,并生成新的列表, 是否继续?',
                    '提示',
                    {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                ).then(() => {
                    // 点击编辑按钮进来的,this.skuList数组有元素
                    this.skuList = []
                    this.$message({
                        type: 'success',
                        message: '创建成功!'
                    })
                })
            }
            // 两层循环 首先必须要有颜色 sku款式有 大小和颜色
            if (this.skuCapacitySel.length > 0) {
                this.skuColorSel.forEach((item1) => {
                    // 每个颜色款式 都要绑定所有大小款式 组成一个数组
                    this.skuCapacitySel.forEach((item2) => {
                        const arr = [
                            { key: '颜色', value: item1.text },
                            { key: '大小', value: item2.text }
                        ]

                        this.skuList.push({
                            spData: arr,
                            tempId: uuid.v1(),
                            ...publicObj
                        })
                    })
                })
            } else {
                // 如果只有颜色没有大小
                this.skuColorSel.forEach((item) => {
                    const arr = [{ key: '颜色', value: item.text }]
                    this.skuList.push({
                        spData: arr,
                        tempId: uuid.v1(),
                        ...publicObj
                    })
                })
            }
        },
        // addSkus(){
        //   d
        // },
        // 删除选中的sku款式
        removeSku(value) {
            //
            // return
            if (value.tempId) {
                // 过滤掉选中的sku款式
                this.skuList = this.skuList.filter(
                    (item) => item.tempId != value.tempId
                )
            } else {
                // 如果没有tempId 就过滤掉选中的sku款式
                this.skuList = this.skuList.filter((item) => item.id != value.id)
            }
        },
        // 删除创建的sku大小和sku颜色
        delParam(val, list, selList) {
            // 这里处理下  选中情况 删除，把删除内容在选中的列表中移除
            // if (this[selList].indexOf(val) != -1) {
            //     this[selList].splice(this[selList].indexOf(val), 1)
            // }

            // 这里为什么会有两个列表, 选中列表和未选中列表
            this[selList] = this[selList].filter((item) => item.tempId != val.tempId)

            this[list] = this[list].filter((item) => item.tempId != val.tempId)
        },
        // 添加skus参数方法 第一个传obj 第二个传list
        // 创建sku款式,比如颜色,大小
        addSkuObj(skuobj, list) {
            const obj = Object.assign(
                {
                    tempId: uuid.v1()
                },
                this[skuobj]
            )

            // 暂存列表 增加对象
            this[list].push(obj)
            // 情况暂存对象
            // 创建完,清空输入框
            this[skuobj] = {}
        },

        // 上传展示图片成功函数
        // 点击打开按钮调用这个函数
        handleAvatarSuccess(res, file) {
            // fileUrl 图片上传的地址
            this.form.pic = res.data.fileUrl
        },
        handleTableSuccess(res, file) {
            // sku图片上传成功的回调函数 tempTableObj是点击时➕按钮时选中的元素
            this.skuList.forEach((item) => {
                if (item === this.tempTableObj) {
                    item.pic = res.data.fileUrl
                }
            })
        },
        // 移除画册图片
        handleRemove(file, fileList) {
            // 移除图片时触发回调函数,返回的数据中有移除的url,
            // 在fileList中移除url
            this.fileList = this.fileList.filter((item) => {
                return item.url != file.url
            })
        },
        // 点击画册图片，查看大图
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url
            this.dialogVisible = true
        },

        // 画册图片上传成功 时回调函数
        imgUploadSuccess(res, file) {
            if (res.success) {
                // fileList 存放图片的地址用于显示
                this.fileList.push({ url: res.data.fileUrl })
                this.$message.success('上传成功')
            } else {
                this.$message.error('上传失败')
            }
        },
        getBrandList() {
            findAllBrand()
                .then((res) => {
                    // 获取品牌列表
                    this.brandList = res.data.items
                })
                .catch((rej) => {})
        },
        onSubmit() {
            var brandName = ''
            var productCategoryName = ''
            this.brandList.forEach((item) => {
                if (item.id === this.form.brandId) {
                    brandName = item.name
                }
            })
            this.productCategoryList.forEach((item) => {
                if (item.id === this.form.productCategoryId) {
                    productCategoryName = item.name
                }
            })

            this.$refs.form.validate((valid) => {
                if (valid) {
                    //  是否可以点击提交按钮
                    this.couldNext = true
                    // 获取富文本框内容
                    const content = this.getTin()
                    const subSkuList = []
                    // 将 skulist处理成后台需要的列表
                    this.skuList.forEach((item) => {
                        // 删除掉 tempId
                        if (item.tempId) {
                            delete item.tempId
                        }
                        subSkuList.push({
                            ...item,
                            spData: JSON.stringify(item.spData)
                        })
                    })
                    // 新增============
                    const albumPicsArr = this.fileList.map((item) => item.url)
                    // 是新增商品
                    if (!this.id) {
                        // 提交接口
                        addProductAndSkus({
                            pmsSkuStockList: subSkuList,
                            product: {
                                ...this.form,
                                brandName,
                                productCategoryName,
                                detailMobileHtml: content,
                                albumPics: albumPicsArr.join(','),
                                serviceIds: this.serviceIds.join(',')
                            }
                        })
                            .then((res) => {
                                if (res.success) {
                                    this.$message.success('新增成功')
                                    this.$router.push({ path: '/goodsManage/goodsCategory' })
                                }
                                this.couldNext = false
                            })
                            .catch((rej) => {
                                this.couldNext = false

                                this.$message.error('添加失败')
                            })
                    } else {
                        // 编辑=======
                        updateProductAndSkus({
                            pmsSkuStockList: subSkuList,
                            product: {
                                ...this.form,
                                brandName,
                                productCategoryName,
                                detailMobileHtml: content,
                                // 数组中每一个元素用逗号合并成字符串
                                albumPics: albumPicsArr.join(','),
                                serviceIds: this.serviceIds.join(',')
                            }
                        })
                            .then((res) => {
                                if (res.success) {
                                    this.$message.success('修改成功')
                                    this.$router.push({ path: '/goodsManage/goodsCategory' })
                                }
                                this.couldNext = false
                            })
                        // 捕捉then回调函数中的错误
                            .catch((rej) => {
                                this.couldNext = false
                                this.$message.error('添加失败')
                            })
                    }
                    // 表单校验失败
                } else {
                    this.$message.error('请填写必要信息')
                    return false
                }
            })
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
            // valid_fileds数组中的每个元素为需要验证的表单属性
            this.$refs.form.validateField(valid_fileds, (valid) => {
                if (valid) {
                    // valid如果为空 说明验证通过,有值验证不通过,值为需要重新填写的属性
                    // valid_all 修改为false
                    valid_all = valid_all && false
                } else {
                    // valid_all 修改为true
                    valid_all = valid_all && true
                }
            })

            if (valid_all) {
                // 全部验证通过
                this.step++
            } else {
                this.$message.error('请注意表单验证！！！')
            }
        },
        preBtn() {
            this.step--
        },
        // 获取富文本框内容
        getTin() {
            console.log('噶噶玛')
            var rs = this.$refs.tin.getContent()
            return rs
        },
        // 把 v 赋值到富文本框中
        setTin(v) {
            console.log('v: ', v)

            this.$refs.tin.setDelayContent(v)
        }
    }
}
</script>
<style scoped lang="scss">
// .detail-main {
//   min-height: 900px;
//   .step_main {
//     width: 100%;
//     background-color: #fff;
//     margin-bottom: 30px;
//     overflow: hidden;
//     .step-bar {
//       width: 60%;
//       margin: 30px auto;
//     }
//   }
//   .card {
//     margin: 30px;
//   }
//   .form {
//     ::v-deep .el-form-item {
//       label {
//         font-weight: normal;
//       }
//     }
//   }
//   .bottom_main {
//     margin-top: 40px;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     width: 100%;
//     height: 50px;
//   }
//   .form-section-head {
//     font-size: 16px;
//     padding: 10px 0;
//     border-bottom: 1px solid #e5e5e5;
//     margin-bottom: 30px;
//   }

//   .sku_flex_item {
//     margin-right: 10px;
//   }

//   .sku_flex {
//     display: flex;
//     align-items: center;
//   }
//   .avatar-uploader .el-upload {
//     border: 1px dashed #d9d9d9;
//     border-radius: 6px;
//     cursor: pointer;
//     position: relative;
//     overflow: hidden;
//   }
//   .avatar-uploader .el-upload:hover {
//     border-color: #409eff;
//   }
//   .avatar-uploader-icon {
//     font-size: 28px;
//     color: #8c939d;
//     width: 178px;
//     height: 178px;
//     line-height: 178px;
//     text-align: center;
//   }
//   .avatar {
//     width: 178px;
//     height: 178px;
//     display: block;
//   }
//   .myInput {
//     width: 90%;
//   }
// }
</style>
