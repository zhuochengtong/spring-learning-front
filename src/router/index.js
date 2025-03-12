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
        // 动态路由将在菜单加载后添加
       ]
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
      ]
    },
  ],
})

// 在导出路由前添加
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '默认标题'
  next()
})

export default router
