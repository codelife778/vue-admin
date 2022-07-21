import request from '@/utils/request'

function doLogin(data) {
    return request({
        url: '/lejuAdmin/index/login', // 相对路径
        method: 'post',
        data
    })
}

// 获取初始化用户菜单及权限
function getInitMenus() {
    return request({
        url: '/admin/sysAuth/index/getInitMenus',
        method: 'get'
    })
}
// 获取初始化用户菜单及权限
function getBaseData() {
    return request({
        url: '/lejuAdmin/dashboard/baseData',
        method: 'get'
    })
}

export default {
    doLogin,
    getInitMenus,
    getBaseData
}
