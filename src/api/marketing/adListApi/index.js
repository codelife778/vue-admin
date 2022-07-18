import request from '@/utils/request'

/* 查看广告列表 */
function adsList() {
    return request({
        url: '/lejuAdmin/advertise/adsList'
    })
}

/* 新增广告 */
function addAds(data) {
    return request({
        url: '/lejuAdmin/advertise/addAds',
        method: 'post',
        data
    })
}

function delAds(adsId) {
    return request({
        url: `/lejuAdmin/advertise/delAds/${adsId}`
    })
}

function updateAds(data) {
    return request({
        url: '/lejuAdmin/advertise/updateAds',
        method: 'post',
        data
    })
}

export default {
    adsList,
    addAds,
    delAds,
    updateAds
}
