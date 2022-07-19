<template>
  <div class="pro-main">
    <div class="num" :style="{left:per}">
      {{ percentage }}%
    </div>
    <div class="pro-bar">
      <div class="pro-inner" :style="{width:per}" />
    </div>
    <div class="triangle" :style="{left:per}" />
  </div>
</template>

<script>
export default {
    name: '',
    props: ['percentage'],
    data() {
        return {

        }
    },
    computed: {
        per() {
            return this.percentage + '%'
        }
    },
    methods: {

    }
}
</script>

<style lang="scss" scoped>
.pro-main{
    position: relative;
  margin: 20px auto;
  width: 100%;
  // background-color: red;
  height: 50px;
    .num{
         font-family: 'Microsoft Yahei';
    position: absolute;
    font-size: 20px;
    font-weight: bold;
    color: rgb(255, 255, 255);
    width: 45px;
    text-align: center;
    margin-left: -30px;
    transition: ease 2s all;
    }
    .pro-bar{
         position: absolute;
    top: 65%;
    transform: translate(0, -50%);
    width: 100%;
    height: 10px;
    border-radius: 5px;
    background-color: #283052;
        .pro-inner{
            transition: ease 2s all;

      // width: 77%;
      border-radius: 5px;
      height: 10px;
      background: linear-gradient(
        to right,
       gold 30%,
       red  60%,
       green 80%
      );
        }
    }
    .triangle{
        transition: ease 2s all;

    position: absolute;
    top: 40px;

    margin-left: -10px;
    width: 0;
    height: 0;
    border-top: 0 solid transparent;
    border-right: 10px solid transparent;
    border-left: 10px solid transparent;
    border-bottom: 10px solid #ffffff;
    }
}
</style>
