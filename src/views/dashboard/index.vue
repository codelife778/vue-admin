<template>
  <div class="dashboard_wrapper">
    <div id="dashboard_main" ref="dashboard_main" class="dashboard-main">
      <div class="content-wrapper">
        <div class="top-main">
          <span class="fullScreenWraper">
            <svg-icon icon-class="full" @click="fullScreen" />
          </span>
          <div class="title">
            <span>不凡数据大屏</span>
          </div>
          <div class="time">{{ timeText }}</div>
        </div>
        <div class="content-main">
          <div class="content-left content-item">
            <div class="title">电商数据 <span>Shell Data</span></div>
            <div class="left-data">
              <div class="left-title">
                销售量
                <span class="num-unit">
                  万元
                </span>
              </div>
              <div class="num-content">
                <countTo class="numDelay-style" :start-val="0" :end-val="numData.saleNum" :duration="3000" />
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
            <div class="title">热门搜索词 <span>Top Search</span></div>
            <div ref="wordsEcharts" class="words-echarts">
              <WordEcharts />

            </div>

          </div>
          <!-- 中间数据 -->
          <div class="content-center content-item">
            <div class="barEchartsBox">
              <BarEcharts />
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

          <!-- 右 -->
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

      <div class="bottom-bg">
        <CanvasBg ref="canvasBg" />
      </div>

    </div>
  </div>
</template>

<script>
// 引入计数器缓动
import countTo from 'vue-count-to'
// 引入全屏插件
import screenfull from 'screenfull'
import WordEcharts from './components/WordEcharts.vue'
import BarEcharts from './components/BarEcharts'
import CanvasBg from './components/CanvasBg'
import MapEcharts from './components/MapEcharts'
import PieEcharts from './components/PieEcharts'
import { mapData, statisticsData, tableData } from './dataJson.js'
import MyTable from './components/MyTable'
export default {
    name: 'Dashboard',
    components: {
        countTo,
        WordEcharts,
        BarEcharts,
        CanvasBg,
        MapEcharts,
        PieEcharts,
        MyTable
    },
    data() {
        return {
            timeText: '',
            numData: {
                saleNum: 8888888, // 电商数据的 销售量(假数据)
                statisticsData: statisticsData // 统计数据(假数据)
            },
            percentage: 30,
            mapData: mapData,
            tableData: tableData // 大额订单数据
        }
    },
    computed: {},
    created() {
    // 设置定时器,展示 百分比变化
        setTimeout(() => {
            this.percentage = 88
        }, 3000)
        // 初始化时间
        this.timeText = this.formatDate(new Date())
    },
    mounted() {
    // 开始时间计时
        this.timeStart()
    },
    methods: {
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
        },
        fullScreen() {
            if (screenfull.isEnabled) {
                // 控制是否全屏的按钮
                screenfull.toggle(this.$refs.dashboard_main)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.dashboard_wrapper {
  position: relative;
  width: 100%;
  background-color: #0a1631;
  .dashboard-main {
    position: relative;
    width: 100%;
    background-color: #0a1631;
    .content-wrapper {
      .top-main {
        position: relative;
        overflow: hidden;
        width: 100%;
        height: 100px;
        .fullScreenWraper {
          position: absolute;
          left: 10px;
          top: 10px;
          font-size: 25px;
          color: #9aa8d4;
        }
        .title {
          // 父元素 width:100% 子元素 margin:0 auto
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
          // 宽度
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
        .content-right{
            box-sizing: border-box;
          padding-right: 10px;
          .statistics-content{
            margin-top: 20px;
            height: 150px;

            .statistics-item{
              position: relative;
              float: left;
              width: 50%;
              height: 50%;
              .left{
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
              .right{
                  display: flex;
                // justify-content: center;
                align-items: center;
                height: 100%;
                width: 65%;
                box-sizing: border-box;

                padding-left: 15px;

                .wrapper{
                  color:#ffffff;
                  .value{
                    font-family: 'Microsoft Yahei';
                    font-size: 32px;
                    font-weight: bold;

                  }
                  .text{
                    margin-top: 4px;
                    font-family: 'Microsoft Yahei';
                    font-size: 12px;
                    color: rgb(176, 194, 249);
                    align-self: flex-start;

                  }
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
      height: 30%;
    }
  }
}
</style>
