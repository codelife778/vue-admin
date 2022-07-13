import request from '@/utils/request'

/* 查询商品列表 */
export function productsByPage(start, limit, data) {
    return request({
        url: `/lejuAdmin/product/productsByPage/${start}/${limit}`,
        method: 'post',
        data
    })
}

/* 获取品牌列表 */
export function findAllBrand() {
    return request({
        url: '/lejuAdmin/brand/findAllBrand'
    })
}

/* 获取商品分类 */
export function getAllCategory() {
    return request({
        url: '/lejuAdmin/category/getAllCategory'
    })
}

/* 根据id查询商品品牌详情 */
export function productSkusDetail(productId) {
    return request({
        url: `/lejuAdmin/product/productSkusDetail/${productId}`
    })
}

/* 添加商品信息 */
export function addProductAndSkus(data) {
    return request({
        url: '/lejuAdmin/product/addProductAndSkus',
        method: 'post',
        data
    })
}

/* 更新商品信息和sku */
export function updateProductAndSkus(data) {
    return request({
        url: '/lejuAdmin/product/updateProductAndSkus',
        method: 'post',
        data
    })
}

/* 删除商品信息 */
export function del(productId) {
    return request({
        url: `/lejuAdmin/product/del/${productId}`,
        method: 'delete'
    })
}

/* 更新分类商品信息 */
export function updateCategory(data) {
    return request({
        url: '/lejuAdmin/category/updateCategory',
        method: 'post',
        data
    })
}
