import request from '@/utils/request'

/* 查询订单列表 */

function findReturnApply(start, limit, data) {
    return request({
        url: `/lejuAdmin/orderReturn/findReturnApply/${start}/${limit}`,
        method: 'post',
        data
    })
}

/* 同意退货 */
function agreeApply(id, data) {
    return request({
        url: `/lejuAdmin/orderReturn/agreeApply/${id}`,
        method: 'post',
        data
    })
}

/* 拒绝退货 */
function rejectApply(id) {
    return request({
        url: `/lejuAdmin/orderReturn/rejectApply/${id}`,
        method: 'post'
    })
}

/* 退单明细 */
function orderReturn(id) {
    return request({
        url: `/lejuAdmin/orderReturn/${id}`
    })
}

/* 收到退货=>确认收货 */
function receiveProduct(id, data) {
    return request({
        url: `/lejuAdmin/orderReturn/receiveProduct/${id}`,
        method: 'post',
        data
    })
}

export default {
    findReturnApply,
    agreeApply,
    rejectApply,
    orderReturn,
    receiveProduct
}
