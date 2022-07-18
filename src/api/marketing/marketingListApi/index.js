import request from '@/utils/request'

/* 获取营销列表 */
function findAllRecommends() {
    return request({
        url: '/lejuAdmin/homeRecommend/findAllRecommends'
    })
}

/* 添加限时活动 */
function addRecommend(data) {
    return request({
        url: '/lejuAdmin/homeRecommend/addRecommend',
        method: 'post',
        data
    })
}

/* 删除限时活动 */
function delRecommend(recommendId) {
    return request({
        url: `/lejuAdmin/homeRecommend/delRecommend/${recommendId}`,
        method: 'delete'
    })
}

/* 获取品牌列表 */
function findAllBrand() {
    return request({
        url: '/lejuAdmin/brand/findAllBrand'

    })
}

/* 查询商品列表 */
export function productsByPage(start, limit, data) {
    return request({
        url: `/lejuAdmin/product/productsByPage/${start}/${limit}`,
        method: 'post',
        data
    })
}

export default {
    findAllRecommends,
    addRecommend,
    delRecommend,
    findAllBrand,
    productsByPage
}
