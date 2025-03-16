<template>
  <div class="app-container">
    <!-- 头部 -->
    <el-header class="header">
      <div class="left-section">
        <el-image src="https://placeholder.com/logo.png" class="logo" />
        <h1 class="title">应用支撑平台</h1>
        <el-button type="primary" link class="grid-btn">
          <el-icon><Grid /></el-icon>
        </el-button>
      </div>

      <div class="right-section">
        <el-button type="primary" link class="app-switch">
          <el-icon><Connection /></el-icon>
          <span>应用切换</span>
        </el-button>
        <div class="action-buttons">
          <!-- 搜索按钮 -->
          <el-button type="primary" link>
            <el-icon><Search /></el-icon>
          </el-button>
          <!-- 收藏按钮 -->
          <el-button type="primary" link>
            <el-icon><Star /></el-icon>
          </el-button>
          <!-- 聊天会话按钮 -->
          <el-button type="primary" link>
            <el-icon><ChatDotRound /></el-icon>
          </el-button>
          <!-- 消息通知按钮 -->
          <el-button type="primary" link>
            <el-icon><Bell /></el-icon>
          </el-button>
          <!-- 扩展按钮 -->
          <el-button type="primary" link>
            <el-icon><Expand /></el-icon>
          </el-button>
          <!-- 添加刷新按钮 -->
          <el-button type="primary" link @click="refreshPage" title="刷新页面">
            <el-icon><RefreshRight /></el-icon>
          </el-button>
        </div>

        <el-dropdown>
          <span class="user-info">
            <el-avatar
              src="https://ai-public.mastergo.com/ai/img_res/a93bbe33fd3e1e553f303ad4f4dd93ec.jpg"
              class="avatar"
            />
            <span class="username">{{ userInfo.username }}</span>
            <el-icon><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>个人中心</el-dropdown-item>
              <el-dropdown-item divided @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>

    <div class="main-container">
      <!-- 侧边栏 -->
      <el-aside width="220px" class="sidebar">
        <!-- <menu-item> 标签就是使用了导入的MenuItem组件。这个组件接收一个 menu-item 属性，用于渲染菜单项 -->
        <el-menu
          :default-active="activeMenu"
          class="menu"
          background-color="#001529"
          text-color="#fff"
          active-text-color="#409EFF"
          :router="true"
        >
          <!-- 使用递归组件渲染菜单 -->
          <menu-item v-for="item in menuTree" :key="item.id" :menu-item="item" />
        </el-menu>
      </el-aside>

      <!-- 主内容 -->
      <el-main class="main-content">
        <!-- 面包屑 -->
        <div class="breadcrumb-container">
          <el-breadcrumb separator="/" class="breadcrumb">
            <el-breadcrumb-item :to="{ path: '/home' }">
              <el-icon><HomeFilled /></el-icon>
            </el-breadcrumb-item>
            <el-breadcrumb-item>{{ currentMenuTitle }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <!-- 内容区域 -->
        <router-view />
      </el-main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router' // 添加useRouter导入
import { ElLoading } from 'element-plus' // 添加ElLoading导入
import {
  Grid,
  Connection,
  Search,
  Plus,
  ArrowDown,
  User,
  Bell,
  Setting,
  RefreshRight,
  Expand,
  Star,
  ChatDotRound,
  Document,
  Monitor,
  Share,
  Lock,
  DataAnalysis,
  Headset,
  Menu,
  Avatar,
  InfoFilled,
  HomeFilled,
} from '@element-plus/icons-vue'
import { getMenuList } from '@/api/system/menu'
import { getUserInfo } from '@/api/system/login'
// 引入单独的菜单项组件
import MenuItem from '@/components/MenuItem.vue'

const route = useRoute()
const router = useRouter() // 现在这行不会报错了
const activeMenu = ref('')
const menuTree = ref([])

// 添加刷新页面方法
const refreshPage = () => {
  // 显示加载状态
  const loading = ElLoading.service({
    lock: true,
    text: '页面刷新中...',
    background: 'rgba(0, 0, 0, 0.7)',
  })

  // 刷新当前路由
  setTimeout(() => {
    router
      .replace({
        path: '/redirect' + route.fullPath,
      })
      .catch(() => {
        // 如果没有设置redirect路由，则使用window.location.reload()
        window.location.reload()
      })
      .finally(() => {
        loading.close()
      })
  }, 300)
}

// 用户信息响应式对象
const userInfo = ref({
  username: '',
  avatar: '',
})

// 新增获取用户信息方法
onMounted(async () => {
  //console.log('当前token:', localStorage.getItem('token'))
  try {
    const response = await getUserInfo()
    userInfo.value = response.data
  } catch (error) {
    console.error('获取用户信息失败:', error)
    // 添加 token 失效处理
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      router.push('/login')
    }
  }
})
// 计算当前菜单标题
const currentMenuTitle = computed(() => {
  return getCurrentMenuTitle()
})

// 监听路由变化，更新激活的菜单项
watch(
  () => route.path,
  (newPath) => {
    activeMenu.value = newPath
  },
)

// 获取当前菜单标题
const getCurrentMenuTitle = () => {
  const currentPath = route.path

  // 递归查找菜单项
  const findMenuItem = (items) => {
    if (!items) return '系统公告'

    for (const item of items) {
      if (item.path === currentPath) {
        return item.title
      }
      if (item.children && item.children.length) {
        const found = findMenuItem(item.children)
        if (found !== '系统公告') return found
      }
    }
    return '系统公告'
  }

  return findMenuItem(menuTree.value)
}

// 动态添加路由
const addDynamicRoutes = (menuItems) => {
  // 递归处理菜单项
  const processMenuItems = (items) => {
    items.forEach((item) => {
      // 只处理有component属性的菜单项
      if (item.component) {
        try {
          // 创建一个动态组件加载函数
          const asyncComponent = () => {
            return new Promise((resolve, reject) => {
              // 打印组件路径，帮助调试
              console.log(`尝试加载组件: ${item.component}`)

              // 根据组件名称动态导入对应组件
              const componentPath = `../views/system/${item.component}.vue`
              console.log('实际加载路径:', componentPath)

              import(componentPath)
                .then((module) => {
                  console.log(`组件 ${item.component} 加载成功`)
                  resolve(module)
                })
                .catch((error) => {
                  console.warn(`组件 ${item.component} 不存在，使用默认组件`)
                  console.error('组件加载错误详情:', error)
                  import('../components/NotFound.vue').then((module) => resolve(module))
                })
            })
          }

          // 添加路由 - 确保路径不包含中文或特殊字符
          router.addRoute('home', {
            path: item.path,
            name: item.name || item.path.substring(1).replace(/\//g, '-'),
            component: asyncComponent,
            meta: {
              title: item.title,
              icon: item.icon,
              permission: item.permission,
              keepAlive: item.keepAlive === 1,
              requiresAuth: true,
              type: item.type,
            },
          })

          console.log(`添加路由: ${item.path}, 组件: ${item.component}`)
        } catch (error) {
          console.error(`添加路由失败: ${item.path}`, error)
        }
      }

      // 递归处理子菜单
      if (item.children && item.children.length) {
        processMenuItems(item.children)
      }
    })
  }

  processMenuItems(menuItems)

  // 保存菜单数据到localStorage，用于刷新后恢复
  localStorage.setItem('menuData', JSON.stringify(menuItems))
}

// 获取菜单数据
const fetchMenuData = async () => {
  try {
    const response = await getMenuList()
    console.log('菜单数据:', response.data)

    // 检查菜单数据中的组件路径
    const checkComponentPaths = (items) => {
      items.forEach((item) => {
        if (item.component) {
          console.log(`菜单项 ${item.title} 的组件路径: ${item.component}`)
        }
        if (item.children && item.children.length) {
          checkComponentPaths(item.children)
        }
      })
    }

    if (response.data) {
      // 检查组件路径
      checkComponentPaths(response.data)

      // 直接使用后端返回的数据
      menuTree.value = response.data

      // 动态添加路由
      addDynamicRoutes(menuTree.value)

      // 设置默认激活的菜单项
      if (menuTree.value.length > 0) {
        activeMenu.value = menuTree.value[0].path
      }
    } else {
      console.error('获取菜单数据失败:', response.data)
    }
  } catch (error) {
    console.error('获取菜单数据失败:', error)
  }
}

onMounted(() => {
  fetchMenuData()
})

const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<style scoped lang="scss">
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f0f2f5;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 20px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
}

.left-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo {
  height: 32px;
  width: 32px;
}

.title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #001529;
}

.right-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.username {
  font-size: 14px;
  color: #333;
}

.main-container {
  display: flex;
  margin-top: 60px;
  height: calc(100vh - 60px);
}

.sidebar {
  height: 100%;
  background-color: #001529;
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
  position: fixed;
  left: 0;
  top: 60px;
  bottom: 0;
  z-index: 999;
}

.menu {
  height: 100%;
  border-right: none;
}

.main-content {
  flex: 1;
  padding: 20px;
  margin-left: 220px;
  overflow-y: auto;
}

.breadcrumb-container {
  background-color: #fff;
  padding: 16px 20px;
  border-radius: 4px;
  margin-bottom: 16px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.content-area {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.search-box {
  margin-bottom: 16px;
}

.filter-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.search-input {
  width: 260px;
}

.filter-select {
  width: 180px;
}

.create-btn {
  margin-left: auto;
}

.table-card {
  background-color: #fff;
  border-radius: 4px;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding: 0 16px;
}

.total {
  color: #606266;
  font-size: 14px;
}
</style>
