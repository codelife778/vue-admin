import request from '@/utils/request'

/* 获取订单列表 */
function findOrdersByPage(start, limit, data) {
    return request({
        url: `/lejuAdmin/order/findOrdersByPage/${start}/${limit}`,
        method: 'post',
        data
    })
}

/* 获取订单明细 */
function orderDetail(orderId) {
    return request({
        url: `/lejuAdmin/order/orderDetail/${orderId}`
    })
}

export default {
    findOrdersByPage,
    orderDetail
}
