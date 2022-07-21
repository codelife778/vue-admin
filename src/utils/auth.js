// import Cookies from 'js-cookie'

const TokenKey = 'bf-admin-token'
const InfoKey = 'user-info'
import store from '@/store'

export function getToken() {
    return JSON.parse(localStorage.getItem(TokenKey))
}

export function setToken(token) {
    return localStorage.setItem(TokenKey, JSON.stringify(token))
}

export function removeToken() {
    return localStorage.removeItem(TokenKey)
}

export function getUserInfo() {
    return JSON.parse(localStorage.getItem('InfoKey'))
}

export function setUserInfo(val) {
    return localStorage.setItem('InfoKey', JSON.stringify(val))
}

export function removeUserInfo() {
    return localStorage.removeItem('InfoKey')
}

// 清除vuex 用户权限路由信息等
export function removeVuexUserInfo() {
    store.commit('user/REMOVE_USERINFO')
}
