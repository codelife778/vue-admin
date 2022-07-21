import router from './router'
// import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
// import { getToken, clearUserCache } from '@/utils/myAuth'
import { getToken, getUserInfo } from '@/utils/auth' // get token from cookie

// import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

import store from '@/store'

NProgress.configure({
    showSpinner: false
}) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist
// 路由导航s
router.beforeEach(async(to, from, next) => {
    // start progress bar
    NProgress.start()

    // set page title
    document.title = getPageTitle(to.meta.title)
    //     // shtest
    // next()
    // return
    // 获取token
    var token = getToken()

    // 在有token的状态下
    if (token) {
        // 如果有token 且跳往登录页面,则放行,去登录页面

        // 保存的有token,重新打开项目,会直接进入主页
        if (to.path === '/login') {
            next('/')
            NProgress.done()
            // 放行之后,跳出这个函数
            return
        }
        // 判断权限,当动态路由数组不为空时,
        // 页面刷新时.vuex数据会清空,走else
        if (store.state.user.asyncRoutes.length > 0) {
            // 把当前页面的路由权限存入vuex
            if (to.meta && to.meta.permissionValues) {
                // permissionValues 控制页面级别的显示隐藏  permissionValues是页面按钮权限的值
                // 此时permissionValues有四个值
                store.commit('user/RESET_BTN_PERMI', to.meta.permissionValues)
            }
            next()
            // 动态路由数组为空
        } else {
            // 重新获取
            await store
                .dispatch('user/getInitMenus')
                .then((res) => {
                    // 把当前页面的按钮权限存储再vuex中
                    if (to.meta && to.meta.permissionValues) {
                        store.commit('user/RESET_BTN_PERMI', to.meta.permissionValues)
                    }
                    // 页面刷新,路由器中的路由的对象重新生成了,router中的缓存路径丢失了
                    next(to.path)
                    // next()
                })
                .catch((err) => {
                    // 如果code等于20001说明 路由有脏数据,需要初始化一次
                    // 当重新构建路由器时,数据发生了错误
                    if (err.code === 20001) {
                        Message.error('权限动态路由出错,请在资源管理初始化路由')
                        next()
                    } else {
                        Message.error('权限动态路由出错')
                        // clearUserCache()
                        next('/login')
                    }
                    NProgress.done()
                })
        }
    } else {
        /* has no token*/
        // 没有token 跳转的是登录页面,放行
        if (whiteList.indexOf(to.path) !== -1) {
            // in the free login whitelist, go directly
            next()
        } else {
            // 没有token 跳转的不是登录页面,回到登录页面
            // other pages that do not have permission to access are redirected to the login page.
            next('/login')
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    // finish progress bar
    NProgress.done()
})

// import router from './router'
// import store from './store'
// import { Message } from 'element-ui'
// import NProgress from 'nprogress' // progress bar
// import 'nprogress/nprogress.css' // progress bar style
// import { getToken, getUserInfo } from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'

// NProgress.configure({ showSpinner: false }) // NProgress Configuration

// const whiteList = ['/login'] // no redirect whitelist

// // 改写, 不用vuex登录  用本地存储
// router.beforeEach(async(to, from, next) => {
//     // start progress bar
//     NProgress.start()

//     // set page title
//     document.title = getPageTitle(to.meta.title)

//     // determine whether the user has logged in
//     const hasToken = getToken()
//     // debugger
//     // 如果有token且跳转的是登录页面,免登录直接进入主页
//     if (hasToken) {
//         if (to.path === '/login') {
//             // if is logged in, redirect to the home page
//             next({ path: '/' })
//             NProgress.done()
//         } else {
//             // 如果有token跳转的不是登录页面, 先判断有没有用户信息
//             // const hasGetUserInfo = store.getters.name
//             const hasGetUserInfo = getUserInfo()

//             // debugger
//             // 有用户信息,放行
//             if (hasGetUserInfo) {
//                 next()
//             } else {
//                 // 有token但是没有用户信息
//                 // 重新登录
//                 Message.error('Has Error')
//                 next('/login')
//                 NProgress.done()

//                 // try {
//                 //   // get user info
//                 //   // await store.dispatch('user/getInfo')

//                 //   next()
//                 // } catch (error) {
//                 //   // 获取用户信息失败时 需要重新
//                 //   // remove token and go to login page to re-login
//                 //   // await store.dispatch('user/resetToken')
//                 //   Message.error(error || 'Has Error')
//                 //   next('/login')
//                 //   NProgress.done()
//                 // }
//             }
//         }
//     } else {
//     /* has no token*/
//     // 没有token 跳转的是登录页面,放行
//         if (whiteList.indexOf(to.path) !== -1) {
//             // in the free login whitelist, go directly
//             next()
//         } else {
//             // 没有token 跳转的不是登录页面,回到登录页面
//             // other pages that do not have permission to access are redirected to the login page.
//             next('/login')
//             NProgress.done()
//         }
//     }
// })

// router.afterEach(() => {
//     // finish progress bar
//     NProgress.done()
// })
