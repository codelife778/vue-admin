import request from '@/utils/request'

/* 查询素材列表 */

export function findMaterialByPage(start, limit) {
    return request({
        url: `/lejuAdmin/material/findMaterialByPage/${start}/${limit}`,
        method: 'get'
    })
}

/* 删除素材图片 */
export function delMaterial(id) {
    return request({
        url: `/lejuAdmin/material/delMaterial/${id}`,
        method: 'delete'
    })
}
