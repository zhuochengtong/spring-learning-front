import { createRouter, createWebHistory } from 'vue-router'

import Test from '@/views/Test.vue'
import Home from '@/views/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 新增重定向规则（必须放在最前面）
    {
      path: '/',
      redirect: '/login', // 添加根路径重定向
    },
    // ...其他路由配置...
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
    },
    {
      path: '/guest',
      name: 'guest',
      component: () => import('@/views/GuestView.vue'), // 需要创建该组件
      meta: {
        title: '游客模式',
        requiresAuth: false,
      },
    },
    {
      path: '/home',
      name: 'home',
      component: Home, // 需要创建该组件
      meta: {
        title: '主页',
        requiresAuth: false,
      },
      children: [
        // 添加菜单管理路由
        {
          path: '/system/menu',
          name: 'system-menu',
          component: () => import('@/views/system/MenuManage.vue'),
          meta: {
            title: '菜单管理',
            requiresAuth: true,
          },
        },
        {
          path: '/permission/user',
          name: 'UserManage',
          component: () => import('@/views/system/UserManage.vue'),
          meta: {
            title: '用户管理',
            icon: 'User'
          }
        },
        {
          path: '/file/user',
          name: 'FileManage',
          component: () => import('@/views/system/FileManage.vue'),
          meta: {
            title: '文件管理',
            icon: 'User'
          }
        },
        {
          path: '/file/viewFile',
          name: 'FileListManage',
          component: () => import('@/views/system/FileListManage.vue'),
          meta: {
            title: '文件列表',
            icon: 'User'
          }
        },
        // 添加404子路由，用于捕获/home下的所有未匹配路径
        {
          path: '/:pathMatch(.*)*',
          name: 'not-found-in-home',
          component: () => import('@/components/NotFound.vue'),
          meta: {
            title: '页面不存在',
            requiresAuth: false,
          },
        }
      ],
    },
    {
      path: '/test',
      name: 'test',
      component: Test,
      meta: {
        title: '测试页面',
        requiresAuth: false,
      },
      children: [
        // 动态路由将在菜单加载后添加
      ],
    },

    // 添加404路由
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/components/NotFound.vue'),
      meta: {
        title: '页面不存在',
        requiresAuth: false,
      },
    },
    // 添加重定向路由
    {
      path: '/redirect',
      component: Home,
      hidden: true,
      children: [
        {
          path: '/redirect/:path(.*)',
          component: () => import('@/views/Redirect.vue'),
        },
      ],
    },
  ],
})

// 在路由配置文件中添加全局前置守卫
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Spring Learning'
  const token = localStorage.getItem('token')
  
  // 如果访问的是登录页，直接放行
  if (to.path === '/login') {
    next()
    return
  }
  
  // 检查是否有token
  if (!token) {
    // 没有token，跳转到登录页
    next({
      path: '/login',
      query: { redirect: to.fullPath } // 保存要访问的路由
    })
    return
  }
  
  // 有token，继续访问
  next()
})

export default router
