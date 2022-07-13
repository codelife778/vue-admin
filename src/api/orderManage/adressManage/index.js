import request from '@/utils/request'

/* 地址列表 */
function addressList() {
    return request({
        url: '/lejuAdmin/companyAddress/addressList'
    })
}

/* 新增地址 */
function save(data) {
    return request({
        url: '/lejuAdmin/companyAddress/save',
        method: 'post',
        data
    })
}

/* 更新地址 */
function update(data) {
    return request({
        url: '/lejuAdmin/companyAddress/update',
        method: 'post',
        data
    })
}

/* 设置收货默认 */
function setReceiveOne(data) {
    return request({
        url: '/lejuAdmin/companyAddress/setReceiveOne',
        method: 'post',
        data
    })
}

/* 设置fa货默认 */
function setSendOne(data) {
    return request({
        url: '/lejuAdmin/companyAddress/setSendOne',
        method: 'post',
        data
    })
}

/* 删除地址 */
function delCompanyAddress(id) {
    return request({
        url: `/lejuAdmin/companyAddress/${id}`,
        method: 'delete'

    })
}

/* 地址明细 */
function companyAddress(id) {
    return request({
        url: `/lejuAdmin/companyAddress/${id}`
    })
}

export default {
    addressList,
    save,
    update,
    setReceiveOne,
    setSendOne,
    delCompanyAddress,
    companyAddress

}
