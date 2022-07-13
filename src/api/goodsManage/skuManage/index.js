import request from '@/utils/request'

/* 添加品牌 */
function addBrand(data) {
    return request({
        url: '/lejuAdmin/brand/addBrand',
        method: 'post',
        data
    })
}

/* 删除品牌 */
function delBrand(id) {
    return request({
        url: `/lejuAdmin/brand/delBrand/${id}`,
        method: 'delete'
    })
}

/* 分页查询品牌 */
function findBrandByPage(start, limit) {
    return request({
        url: `/lejuAdmin/brand/findBrandByPage/${start}/${limit}`
    })
}

/* 显示与隐藏 */
function switchShowStatus(data) {
    return request({
        url: '/lejuAdmin/brand/switchShowStatus',
        method: 'post',
        data
    })
}

/* 更新品牌 */
function updateBrand(data) {
    return request({
        url: '/lejuAdmin/brand/updateBrand',
        method: 'post',
        data
    })
}

/* 根据商品添加库存信息 */
function addProductSkus(data) {
    return request({
        url: '/lejuAdmin/sku/addProductSkus',
        method: 'post',
        data
    })
}

/* 更新库存信息 */
function updateSkuInfo(data) {
    return request({
        url: '/lejuAdmin/sku/updateSkuInfo',
        method: 'post',
        data
    })
}

export default {
    addBrand,
    delBrand,
    findBrandByPage,
    switchShowStatus,
    updateBrand,
    addProductSkus,
    updateSkuInfo
}
