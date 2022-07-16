import request from '@/utils/request'

/* 获取营销列表 */
function findAllRecommends() {
    return request({
        url: '/lejuAdmin/homeRecommend/findAllRecommends'
    })
}

/* 添加限时活动 */
function addRecommend() {
    return request({
        url: '/lejuAdmin/homeRecommend/addRecommend',
        method: 'post'
    })
}

/* 删除限时活动 */
function delRecommend(recommendId) {
    return request({
        url: ` /lejuAdmin/homeRecommend/delRecommend/${recommendId}`,
        method: 'delete'
    })
}

export default {
    findAllRecommends,
    addRecommend,
    delRecommend
}
