const KEY = 'token'
const USER_KEY = 'user_info'
import store from '@/store'
// 设置token
export function setToken(value) {
    if (!value) return
    window.localStorage.setItem(KEY, value)
}
// 获取token
export function getToken() {
    var tokenStr = window.localStorage.getItem(KEY)
    if (!tokenStr || tokenStr === 'undefined' || tokenStr === null) {
        return null
    } else {
        return tokenStr
    }
}
// 删除token
export function removeToken() {
    window.localStorage.removeItem(KEY)
}
// 保存用户信息
export function setUserInfo(userInfo) {
    if (!userInfo) return
    var userInfoStr = JSON.stringify(userInfo)
    window.localStorage.setItem(USER_KEY, userInfoStr)
}
// 获取用户信息
export function getUserInfo() {
    const userInfoStr = window.localStorage.getItem(USER_KEY)
    if (!userInfoStr || userInfoStr === 'undefined' || userInfoStr === null) {
        return null
    } else {
        var userInfo = JSON.parse(userInfoStr)
        return userInfo
    }
}

export function removeUserInfo() {
    window.localStorage.removeItem(USER_KEY)
}
// 清除vuex 用户权限路由信息等
export function removeVuexUserInfo() {
    store.commit('user/REMOVE_USERINFO')
}
// 清除登录信息
export function clearUserCache() {
    removeToken()
    removeUserInfo()
    removeVuexUserInfo()
}
