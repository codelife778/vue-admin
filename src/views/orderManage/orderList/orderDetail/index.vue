<template>
  <div>1</div>
</template>

<script>
import orderListApi from '@/api/orderManage/orderList/index'

export default {
    name: '',
    data() {
        return {
            id: ''
        }
    },
    created() {
        this.id = this.$route.params.id
        this.getOrderDetail()
    },
    methods: {
        getOrderDetail() {
            orderListApi.orderDetail(this.id).then(res => {
                console.log('res: ', res)
            })
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
