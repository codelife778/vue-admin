<template>
  <div>
    <el-card>
      <div slot="header" />
      <div>
        订单信息:
        <el-tag v-if="status===0" type="danger">
          {{ statusList[status].name }}
        </el-tag>
        <el-tag v-if="status===1" type="danger">
          {{ statusList[status].name }}
        </el-tag>
        <el-tag v-else-if="status === 2" size="small">
          {{ statusList[status].name }}
        </el-tag>
        <el-tag v-else-if="status === 3" size="small">
          {{ statusList[status].name }}
        </el-tag>
      </div>
      <OrderTable :table-data="orderTableData" />
      <div v-if="imgList.length > 0" class="img_main">
        <div class="left">退单图片:</div>
        <div class="right">
          <el-image
            v-for="(item, index) in imgList" :key="index"
            style="width: 100px; height: 100px; margin-right: 20px" :src="item" :preview-src-list="imgList" />
        </div>
      </div>

      <div>
        退货商品:
        <el-table :data="productList" style="width: 100%" border>
          <el-table-column prop="prop" label="商品图片" width="200">
            <template slot-scope="scope">
              <img :src="scope.row.productPic" alt="" style="width:100px;height:100px">
            </template>
          </el-table-column>

          <el-table-column align="center" prop="prop" label="商品描述" width="200">
            <template slot-scope="scope">
              <p>{{ scope.row.productName }}</p>
              <p>品牌:{{ scope.row.productBrand }}</p>
            </template>
          </el-table-column>

          <el-table-column align="center" prop="prop" label="价格" width="200">
            <template slot-scope="scope">
              {{ scope.row.productRealPrice }}
            </template>
          </el-table-column>

          <el-table-column header-align="center" align="center" prop="prop" label="商品属性">
            <template slot-scope="scope">
              <p>{{ scope.row.productAttr }}</p>
            </template>
          </el-table-column>

          <el-table-column align="center" prop="productCount" label="商品数量" width="200" />

          <el-table-column align="center" prop="returnAmount" label="总计" width="200">
            <template slot-scope="scope">
              {{ scope.row.returnAmount }}
            </template>
          </el-table-column>

        </el-table>

        <div>
          用户信息:
          <OrderTable :table-data="userTableData" />
        </div>
        <el-divider />
        <div>
          费用信息:
          <OrderTable :table-data="costData" />
        </div>

        <div
          v-if="status === 0" :style="{
            width: '100%',
            margin: '10px auto',
            fontSize: '16px'
          }">
          <el-form ref="handleForm" :model="handleForm" :rules="receiveRules" label-width="80px">
            <el-row :gutter="10">
              <el-col :span="6">
                <el-form-item label="退款金额" prop="returnAmount">
                  <el-input-number v-model="handleForm.returnAmount" label="label" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="handleMan" label="处理人">
                  <el-input v-model="handleForm.handleMan" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="处理备注" prop="handleNote">
                  <el-input v-model="handleForm.handleNote" />
                </el-form-item>
              </el-col>
            </el-row>

          </el-form>
        </div>
        <el-divider />

        <div v-if="status !== 0">
          处理结果:
          <OrderTable :table-data="resultData" />
          <div>
            <el-form ref="receiveForm" :model="receiveForm" :rules="handleRules" label-width="80px">
              <el-row :gutter="10">
                <el-col :span="6">
                  <el-form-item label="收货人" prop="receiveMan">
                    <el-input v-model="receiveForm.receiveMan" type="text" />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="收货备注" prop="receiveNote">
                    <el-input v-model="receiveForm.receiveNote" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>
        <el-divider />
        <div>
          <el-button v-if="status === 0" type="primary" @click="agreenReturn">同意退款</el-button>
          <el-button v-if="status === 1" type="primary" @click="receiveReturn">确认收货</el-button>
          <el-button v-if="status === 0" type="primary" @click="rejectReturn">拒绝退款</el-button>
        </div>

      </div>

    </el-card>
  </div>
</template>

<script>
import RefundOrderApi from '@/api/orderManage/refundeList/index'

export default {
    name: '',
    data() {
        return {
            pageLoading: false,
            id: '', // id
            status: -1, // 订单状态
            detailObj: {}, // 接口获取到的详情对象
            orderTableData: [], //
            userTableData: [], //
            costData: [], //
            resultData: [], //
            receiveData: [], //
            productList: [], // 商品数组
            imgList: [],
            statusList: [
                { name: '待处理', id: 0 },
                { name: '退货中', id: 1 },
                { name: '已完成', id: 2 },
                { name: '已拒绝', id: 3 }
            ],
            // 秒杀类型列表
            handleForm: {
                returnAmount: 0, // 退款金额
                handleNote: '', // 退款备注
                handleMan: '' // 处理人
            },
            receiveForm: {
                receiveNote: '', // 收穫備注
                receiveMan: '' // 收货人
            },
            receiveRules: {
                handleMan: [{ required: true, message: '处理人姓名', trigger: 'blur' }],
                handleNote: [{ required: true, message: '处理人备注', trigger: 'blur' }]
            },

            handleRules: {
                receiveMan: [
                    { required: true, message: '收货人姓名', trigger: 'blur' }
                ],
                receiveNote: [
                    { required: true, message: '收货人备注', trigger: 'blur' }
                ]
            }

            // 拒绝或者接受备注
        }
    },
    created() {
        this.id = this.$route.params.id
        this.toGetRefundDetail()
    },
    methods: {
        // 拒绝退货
        rejectReturn() {
            this.$refs.handleForm.validate(validate => {
                if (validate) {
                    RefundOrderApi.receiveProduct(this.id, {
                        id: this.id,
                        handleMan: this.handleForm.handleMan,
                        handleNote: this.handleForm.handleNote
                    }).then(res => {
                        if (res.success) {
                            this.$message.success('成功')
                            window.location.reload()
                        } else {
                            this.$message.error('请求失败')
                        }
                    })
                } else {
                    this.$message.warning('请填写必要的信息')
                }
            })
        },
        // 确认收货
        receiveReturn() {
            this.$refs.receiveForm.validate(validate => {
                if (validate) {
                    RefundOrderApi.receiveProduct(this.id, {
                        id: this.id,
                        receiveMan: this.receiveForm.receiveMan,
                        receiveNote: this.receiveForm.receiveNote
                    }).then(res => {
                        if (res.success) {
                            this.$message.success('成功')
                            window.location.reload()
                        } else {
                            this.$message.warning('获取信息失败')
                        }
                    })
                } else {
                    this.$message.warning('请输入必要信息')
                }
            })
        },
        agreenReturn() {
            this.$refs.handleForm.validate(validate => {
                if (validate) {
                    RefundOrderApi.agreeApply(this.id, {
                        id: this.id,
                        handleMan: this.handleForm.handleMan,
                        handleNote: this.handleForm.handleNote,
                        returnAmount: this.handleForm.returnAmount
                    }).then(res => {
                        if (res.success) {
                            this.$message.success('成功')
                            // window.location.reload()
                            this.toGetRefundDetail()
                        } else {
                            this.$message.info('请求失败')
                        }
                    }).catch(res => {

                    })
                } else {
                    this.$message.error('请填写表单信息')
                }
            })
        },
        toGetRefundDetail() {
            RefundOrderApi.orderReturn(this.id)
                .then((res) => {
                    console.log('res: ', res)
                    if (res.success) {
                        this.detailObj = res.data.orderReturnApply
                        this.status = this.detailObj.status
                        // 初始化退货照片数组
                        this.initImgs()
                        // 初始化商品信息
                        this.initProductTable()
                        // 初始化 订单信息
                        this.initOrderObj()
                        // 初始化 用户信息
                        this.initUserObj()
                        // 初始化 费用信息
                        this.initCostObj()
                        // 初始化 处理结果信息
                        this.initResultObj()
                        // 初始化收货信息
                        this.initReceiveObj()
                    } else {
                        this.$message.warning('获取信息失败')
                    }
                })
                .catch((res) => {})
        },
        initImgs() {
            if (this.detailObj.proofPics) {
                // 字符串转数组
                this.imgList = this.detailObj.proofPics.split(',')
            }
        },
        initProductTable() {
            const obj = {
                productPic: this.detailObj.productPic, // 商品图片
                productName: this.detailObj.productName, // 商品名字
                productAttr: this.detailObj.productAttr, // 属性
                productCount: this.detailObj.productCount, // 数量
                productBrand: this.detailObj.productBrand, // 品牌
                productRealPrice: this.detailObj.productRealPrice, // 价格
                returnAmount: this.detailObj.returnAmount // 总计
            }
            this.productList.push(obj)
        },
        initOrderObj() {
            const orderObj = {
                // 当前状态: this.statusList[this.detailObj.status].name, // 当前状态
                订单编号: this.detailObj.orderSn,
                退单人姓名: this.detailObj.returnName, // 当前状态
                退单理由: this.detailObj.reason, // 当前状态
                退单描述: this.detailObj.description, // 当前状态
                申请时间: this.detailObj.createTime // 当前状态
            }
            // orderTableData
            for (const key in orderObj) {
                this.orderTableData.push({
                    key: key,
                    value: orderObj[key],
                    orderId: key === '订单编号' ? this.detailObj.orderId : ''
                })
            }
        },
        initUserObj() {
            const userObj = {
                联系人: this.detailObj.returnPhone,
                联系电话: this.detailObj.returnPhone
            }
            for (const key in userObj) {
                this.userTableData.push({
                    key: key,
                    value: userObj[key]
                })
            }
        },
        initCostObj() {
            const costObj = {
                退单金额: this.detailObj.returnAmount,
                运费金额: 0
            }

            for (const key in costObj) {
                this.costData.push({
                    key: key,
                    value: costObj[key]
                })
            }
        },
        initResultObj() {
            const resultObj = {
                处理人: this.detailObj.handleMan,
                处理备注: this.detailObj.handleNote,
                处理时间: this.detailObj.handleTime
            }

            for (const key in resultObj) {
                this.resultData.push({
                    key: key,
                    value: resultObj[key]
                })
            }
        },
        initReceiveObj() {
            const receiveObj = {
                退单收货人: this.detailObj.receiveMan,
                退单收货备注: this.detailObj.receiveNote,
                退单收货时间: this.detailObj.receiveTime
            }
            // orderTableData
            for (const key in receiveObj) {
                this.receiveData.push({
                    key: key,
                    value: receiveObj[key]
                })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
