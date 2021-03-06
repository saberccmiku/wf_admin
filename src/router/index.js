import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import chartsRouter from './modules/charts'
import modelRouter from './modules/model'
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
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */
const language =
  localStorage.getItem('language') ||
  (navigator.language === 'zh-CN' ? 'zh-CN' : 'en-US')
/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '主页', icon: 'dashboard', affix: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  modelRouter,
  {
    path: '/instance',
    component: Layout,
    redirect: '/instance/list',
    name: 'instance',
    meta: {
      title: '实例管理',
      icon: 'example'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/instance/list'),
        name: 'ArticleList',
        meta: { title: '实例列表', icon: 'list' }
      },
      {
        path: 'create',
        component: () => import('@/views/instance/create'),
        name: 'CreateArticle',
        meta: { title: '异常反馈', icon: 'edit' }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/instance/edit'),
        name: 'EditArticle',
        meta: {
          title: 'Edit Article',
          noCache: true,
          activeMenu: '/instance/list'
        },
        hidden: true
      }
    ]
  },
  {
    path: '/formManager',
    component: Layout,
    redirect: to => ({ name: 'formManager', params: { lang: language }}),
    alwaysShow: true, // will always show the root menu
    name: 'formManager',
    meta: {
      title: '表单管理',
      icon: 'excel'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/form/list'),
        name: 'formList',
        meta: {
          title: '表单列表',
          icon: 'education'
        }
      },
      {
        path: 'desigin/zh-CN',
        component: () => import('@/views/form/desigin'),
        name: 'formDesigin',
        meta: {
          title: '表单设计',
          icon: 'clipboard'
        },
        hidden: true
      },
      {
        path: 'desigin/zh-CN/:id',
        component: () => import('@/views/form/desigin'),
        name: 'formDesigin',
        meta: {
          title: '表单设计',
          icon: 'clipboard'
        }
      },
      {
        path: 'test',
        component: () => import('@/views/form/test'),
        name: 'test',
        meta: {
          title: '测试',
          icon: 'list'
        }
      }
    ]
  },
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/page',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: '权限管理',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'page',
        component: () => import('@/views/permission/role'),
        name: 'PagePermission',
        meta: {
          title: '角色列表'
        }
      },
      {
        path: 'list',
        component: () => import('@/views/permission/list'),
        name: 'roleList',
        meta: {
          title: '角色项'
        }
      }
    ]
  },

  /** when your routing map is too long, you can split it into small modules **/
  chartsRouter,
  {
    path: '/icons',
    component: Layout,
    redirect: '/icons/index',
    alwaysShow: true, // will always show the root menu
    name: 'icons',
    meta: {
      title: '图库',
      icon: 'icon'
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/icons/index'),
        name: 'IconsIndex',
        meta: {
          title: '图标列表',
          icon: 'list'
        }
      }
    ]
  },
  {
    path: '/interfaces',
    component: Layout,
    redirect: '/interfaces/index',
    alwaysShow: true, // will always show the root menu
    name: 'interfaces',
    meta: {
      title: '接口文档',
      icon: 'icon'
    },
    children: [
      {
        path: 'interfaces',
        component: () => import('@/views/interface/index'),
        name: 'IconsIndex',
        meta: {
          title: '接口列表',
          icon: 'list'
        }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
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
  router.matcher = newRouter.matcher // reset router
}

export default router
