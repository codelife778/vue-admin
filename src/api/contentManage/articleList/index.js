import request from '@/utils/request'

/* 查询文章列表 */
export function findArticles(start, limit, data) {
    return request({
        url: `/lejuAdmin/productArticle/findArticles/${start}/${limit}`,
        method: 'post',
        data
    })
}

/* 更新文章显示状态 */

export function changeShowStatus(data) {
    return request({
        url: '/lejuAdmin/productArticle/changeShowStatus',
        method: 'post',
        data
    })
}

/* 根据id查询文章明细 */

export function productArticle(id) {
    return request({
        url: `/lejuAdmin/productArticle/productArticle/${id}`
    })
}
