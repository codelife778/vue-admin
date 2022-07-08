import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken,getUserInfo } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist


// 改写, 不用vuex登录  用本地存储
router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()
  // debugger
  // 如果有token且跳转的是登录页面,免登录直接进入主页
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      // 如果有token跳转的不是登录页面, 先判断有没有用户信息
      // const hasGetUserInfo = store.getters.name
      const hasGetUserInfo = getUserInfo()
      console.log(hasGetUserInfo);
      // debugger
      // 有用户信息,放行
      if (hasGetUserInfo) {
        next()
      } else {
        // 有token但是没有用户信息
        // 重新登录
        Message.error(error || 'Has Error')
          next('/login')
          NProgress.done()

        // try {
        //   // get user info
        //   // await store.dispatch('user/getInfo')

        //   next()
        // } catch (error) {
        //   // 获取用户信息失败时 需要重新
        //   // remove token and go to login page to re-login
        //   // await store.dispatch('user/resetToken')
        //   Message.error(error || 'Has Error')
        //   next('/login')
        //   NProgress.done()
        // }
      }
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
