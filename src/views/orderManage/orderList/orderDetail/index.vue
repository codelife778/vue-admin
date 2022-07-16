<template>
  <div>
    <el-card>
      <div slot="header">
        进度条
        <el-steps :active="step">
          <el-step
            v-for="(item,index) in stepList" :key="index" :title="item.name"
            :description="item.time ? item.time : ''" />
          <el-step v-if="step<=4" title="已完成" :description="detailObj && detailObj.receiveTime" />
          <el-step v-if="step<=5 && step!=4" title="退货" :description="detailObj && detailObj.finishTime" />
        </el-steps>
      </div>

      <div>
        <div class="table-title">
          订单信息:
          <span style="margin-left:10px">
            <el-tag v-if="status === 0" type="danger" size="small" effect="dark">
              待付款
            </el-tag>
            <el-tag v-else-if="status === 1" size="small" type="warning" effect="dark">待发货</el-tag>
            <el-tag v-else-if="status === 2" size="small"> 已发货 </el-tag>
            <el-tag v-else-if="status === 3" size="small" effect="dark">已完成</el-tag>
            <el-tag v-else-if="status === 4" size="small" type="info" effect="dark">退货</el-tag>
            <el-tag v-else type="info" size="small"> 无效订单 </el-tag>
          </span>
        </div>
        <OrderTable :table-data="orderTableData" />
        <el-divider />

        <div>
          收货人信息:
          <OrderTable :table-data="userTableData" />
        </div>
        <el-divider />
        <div>
          <div>
            商品信息:
          </div>
          <el-table :data="orderItemList" style="width: 100%" stripe border>
            <el-table-column prop="productName" label="商品名称" width="200" />

            <el-table-column align="center" prop="productPic" label="商品图片" width="250">
              <template slot-scope="scope">
                <img :src="scope.row.productPic" alt="" style="width: 150px;height:150px">
              </template>
            </el-table-column>

            <el-table-column align="center" prop="prop" label="是否退货" width="150">
              <template slot-scope="scope">
                <span v-if="scope.row.isReturn==1">是</span>
                <span v-else>否</span>
              </template>
            </el-table-column>

            <el-table-column align="center" prop="productBrand" label="品牌" width="150" />
            <el-table-column align="center" prop="productPrice" label="价格" width="150" />
            <el-table-column align="center" prop="productQuantity" label="数量" width="150" />
            <el-table-column fixed="right" align="center" prop="totalPrice" label="小计" width="150" />
          </el-table>
        </div>
        <el-divider />
        <div>
          <div>
            费用信息
          </div>
          <OrderTable :table-data="costData" />
        </div>
        <el-divider v-if="status>1" />

        <div v-if="status > 1" class="table-main">
          <div class="table-title">
            物流信息:
            <span style="color: gray">{{ detailObj && detailObj.deliveryCompany }} [
              {{ detailObj && detailObj.deliverySn }} ]</span>
          </div>
          <el-table :data="expressData" border stripe style="width: 100%; margin-top: 25px">
            <el-table-column prop="AcceptTime" label="时间" width="180" />
            <el-table-column prop="AcceptStation" label="状态" />
            <el-table-column prop="Remark" label="备注" width="450" />
          </el-table>
        </div>
        <el-divider />

        <el-form ref="form" :model="form" :rules="rules" class="form-lable" :inline="false" size="mini">
          <el-row v-if="status === 1" :gutter="20">
            <el-col :span="6" :offset="0">
              <el-form-item prop="deliveryCompany" label="物流公司">
                <el-select v-model="form.deliveryCompany" class="myInput" size="mini" placeholder="请选择物流公司" clearable>
                  <el-option v-for="(item,index) in options" :key="index" :label="item.name" :value="item.name" />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="6" :offset="0">
              <el-form-item prop="deliverySn" label="物流单号">
                <el-input v-model="form.deliverySn" class="myInput" placeholder="" size="mini" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-button v-if="status === 1" type="primary" style="width: 150px" size="small" @click="sendOrder">确认发货</el-button>
        <div class="placeholder" />

      </div>
    </el-card>
  </div>
</template>

<script>
import orderListApi from '@/api/orderManage/orderList/index'
import kdExpressData from '@/views/orderManage/orderList/orderDetail/kdExpress'
export default {
    name: '',
    data() {
        return {
            detailObj: {},
            options: [
                {
                    id: 0,
                    name: '顺丰快递'
                },
                {
                    id: 1,
                    name: '韵达快递'
                },
                {
                    id: 2,
                    name: '中国邮政'
                },
                {
                    id: 3,
                    name: '申通快递'
                },
                {
                    id: 4,
                    name: '中通快递'
                }
            ],
            form: {
                deliverySn: '',
                deliveryCompany: ''
            },
            rules: {
                deliveryCompany: [
                    {
                        required: true,
                        message: '请填写物流公司',
                        trigger: 'change'
                    }
                ],
                deliverySn: [
                    {
                        required: true,
                        message: '请填写物流单号',
                        trigger: 'blur'
                    }
                ]
            },
            forceSendShow: true,
            pageLoading: true,
            statusTrans: {
                0: '待付款',
                1: '待发货',
                2: '已发货',
                3: '已完成',
                4: '已关闭'
            },
            id: '',
            status: 0, // 当前状态
            stepList: [{ name: '待付款' }, { name: '待发货' }, { name: '已发货' }],
            orderBaseObj: {},
            orderItemList: [], // 商品列表
            orderTableData: [], // 基本信息 mail-table  订单信息
            userTableData: [], // 基本信息 mail-table  收货人信息
            costData: [] // 基本信息 mail-table  收货人信息
            // orderTableData: [
            //     { key: '单号', value: '1001' },
            //     { key: '商品名称', value: '篮球' },
            //     { key: '价格', value: '120.00' },
            //     { key: '订单日期', value: '2017-03-01' },
            //     { key: '付款方式', value: '在线支付' },
            //     { key: '收货地址', value: '北京市海淀区西北旺镇' },
            //     { key: '收货地址', value: '北京市海淀区西北旺镇' },
            //     { key: '收货地址', value: '北京市海淀区西北旺镇' }
            // ],
        }
    },
    computed: {
        step() {
            // step 默认从1开始
            return this.status + 1
        },
        expressData() {
            return kdExpressData.Traces
        }
    },
    created() {
        this.id = this.$route.params.id
        this.getOrderDetail()
    },
    methods: {
    // 去退单列表
        goReturn(row) {
            this.$router.push({
                name: 'RefundList',
                params: { id: row.returnId }
            })
        },

        /* 确认发货 */
        sendOrder() {
            orderListApi.sendDone({
                orderId: this.id,
                deliverySn: this.form.deliverySn,
                deliveryCompany: this.form.deliveryCompany

            }).then(res => {
                console.log('res: ', res)
                if (res.success) {
                    this.$message.success('发货成功')
                } else {
                    this.$message.error('发货失败')
                }
            }).catch(res => {

            })
        },

        // 获取订单明细
        getOrderDetail() {
            orderListApi
                .orderDetail(this.id)
                .then((res) => {
                    if (res.success) {
                        this.detailObj = res.data.orderDetail.orderBase
                        // 一个订单可能包含好几个商品
                        this.orderItemList = res.data.orderDetail.orderItems
                        // 初始化订单信息
                        this.initOrderObj()
                        // 初始化用户信息
                        this.initUserObj()
                        // 初始化进度条信息
                        this.initStepList()
                        // 初始化费用信息
                        this.initCostObj()
                        // 判断是否可以强制收货
                        this.judgeForce()
                    } else {
                        this.$message('获取信息错误')
                    }
                })
                .catch((res) => {})
        },
        judgeForce() {
            // 循环商品的列表
            // 判断是否可以发货
            this.orderItemList.forEach((element) => {
                // isReturn===1的时候是退货商品 0的时候是正常商品
                // 0 是未付款
                if (element.isReturn === 0) {
                    this.forceSendShow = false
                }
            })
        },
        // 初始化订单Obj
        initOrderObj() {
            const orderObj = {
                订单金额: this.detailObj.totalAmount,
                订单编号: this.detailObj.orderSn,
                用户账号: this.detailObj.memberUsername,
                // 订单类型: this.detailObj.orderType === 1 ? '秒杀订单' : '正常订单',
                备注: this.detailObj.totalAmount,

                下单时间: this.detailObj.createTime,
                付款时间: this.detailObj.paymentTime,
                发货时间: this.detailObj.deliveryTime,
                收货时间: this.detailObj.receiveTime
            }
            // orderTableData
            // [{key:'',value:''},{key:'',value:''},{key:'',value:''}]
            for (const key in orderObj) {
                this.orderTableData.push({
                    key: key,
                    value: orderObj[key]
                })
            }
        },
        initUserObj() {
            const userObj = {
                收货人: this.detailObj.receiverName,
                用户姓名: this.detailObj.memberUsername,
                手机号码: this.detailObj.receiverPhone,
                邮政编码: this.detailObj.receiverPostCode,
                地市:
          this.detailObj.receiverProvince + ' ' + this.detailObj.receiverCity,
                详细地址: this.detailObj.receiverDetailAddress
            }

            // [{key:'',value:''},{key:'',value:''},{key:'',value:''}]
            for (const key in userObj) {
                this.userTableData.push({
                    key: key,
                    value: userObj[key]
                })
            }
        },
        initCostObj() {
            const costObj = {
                运费金额: 0,
                订单总金额: this.detailObj.totalAmount,
                实际金额: this.detailObj.payAmount,
                促销优化金额: this.detailObj.promotionAmount
                    ? this.detailObj.promotionAmount
                    : 0
            }
            for (const key in costObj) {
                this.costData.push({
                    key: key,
                    value: costObj[key]
                })
            }
        },
        // 初始化进度条信息
        initStepList() {
            // 添加一个属性 {name:'',time:''}
            this.stepList[0].time = this.detailObj.createTime
            this.stepList[1].time = this.detailObj.paymentTime
            this.stepList[2].time = this.detailObj.deliveryTime
            // this.stepList[3].time = this.detailObj.receiveTime
            // this.stepList[4].time = this.detailObj.finishTime
            this.status = this.detailObj.status
        }
    }
}
</script>

<style lang="scss" scoped>
.placeholder{
    height: 100px;
}
</style>
