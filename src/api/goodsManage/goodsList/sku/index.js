import request from '@/utils/request'

/* 增加sku */
function addProductSkus(data) {
    return request({
        url: '/lejuAdmin/sku/addProductSkus',
        method: 'post',
        data
    })
}

/* 删除sku */
function delSku(skuId) {
    return request({
        url: `/lejuAdmin/sku/delSku/${skuId}`,
        method: 'delete'
    })
}

/* 根据id查询库存 */
function getSkusByProductId(productId) {
    return request({
        url: `/lejuAdmin/sku/getSkusByProductId/${productId}`
    })
}

/* 更新sku */
function updateSkuInfo(data) {
    return request({
        url: '/lejuAdmin/sku/updateSkuInfo',
        method: 'post',
        data
    })
}

export default {
    addProductSkus,
    delSku,
    getSkusByProductId,
    updateSkuInfo

}
