<template>
  <div class="app-container">
    <!-- 头部栏组件 -->
    <header-bar />

    <div class="main-container">
      <!-- 侧边菜单栏组件 -->
      <side-menu />

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
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { HomeFilled } from '@element-plus/icons-vue'
import { useMenuStore } from '@/stores/menu'
import { useUserStore } from '@/stores/user'
import HeaderBar from '@/components/HeaderBar.vue'
import SideMenu from '@/components/SideMenu.vue'

const route = useRoute()
const menuStore = useMenuStore()
const userStore = useUserStore()

// 使用 store 中的菜单数据
const menuTree = computed(() => menuStore.menuTree)

// 组件挂载时获取数据
onMounted(async () => {
  try {
    // 获取用户信息
    await userStore.fetchUserInfo()
    
    // 获取菜单数据
    await menuStore.fetchMenuData()
  } catch (error) {
    console.error('初始化数据失败:', error)
  }
})

// 计算当前菜单标题
const currentMenuTitle = computed(() => {
  return getCurrentMenuTitle()
})

// 获取当前菜单标题
const getCurrentMenuTitle = () => {
  const currentPath = route.path
  
  // 递归查找菜单项
  const findMenuItem = (items) => {
    if (!items) return '首页'
    
    for (const item of items) {
      if (item.path === currentPath) {
        return item.title
      }
      if (item.children && item.children.length) {
        const found = findMenuItem(item.children)
        if (found !== '首页') return found
      }
    }
    return '首页'
  }
  
  return findMenuItem(menuTree.value)
}
</script>

<style scoped lang="scss">
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f0f2f5;
}

.main-container {
  display: flex;
  margin-top: 60px;
  height: calc(100vh - 60px);
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
</style>
