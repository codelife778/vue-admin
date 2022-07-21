import loginApi from '@/api/login'
import router from '@/router'
import { resetRouter } from '@/router'
import Layout from '@/layout'
import { Message } from 'element-ui'
const getDefaultState = () => {
    return {
        asyncRoutes: [], // 当前用户拥有的权限菜单列表,构建的动态路由
        btnPermissions: [] // 页面按钮级别的路由权限
    }
}

const state = getDefaultState()

const mutations = {
    //
    SET_ASYNC_ROUTES(state, asyncRoutes) {
        state.asyncRoutes = asyncRoutes
    },
    REMOVE_USERINFO(state) {
        state.asyncRoutes = []
        state.btnPermissions = []
        // todo 重置路由
    },
    // 重置按钮级别的权限
    RESET_BTN_PERMI(state, permissions) {
        state.btnPermissions = permissions
    },
    CLEAR_BTN_PEREMI(state) {
        state.btnPermissions = []
    }
}

const actions = {

    // 初始化菜单权限
    getInitMenus({ commit, state }) {
        // 利用返回的权限对象 构建路由对象
        function buildRoutes(routes, pList, parentRoute) {
            for (var i = 0; i < pList.length; i++) {
                var p = pList[i]
                // 菜单 1菜单 2按钮
                if (p.type === 1) {
                    // 声明一个路由对象
                    var route = {
                        path: p.path,
                        name: p.name
                    }

                    // 重定向
                    if (p.redirect) {
                        route.redirect = p.redirect
                    }
                    if (p.meta) {
                        // 字符串meta的值转对象形式
                        route.meta = JSON.parse(p.meta)
                    }
                    if (p.hidden) {
                        route.hidden = true
                    }
                    if (p.alwaysShow) {
                        route.alwaysShow = true
                    }

                    // 顶级路由
                    // 一级路由,菜单  控制component
                    if (p.pid === '0') {
                        route.component = Layout
                        // 二级菜单 或者是 按钮
                    } else {
                        // 页面路由  /content/article
                        // 配置参考: https://cn.vuejs.org/v2/guide/components-dynamic-async.html
                        // @/views/product/index => /product/index
                        // 如果是二级菜单
                        if (p.component) {
                            var path = p.component.replace(/^@\/views/, '')
                            // 闭包+立即执行  防止path因为懒加载 只显示最后的值
                            // import 引入组件 不支持路径是变量
                            route.component = (path => {
                                return (resolve) => {
                                // require 虽然支持变量 但必须有一个根文件夹
                                // 省略 return 二级菜单的component值不是字符串 component:require(['路径'])
                                    require([`@/views${path}`], resolve)
                                }
                            })(path)
                        }
                    }
                    // 为了避免comonent=null 的错误情况出现
                    // if (p.component) {
                    // 一个routes对象会没有component?
                    if (route.component) {
                        // 生成好的每一个路由对象都依次放入routes路由器中
                        routes.push(route)
                    }

                    if (p.children && p.children.length > 0) {
                        route.children = []
                        // 递归 第一个参数是容器 第二个参数是要放的值,第三个参数是父级
                        // 递归从这里进去,最后还要从这里出来
                        buildRoutes(route.children, p.children, route)
                    }
                    // }
                    // type=2 按钮
                } else {
                    // 按钮类型
                    // 把页面的 增删改查的 标识  添加到每一个 route对象的 meta.permissionValues[]
                    // 按钮节点不需要有children属性,删除父级的children属性
                    // 当上一层函数route.children = [] 时,带着这个属性来到下一层函数时,发现是按钮节点,此时不需要children属性
                    delete parentRoute.children
                    // 当父级的meta属性下不存在permissonValues时,
                    if (!parentRoute.meta.permissionValues) {
                        // 添加一个属性 permissionValues=[]
                        parentRoute.meta.permissionValues = []
                    }
                    // 按钮权限列表
                    // 把当前节点的permissionValue传给父级的permissonValue
                    // 每个页面都有四个按钮权限,都在children列表里面,把它拿出来作为路由对象的meta中的属性
                    // 此时每个页面路由meta中都有permissonVlaue属性
                    parentRoute.meta.permissionValues.push(p.permissionValue)
                }
            }
        }
        return new Promise((resolve, reject) => {
            loginApi.getInitMenus()
                .then(res => {
                    console.log('这是权限路由:', res)

                    if (res.success) {
                        // asyncRoutes array
                        var routes = [] // 最后生成的数组,暂时为空
                        var pList = res.data.permissionList
                        // 构建动态路由,递归目的:把数据库给我们的路由权限列表,转换成能用vue-router数据格式,

                        // 第一次调用没有第三个参数,因为没有父级,undefine
                        buildRoutes(routes, pList)
                        // 权限路由routes构建完成,下一步和静态路由合并
                        routes.push({ path: '*', redirect: '/404', hidden: true })
                        // 用于存储新增的动态路由 可以配合sidebar 生成菜单
                        // 动态路由routes构建完成,routes传给asyncRoutes
                        commit('SET_ASYNC_ROUTES', routes)
                        // 新增按钮显示权限bug
                        // 清空上一个路由列表,用静态路由替换上一个总的路由列表,目的为了把新生成的动态路由和静态路由合并
                        // debugger
                        // debugger
                        resetRouter()
                        // 这里用于构建完整路由, 这里可以拿到router
                        // 动态路由与静态路由合并,左边router静态路由,右边动态路由
                        // ⭐这玩意不是响应式的,添加了但是不显示,起作用的位置:layout=>coponent=>sideber=>index.vue
                        //
                        router.addRoutes(routes)

                        // 异步操作完成,进行下一步操作
                        resolve()
                    } else {
                        if (res.code === 20001) {
                            reject(res)
                        }
                    }
                })
        })
    }

}

export default {
    namespaced: true, // vuex命名空间
    state,
    mutations,
    actions
}

// import { login, logout, getInfo } from '@/api/user'
// import { getToken, setToken, removeToken } from '@/utils/auth'
// import { resetRouter } from '@/router'

// const getDefaultState = () => {
//     return {
//         token: getToken(),
//         name: '',
//         avatar: ''
//     }
// }

// const state = getDefaultState()

// const mutations = {
//     RESET_STATE: (state) => {
//         Object.assign(state, getDefaultState())
//     },
//     SET_TOKEN: (state, token) => {
//         state.token = token
//     },
//     SET_NAME: (state, name) => {
//         state.name = name
//     },
//     SET_AVATAR: (state, avatar) => {
//         state.avatar = avatar
//     }
// }

// const actions = {
//     // user login
//     // 从登录页面传过来两个参数(user/login,this.loginForm)
//     // {commit} 简写形式
//     login({ commit }, userInfo) {
//         const { username, password } = userInfo
//         return new Promise((resolve, reject) => {
//             login({ username: username.trim(), password: password })
//                 .then((response) => {
//                     const { token } = response.data

//                     commit('SET_TOKEN', token)

//                     setToken(token)
//                     const name = response.data.userInfo.username
//                     const avatar = response.data.userInfo.icon

//                     commit('SET_NAME', name)

//                     commit('SET_AVATAR', avatar)
//                     resolve()
//                 })
//                 .catch((error) => {
//                     reject(error)
//                 })
//         })
//     },

//     // get user info
//     // 上面login函数设置了用户信息以后getInfo就不会被调用了
//     getInfo({ commit, state }) {
//         return new Promise((resolve, reject) => {
//             getInfo(state.token)
//                 .then((response) => {
//                     const { data } = response

//                     if (!data) {
//                         return reject('Verification failed, please Login again.')
//                     }

//                     const { name, avatar } = data

//                     commit('SET_NAME', name)
//                     commit('SET_AVATAR', avatar)
//                     resolve(data)
//                 })
//                 .catch((error) => {
//                     reject(error)
//                 })
//         })
//     },

//     // user logout
//     logout({ commit, state }) {
//         removeToken() // must remove  token  first
//         resetRouter()
//         commit('RESET_STATE')
//         // return new Promise((resolve, reject) => {
//         //   logout(state.token).then(() => {

//     //     resolve()
//     //   }).catch(error => {
//     //     reject(error)
//     //   })
//     // })
//     },

//     // remove token
//     resetToken({ commit }) {
//         return new Promise((resolve) => {
//             removeToken() // must remove  token  first
//             commit('RESET_STATE')
//             resolve()
//         })
//     }
// }

// export default {
//     namespaced: true,
//     state,
//     mutations,
//     actions
// }
