import request from '@/utils/request'

/* 是否最新 */
function switchNewStatus(data) {
    return request({
        url: '/lejuAdmin/product/switchNewStatus',
        method: 'post',
        data
    })
}

/* 是否预告 */
function switchPreviewStatus(data) {
    return request({
        url: '/lejuAdmin/product/switchPreviewStatus',
        method: 'post',
        data
    })
}

/* 发布状态 */
function switchPublishStatus(data) {
    return request({
        url: '/lejuAdmin/product/switchPublishStatus',
        method: 'post',
        data
    })
}

/* 推荐状态 */
function switchRecommandStatus(data) {
    return request({
        url: '/lejuAdmin/product/switchRecommandStatus',
        method: 'post',
        data
    })
}

/* 审核状态 */
function switchVerifyStatus(data) {
    return request({
        url: '/lejuAdmin/product/switchVerifyStatus',
        method: 'post',
        data
    })
}

export default {
    switchNewStatus,
    switchPreviewStatus,
    switchPublishStatus,
    switchRecommandStatus,
    switchVerifyStatus

}

