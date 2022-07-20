<template>
  <div
    v-loading="pageLoading" :element-loading-text="loadingOption.text"
    :element-loading-spinner="loadingOption.spinner" :element-loading-background="loadingOption.background"
    class="dashboard">
    <el-card shadow="never" class="card">
      <div slot="header">
        <el-row :gutter="20">
          <el-col v-for="(item, index) in headList" :key="index" :span="6" :offset="0">
            <el-card shadow="never" class="">
              <div class="text">
                {{ item.key }}: <span class="num">{{ item.value }}</span>
              </div>
              <div class="text">
                {{ item.key2 }}: <span class="num">{{ item.value2 }}</span>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <div class="echarts_wrapper">
        <div ref="orderEchartsBox" class="orderEchartsBox" />
        <div ref="orderReturnEchartsBox" class="orderEchartsBox" />
      </div>
    </el-card>
  </div>
</template>

<script>
import loginApi from '@/api/login'
import echarts from 'echarts'
import mixin from '@/mixins/index'
export default {
    name: 'Dashboard',
    mixins: [mixin],
    data() {
        return {
            pageLoading: false,
            headList: [],
            orderEchartsOption: {
                tooltip: {
                    trigger: 'axis',
                    formatter: function(params) {
                        var tar = params[0]

                        return '订单日期: ' + tar.name + '<br/>' + '订单数量: ' + tar.value
                    }
                },
                title: {
                    text: '订单柱状图'
                },
                toolbox: {
                    // y: 'bottom',
                    feature: {
                        magicType: {
                            type: ['stack', 'tiled']
                        },
                        dataView: {},
                        saveAsImage: {
                            pixelRatio: 2
                        }
                    }
                },
                xAxis: {
                    type: 'category',
                    axisLabel: {
                        interval: 0,
                        rotate: 40
                    },
                    data: []
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        data: [],
                        type: 'bar',
                        showBackground: false,
                        backgroundStyle: {
                            color: 'rgba(220, 220, 220, 0.8)'
                        }
                    }
                ]
            },
            orderReturnEchartsOption: {
                tooltip: {
                    trigger: 'axis',
                    formatter: function(params) {
                        var tar = params[0]

                        return '退单日期: ' + tar.name + '<br/>' + '退单数量: ' + tar.value
                    }
                },

                label: {
                    normal: {
                        show: true,
                        position: 'inside'
                    }
                },
                title: {
                    text: '退单柱状图'
                },
                toolbox: {
                    // y: 'bottom',
                    feature: {
                        magicType: {
                            type: ['stack', 'tiled']
                        },
                        dataView: {},
                        saveAsImage: {
                            pixelRatio: 2
                        }
                    }
                },
                xAxis: {
                    axisLabel: {
                        interval: 0,
                        rotate: 40
                    },
                    type: 'category',
                    data: []
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        data: [],
                        type: 'bar',
                        color: 'rgba(131,175,155,1)',
                        showBackground: false,
                        backgroundStyle: {
                            color: 'rgba(1, 223, 34, 0.8)'
                        }
                    }
                ]
            }
        }
    },
    computed: {},
    created() {
        var obj = {}
        if (obj) {
            console.log('1')
        } else {
            console.log('2')
        }
    },
    mounted() {
    // this.initOrderEcharts()
        this.getData()
    },
    methods: {
        getData() {
            this.pageLoading = true
            loginApi.getBaseData().then((res) => {
                if (res.success) {
                    this.initOrderEcharts(res)
                    this.initOrderReturnEcharts(res)
                    this.initHeadList(res.data)
                    this.pageLoading = false
                }
            })
        },
        initHeadList(data) {
            const user = {
                key: '今日新增用户量',
                value: data.userTodayCount,
                key2: '用户总量',
                value2: data.memberCount
            }
            const order = {
                key: '今日新增订单量',
                value: data.orderTodayCount,
                key2: '订单总量',
                value2: data.orderCount
            }
            const orderReturn = {
                key: '今日新增退单量',
                value: data.orderReturnTodayCount,
                key2: '退单总量',
                value2: data.orderReturnCount
            }
            const product = {
                key: '今日新增商品量',
                value: data.productTodayCount,
                key2: '商品总量',
                value2: data.productCount
            }
            this.headList = [user, order, orderReturn, product]
        },
        // 初始化订单柱状图
        initOrderEcharts(res) {
            const orderEcharts = echarts.init(this.$refs.orderEchartsBox)
            // 给X轴赋值
            this.orderEchartsOption.xAxis.data = res.data.orderBydayList.map(
                (item) => {
                    return item.date
                }
            )
            // 给Y轴赋值
            this.orderEchartsOption.series[0].data = res.data.orderBydayList.map(
                (item) => {
                    return item.count
                }
            )
            orderEcharts.setOption(this.orderEchartsOption)
        },
        initOrderReturnEcharts(res) {
            const orderReturnEcharts = echarts.init(this.$refs.orderReturnEchartsBox)
            // 给X轴赋值
            this.orderReturnEchartsOption.xAxis.data =
        res.data.orderReturnBydayList.map((item) => {
            return item.date
        })
            // 给Y轴赋值
            this.orderReturnEchartsOption.series[0].data =
        res.data.orderReturnBydayList.map((item) => {
            return item.count
        })
            console.log(this.orderReturnEchartsOption)
            orderReturnEcharts.setOption(this.orderReturnEchartsOption)
        }
    }
}
</script>

<style lang="scss" scoped>
.dashboard {
  .card {
    margin: 30px;
  }
  .text {
    margin-bottom: 15px;
    .num {
      color: rgb(64, 158, 255);
    }
  }
  .orderEchartsBox {
    // margin: 0 20px;
    width: 46%;
    height: 600px;
  }
  .echarts_wrapper {
    display: flex;
    position: relative;
    width: 100%;
    justify-content: space-between;
    //   background-color: red;
  }
}
</style>
