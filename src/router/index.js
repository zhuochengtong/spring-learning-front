import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 新增重定向规则（必须放在最前面）
    {
      path: '/',
      redirect: '/login', // 添加根路径重定向
    },
    // 原home路由保持不变
    {
      path: '/home',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
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
      component: () => import('@/views/Home.vue'), // 需要创建该组件
      meta: {
        title: '主页',
        requiresAuth: false,
      },
    },
  ],
})

// 在导出路由前添加
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '默认标题'
  next()
})

export default router
