import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
    {
        path: '/login',
        component: () => import('@/views/login/index'),
        hidden: true
    },

    {
        path: '/404',
        component: () => import('@/views/404'),
        hidden: true
    },

    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [
            {
                path: 'dashboard',
                name: 'Dashboard',
                component: () => import('@/views/dashboard/index'),
                meta: { title: '主页', icon: 'dashboard' }
            }
        ]
    },
    {

        path: '/authority',
        component: Layout,
        redirect: '/authority/account',
        name: 'Authority',
        meta: { title: '权限管理', icon: 'el-icon-s-help' },
        children: [
            {
                path: 'account',
                name: 'Account',
                component: () => import('@/views/authority/account/index'),
                meta: { title: '账号管理', icon: 'table' }
            },
            {
                path: 'role',
                name: 'Role',
                component: () => import('@/views/authority/role/index'),
                meta: { title: '角色管理', icon: 'table' }
            },
            {
                path: 'resource',
                name: 'Resource',
                component: () => import('@/views/authority/resource/index'),
                meta: { title: '资源管理', icon: 'table' }
            }
        ]
    }
    // {

    //     path: '/authority',
    //     component: Layout,
    //     redirect: '/authority/account',
    //     name: 'Authority',
    //     meta: { title: '权限管理', icon: 'el-icon-s-help' },
    //     children: [
    //         {
    //             path: 'account',
    //             name: 'Account',
    //             component: () => import('@/views/authority/account/index'),
    //             meta: { title: '账号管理', icon: 'table' }
    //         },
    //         {
    //             path: 'role',
    //             name: 'Role',
    //             component: () => import('@/views/authority/role/index'),
    //             meta: { title: '角色管理', icon: 'table' }
    //         },
    //         {
    //             path: 'resource',
    //             name: 'Resource',
    //             component: () => import('@/views/authority/resource/index'),
    //             meta: { title: '资源管理', icon: 'table' }
    //         }
    //     ]
    // },
    // {
    //     path: '/goodsManage',
    //     component: Layout,
    //     redirect: '/goodsManage/goodsList',
    //     name: 'GoodsManage',
    //     meta: { title: '商品管理', icon: 'el-icon-s-help' },
    //     children: [
    //         {
    //             path: 'goodsList',
    //             name: 'GoodsList',
    //             component: () => import('@/views/goodsManage/goodsList/index'),
    //             meta: { title: '商品列表', icon: 'table' }
    //         },
    //         {
    //             path: 'goodsCategory',
    //             name: 'GoodsCategory',
    //             component: () => import('@/views/goodsManage/goodsCategory/index'),
    //             meta: { title: '商品分类', icon: 'table' }
    //         },
    //         {
    //             path: 'skuManage',
    //             name: 'SkuManage',
    //             component: () => import('@/views/goodsManage/skuManage/index'),
    //             meta: { title: '品牌管理', icon: 'table' }
    //         },
    //         {
    //             path: 'detail/:id',
    //             name: 'editorDetail',
    //             // 不在左侧导航栏显示
    //             hidden: true,
    //             component: () => import('@/views/goodsManage/goodsList/detail/index'),
    //             meta: {
    //                 title: '商品编辑',
    //                 icon: 'table',
    //                 activeMenu: '/product/list',
    //                 componentUrl: '@/views/product/detail/index'
    //             }
    //         },
    //         {
    //             path: 'detail',
    //             name: 'addDetail',
    //             // 不在左侧导航栏显示
    //             hidden: true,
    //             component: () => import('@/views/goodsManage/goodsList/detail/index'),
    //             meta: {
    //                 title: '商品增加',
    //                 icon: 'table',
    //                 activeMenu: '/product/list',
    //                 componentUrl: '@/views/product/detail/index'
    //             }
    //         }
    //     ]
    // },
    // {
    //     path: '/orderManage',
    //     component: Layout,
    //     redirect: '/orderManage/addressManage',
    //     name: 'OrderManage',
    //     meta: { title: '订单管理', icon: 'el-icon-s-help' },
    //     children: [
    //         {
    //             path: 'addressManage',
    //             name: 'AddressManage',
    //             component: () => import('@/views/orderManage/addressManage/index'),
    //             meta: { title: '地址管理', icon: 'table' }
    //         },

    //         {
    //             path: 'orderList',
    //             name: 'OrderList',
    //             component: () => import('@/views/orderManage/orderList/index'),
    //             meta: { title: '订单列表', icon: 'table' }
    //         },
    //         {
    //             path: 'orderDetail/:id',
    //             name: 'OrderDetail',
    //             hidden: true,
    //             component: () =>
    //       import('@/views/orderManage/orderList/orderDetail/index'),
    //             meta: { title: '订单详情', icon: 'table' }
    //         },
    //         {
    //             path: 'refundList',
    //             name: 'RefundList',
    //             component: () => import('@/views/orderManage/refundList/index'),
    //             meta: { title: '退单列表', icon: 'table' }
    //         },
    //         {
    //             path: 'refundDetail/:id',
    //             name: 'RefundDetail',
    //             hidden: true,
    //             component: () =>
    //       import('@/views/orderManage/refundList/refundDetail/index'),
    //             meta: { title: '退货详情', icon: 'table' }
    //         }
    //     ]
    // },
    // {
    //     path: '/registerUserManage',
    //     component: Layout,
    //     redirect: '/registerUserManage/registerUserList',
    //     name: 'registerUserManage',
    //     meta: { title: '注册用户管理', icon: 'el-icon-s-help' },
    //     alwaysShow: true,

    //     children: [
    //         {
    //             path: 'registerUserList',
    //             name: 'RegisterUserList',
    //             component: () =>
    //       import('@/views/registerUserManage/registerUserList/index'),
    //             meta: { title: '用户列表', icon: 'table' }
    //         }
    //     ]
    // },
    // {
    //     path: '/marketing',
    //     component: Layout,
    //     redirect: '/marketing/marketingList',
    //     name: 'marketing',
    //     meta: { title: '营销管理', icon: 'el-icon-goods' },
    //     alwaysShow: true,
    //     children: [
    //         {
    //             path: 'marketingList',
    //             name: 'MarketingList',
    //             component: () =>
    //                 import('@/views/marketing/marketingList'),
    //             meta: { title: '营销列表', icon: 'el-icon-files', componentUrl: '@/views/marketing/marketingList' }
    //         },
    //         {
    //             path: 'adList',
    //             name: 'AdList',
    //             component: () =>
    //                 import('@/views/marketing/adList'),
    //             meta: { title: '广告列表', icon: 'el-icon-files', componentUrl: '@/views/marketing/adList' }
    //         }

    //     ]
    // },
    // {
    //     path: '/contentManage',
    //     component: Layout,
    //     redirect: '/contentManage/articleList',
    //     name: 'ContentManage',
    //     meta: { title: '内容管理', icon: 'el-icon-s-help' },
    //     children: [
    //         {
    //             path: 'articleList',
    //             name: 'ArticleList',
    //             component: () => import('@/views/contentManage/articleList/index'),
    //             meta: { title: '文章列表', icon: 'table' }
    //         },
    //         {
    //             path: 'addArticle',
    //             name: 'AddArticle',
    //             hidden: true,
    //             component: () =>
    //       import('@/views/contentManage/articleList/editorArticle'),
    //             meta: { title: '增加文章', icon: 'table' }
    //         },
    //         {
    //             path: 'editorArticle/:id',
    //             name: 'EditorArticle',
    //             hidden: true,
    //             component: () =>
    //       import('@/views/contentManage/articleList/editorArticle'),
    //             meta: { title: '编辑文章', icon: 'table' }
    //         },
    //         {
    //             path: 'materialList',
    //             name: 'MaterialList',
    //             component: () => import('@/views/contentManage/materialList/index'),
    //             meta: { title: '素材列表', icon: 'tree' }
    //         }
    //     ]
    // },
    // {
    //     path: '/personCenter',
    //     component: Layout,
    //     redirect: '/personCenter/personHome',
    //     name: 'personCenter',
    //     meta: { title: '个人中心', icon: 'el-icon-s-help' },
    //     children: [
    //         {
    //             path: 'personHome',
    //             name: 'PersonHome',
    //             component: () => import('@/views/personCenter/personHome/index'),
    //             meta: { title: '个人主页', icon: 'table' }
    //         },
    //         {
    //             path: 'personSetting',
    //             name: 'PersonSetting',
    //             component: () => import('@/views/personCenter/personSetting/index'),
    //             meta: { title: '个人设置', icon: 'table' }
    //         }
    //     ]
    // },

    // {
    //     path: '/form',
    //     component: Layout,
    //     children: [
    //         {
    //             path: 'index',
    //             name: 'Form',
    //             component: () => import('@/views/form/index'),
    //             meta: { title: 'Form', icon: 'form' }
    //         }
    //     ]
    // },

    // {
    //     path: '/nested',
    //     component: Layout,
    //     redirect: '/nested/menu1',
    //     name: 'Nested',
    //     meta: {
    //         title: 'Nested',
    //         icon: 'nested'
    //     },
    //     children: [
    //         {
    //             path: 'menu1',
    //             component: () => import('@/views/nested/menu1/index'), // Parent router-view
    //             name: 'Menu1',
    //             meta: { title: 'Menu1' },
    //             children: [
    //                 {
    //                     path: 'menu1-1',
    //                     component: () => import('@/views/nested/menu1/menu1-1'),
    //                     name: 'Menu1-1',
    //                     meta: { title: 'Menu1-1' }
    //                 },
    //                 {
    //                     path: 'menu1-2',
    //                     component: () => import('@/views/nested/menu1/menu1-2'),
    //                     name: 'Menu1-2',
    //                     meta: { title: 'Menu1-2' },
    //                     children: [
    //                         {
    //                             path: 'menu1-2-1',
    //                             component: () =>
    //               import('@/views/nested/menu1/menu1-2/menu1-2-1'),
    //                             name: 'Menu1-2-1',
    //                             meta: { title: 'Menu1-2-1' }
    //                         },
    //                         {
    //                             path: 'menu1-2-2',
    //                             component: () =>
    //               import('@/views/nested/menu1/menu1-2/menu1-2-2'),
    //                             name: 'Menu1-2-2',
    //                             meta: { title: 'Menu1-2-2' }
    //                         }
    //                     ]
    //                 },
    //                 {
    //                     path: 'menu1-3',
    //                     component: () => import('@/views/nested/menu1/menu1-3'),
    //                     name: 'Menu1-3',
    //                     meta: { title: 'Menu1-3' }
    //                 }
    //             ]
    //         },
    //         {
    //             path: 'menu2',
    //             component: () => import('@/views/nested/menu2/index'),
    //             name: 'Menu2',
    //             meta: { title: 'menu2' }
    //         }
    //     ]
    // },

    // {
    //     path: 'external-link',
    //     component: Layout,
    //     children: [
    //         {
    //             path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
    //             meta: { title: 'External Link', icon: 'link' }
    //         }
    //     ]
    // },

    // // 404 page must be placed at the end !!!
    // { path: '*', redirect: '/404', hidden: true }
]

export const asyncRoutes = [

]

const createRouter = () =>
    new Router({
    // mode: 'history', // require service support
        scrollBehavior: () => ({ y: 0 }),
        routes: constantRoutes
    })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter()
    // 解构赋值,{addRoutes,match} = {addRoutes,match} 不是响应式?
    router.matcher = newRouter.matcher // reset router
}

export default router
