<template>
  <div class="dashboard_wrapper">
    <div id="dashboard_main" ref="dashboard_main" class="dashboard-main">
      <div class="content-wrapper">
        <div class="top-main">
          <span class="fullScreenWraper">
            <svg-icon icon-class="full" @click="fullScreen" />
          </span>
          <div class="title">
            <span>数据大屏</span>
          </div>
          <div class="time">{{ timeText }}</div>
        </div>
        <div class="content-main">
          <!-- 左侧数据 -->
          <div class="content-left content-item">
            <div class="title">电商数据 <span>Shell Data</span></div>
            <div class="left-data">
              <div class="left-title">
                销售量
                <span class="num-unit">万元</span>
              </div>
              <div class="num-content">
                <countTo class="numDelay-style" :start-val="0" :end-val="numData.saleNum" :duration="5000" />
                <!-- 判断是否有小数点 -->
                <!-- <div
                  v-for="(item, index) in numData.saleNum"
                  :key="index"
                  :class="item === '.' ? 'dot' : 'num-div'"
                >
                  {{ item }}
                </div> -->
              </div>
            </div>
            <div class="left-data">
              <div class="left-title">完成百分比</div>
              <div class="pro-wrapper">
                <BfProgress :percentage="percentage" />
              </div>
            </div>

            <!-- 字符云 echarts -->
            <div class="title">热门搜索词 <span>Top Search</span></div>
            <div ref="wordsEcharts" class="words-echarts">
              <WordEcharts />
            </div>

          </div>
          <!-- 中间数据 -->
          <div class="content-center content-item">
            <!-- 柱状图echarts -->
            <div class="barEchartsBox">
              <BarEcharts />
              <!-- <MapEcharts :echarts-data="mapData" /> -->
            </div>
            <div class="bottom-charts-wrapper">
              <div class="item">
                <MapEcharts :echarts-data="mapData" />
              </div>
              <div class="item">
                <PieEcharts />
              </div>
            </div>
          </div>
          <!-- 右侧数据 -->
          <div class="content-right content-item">
            <div class="title">统计数据 <span>Statistics Data</span></div>
            <div class="statistics-content">
              <div v-for="item in numData.statisticsData" :key="item.id" class="statistics-item">
                <div class="left">
                  <img :src="item.img" alt="">
                </div>
                <div class="right">
                  <div class="wrapper">
                    <div class="value">{{ item.value }}</div>
                    <div class="text">{{ item.text }}</div>
                  </div>
                </div>
              </div>
            </div>
            <!-- table -->
            <div style="margin: 20px 0" class="title">
              大额订单Top <span>Supper Orders</span>
            </div>
            <div class="table-wrapper">
              <MyTable :table-data="tableData" />
            </div>
          </div>
        </div>
      </div>

      <!-- 底部动态背景 -->
      <div class="bottom-bg">
        <CanvasBg ref="canvasBg" />
      </div>
    </div>
  </div>
</template>

<script>
// 引入计数器缓动
import countTo from 'vue-count-to'
// 地图数据
import { mapData, statisticsData, tableData } from './dataJson.js'
// 引入table组件
import MyTable from './component/MyTable'
// 引入全屏插件
import screenfull from 'screenfull'
// 引入底部canvas动态效果
import CanvasBg from './component/CanvasBg'
// 引入地图echarts
import MapEcharts from './component/MapEcharts'
// 引入 柱状图echarts
import BarEcharts from './component/BarEcharts'
import PieEcharts from './component/PieEcharts'
import WordEcharts from './component/WordEcharts'
// 引入数字缓变方法
export default {
    components: {
        CanvasBg,
        MapEcharts,
        BarEcharts,
        PieEcharts,
        MyTable,
        WordEcharts,
        countTo
    },
    data() {
        return {
            initHeight: window._WH + 'px', // 最外层初始化高度
            timeText: '', // 时间显示
            timer: null, // 定时器(时间显示的)
            numData: {
                saleNum: 8888888, // 电商数据的 销售量(假数据)
                statisticsData: statisticsData // 统计数据(假数据)
            },
            percentage: 33, // 百分比
            mapData: mapData, // 地图数据

            tableData: tableData // 大额订单数据
        }
    },
    created() {
    // 设置定时器,展示 百分比变化
        setTimeout(() => {
            this.percentage = 100
        }, 3000)
        // 初始化时间
        this.timeText = this.formatDate(new Date())
    // 初始化数字缓动方法
    // this.initNumChange()
    // 监听window页面====================================
    // window.onresize = () => {
    //     this.changeScale()
    // }
    // //   监听是否全屏
    // screenfull.on('change', () => {
    //     setTimeout(() => {
    //         this.changeScale(1)
    //     }, 200)
    // })
    },
    mounted() {
    // 开始时间计时
        this.timeStart()
    },
    beforeDestroy() {
    // 自适应 关闭
        window.onresize = null
        // 离开页面前清除定时器
        if (this.timer) {
            clearInterval(this.timer)
        }
    },
    methods: {
        numChangeDelay(initNum) {
            // 先转换成string类型
            var numStr = initNum + ''
            // 打断点小数点
            var dotArr = numStr.split('.')
            // 为了去掉小数点,初始化倍数
            var mutiple = 1
            if (dotArr[1]) {
                // 倍数等于小数点后的小数的位数  **是指数的意思
                mutiple = 10 ** dotArr[1].length
            }
            // 去掉小数点后的数字
            var endNum = Number(initNum) * mutiple
            var startNum
            var numTimer = null
            if (endNum > 100000) {
                // 设置开始数字
                startNum = endNum - 100000
                // 展示的数字字符串
                this.numData.saleNum = startNum / mutiple + ''
                // 设置定时器
                numTimer = setInterval(() => {
                    // 每次变化100
                    startNum = startNum + 1000
                    this.numData.saleNum = startNum / mutiple + ''
                    // 当起始的数 和结束的数相差小于 变化值的时候 ,清除定时器
                    if (endNum - startNum < 1000) {
                        clearInterval(numTimer)
                    }
                }, 10)
            } else if (endNum > 100 && endNum < 100000) {
                // 设置开始数字
                startNum = endNum - 100
                // 展示的数字字符串
                this.numData.saleNum = startNum / mutiple + ''
                // 设置定时器
                numTimer = setInterval(() => {
                    // 每次变化100
                    startNum = startNum + 100
                    this.numData.saleNum = startNum / mutiple + ''
                    // 当起始的数 和结束的数相差小于 变化值的时候 ,清除定时器
                    if (endNum - startNum < 100) {
                        clearInterval(numTimer)
                    }
                }, 10)
            }
        },
        // 数字变化
        initNumChange() {
            // 销售量数据缓变
            this.numChangeDelay(this.numData.saleNum)
        },
        // 缩放比例
        changeScale(value) {
            // 获取当前需要展示大屏容器的dom
            var wrapper = document.querySelector('#dashboard_main')
            if (value === 1) {
                // 改变容器的大小scale
                wrapper.style.transform = `scale(1)`
                return
            } else {
                // 缩放比例
                var scaleBl = window.innerHeight / window._WH
                if (scaleBl >= 1) return
                wrapper.style.transform = `scale(${scaleBl})`

                // wrapper.style.zoom = scaleBl
            }
        },

        // 全屏
        fullScreen() {
            if (screenfull.isEnabled) {
                // 控制是否全屏的按钮
                screenfull.toggle(this.$refs.dashboard_main)
            }
        },
        timeStart() {
            // 设置定时器
            this.timer = setInterval(() => {
                this.timeText = this.formatDate(new Date())
            }, 1000)
        },
        // 格式化时间
        formatDate(date) {
            // 格式化时间为 YYYY-MM-DD HH:MM:SS
            var year = date.getFullYear()
            var month = date.getMonth() + 1
            var day = date.getDate()
            var hours = date.getHours()
            var minutes = date.getMinutes()
            var seconds = date.getSeconds()
            // 判断是不是小于10 返回01 02 03
            function check(num) {
                if (num < 10) {
                    // 如果数字小于10,前边拼接个0
                    return '0' + num
                } else {
                    return num
                }
            }
            // 时间展示
            return `
            ${check(year)}-
            ${check(month)}-
            ${check(day)} 
            ${check(hours)}:
            ${check(minutes)}:
            ${check(seconds)}`
        }
    }
}
</script>

<style scoped lang="scss">
.dashboard_wrapper {
  position: relative;
  width: 100%;
  //   background: url('~@/assets/dashboardBG.png') 100% 100% no-repeat;
  background-color: #0a1631;

  .dashboard-main {
    position: relative;
    width: 100%;
    // min-height: 900px;
    //   background: url('~@/assets/dashboardBG.png') 100% 100% no-repeat;
    background-color: #0a1631;
    .content-wrapper {
      // position: absolute;
      // top: 0;
      // left: 0;
      // width: 100%;
      // height: 100%;
      z-index: 100;
      .top-main {
        position: relative;
        overflow: hidden;
        width: 100%;
        height: 100px;
        //   background-color: red;
        .fullScreenWraper {
          position: absolute;
          left: 10px;
          top: 10px;
          font-size: 25px;
          color: #9aa8d4;
        }
        .title {
          margin: 0 auto;
          background: url('~@/assets/titleBG.png');
          background-size: 100% 100%;
          background-position: center;
          width: 70%;
          height: 122px;
          text-align: center;
          line-height: 100px;
          font-size: 36px;
          span {
            font-family: 'Microsoft Yahei', Arial, sans-serif;
            font-size: 36px;
            color: rgb(255, 255, 255);
            text-shadow: rgb(255, 255, 255) 0px 0px 15px;
            font-weight: bold;
          }
        }
        .time {
          position: absolute;
          right: 30px;
          top: 20px;
          margin-right: 20px;
          font-family: 'Microsoft Yahei', Arial, sans-serif;
          font-size: 20px;
          color: rgb(255, 255, 255);
          font-weight: normal;
          justify-content: center;
        }
      }
      .content-main {
        position: relative;
        width: 100%;
        height: 800px;
        .content-item {
          position: relative;
          float: left;
          overflow: hidden;
          box-sizing: border-box;
          // background-color: orange;
          padding: 10px 0 0 10px;
          width: 25%;
          //   height: 80%;
          .title {
            font-family: 'Microsoft Yahei', Arial, sans-serif;
            font-size: 22px;
            color: rgb(154, 168, 212);
            font-weight: normal;
            span {
              font-family: 'Microsoft Yahei', Arial, sans-serif;
              font-size: 20px;
              color: rgb(64, 77, 105);
              font-weight: normal;
              justify-content: center;
              text-align: center;
            }
          }
        }
        .content-left {
          .left-data {
            margin: 20px 0;
            .left-title {
              font-family: 'Microsoft Yahei', Arial, sans-serif;
              font-size: 16px;
              color: rgb(154, 168, 212);
              .num-unit {
                float: right;
                font-family: 'Microsoft Yahei', Arial, sans-serif;
                font-size: 16px;
                color: rgb(115, 170, 229);
                justify-content: center;
                text-align: center;
              }
            }

            .num-content {
              display: flex;
              //   margin-left: 10px;
              margin-top: 20px;
              align-items: center;
              justify-content: center;
              .numDelay-style {
                letter-spacing: 5px;
                font-size: 60px;
                font-weight: bold;
                color: rgb(255, 255, 255);
              }
              .num-div {
                font-family: 'Microsoft Yahei';
                font-size: 55px;
                font-weight: bold;
                color: rgb(255, 255, 255);
                margin-left: 3px;
                margin-right: 3px;
                box-sizing: content-box;
                width: 10%;
                text-align: center;
                background-color: rgb(15, 57, 107);
              }
              .dot {
                font-family: 'Microsoft Yahei';
                font-size: 55px;
                font-weight: bold;
                color: rgb(255, 255, 255);
                margin-left: 3px;
                margin-right: 3px;
              }
            }
            .pro-wrapper {
              margin: 0 auto;
              position: relative;

              width: 85%;
            }
          }
          .words-echarts {
            margin-top: 20px;
            position: relative;
            width: 100%;
            height: 390px;
            background-color: #16223c;
          }
        }
        .content-center {
          width: 50%;
          .barEchartsBox {
            width: 95%;
            margin: 0 auto;
            height: 360px;
          }
          .bottom-charts-wrapper {
            width: 95%;
            margin: 0 auto;
            height: 360px;
            overflow: hidden;
            .item {
              float: left;
              width: 50%;
              height: 360px;
              // background-color: red;
            }
          }
        }
        .content-right {
          box-sizing: border-box;
          padding-right: 10px;
          .statistics-content {
            position: relative;
            width: 100%;
            height: 150px;
            margin-top: 20px;

            .statistics-item {
              position: relative;
              float: left;
              width: 50%;
              height: 50%;
              //   background-color: red;
              .left {
                position: relative;
                float: left;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100%;
                width: 35%;
                img {
                  width: 80%;
                }
              }
              .right {
                position: relative;
                float: left;
                box-sizing: border-box;
                display: flex;
                // justify-content: center;
                align-items: center;
                height: 100%;
                width: 65%;
                padding-left: 15px;
                .wrapper {
                  .value {
                    font-family: 'Microsoft Yahei';
                    font-size: 32px;
                    font-weight: bold;
                    color: rgb(255, 255, 255);
                  }
                  .text {
                    margin-top: 4px;
                    font-family: 'Microsoft Yahei';
                    font-size: 12px;
                    color: rgb(176, 194, 249);
                    align-self: flex-start;
                  }
                }
                .table-wrapper {
                  position: relative;
                  width: 100%;
                }
              }
            }
          }
        }
      }
    }

    .bottom-bg {
      position: absolute;
      z-index: 1;
      // margin-top: -10px;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 25%;
    }
    .num-style {
      color: white;
    }
  }
}
</style>
