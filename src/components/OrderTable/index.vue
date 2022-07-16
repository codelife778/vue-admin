<template>
  <div>
    <el-row :gutter="10">
      <el-col v-for="(item,index) in tableData" :key="index" :span="6">
        <span>{{ item.key }}:</span>
        <span :class="{text:true,changeColor:item.key.indexOf('金额')!==-1}">{{ item.value }}</span>
        <el-button v-if="item.orderId" type="text" style="font-size:14px;margin-left:15px" size="small" @click="toCheckOrderDetail">查看订单详情</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
    name: '',
    props: {
        tableData: {
            type: Array,
            default() {
                return []
            }
        }
    },
    data() {
        return {

        }
    },
    methods: {
        toCheckOrderDetail() {

        }
    }
}
</script>

<style lang="scss" scoped>
</style>
