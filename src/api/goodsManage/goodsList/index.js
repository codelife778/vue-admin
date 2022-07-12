import request from '@/utils/request'

/* 查询商品列表 */
export function productsByPage(start, limit) {
    return request({
        url: `/lejuAdmin/product/productsByPage/${start}/${limit}`,
        method: 'post'
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
