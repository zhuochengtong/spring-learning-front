<template>
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
        <!-- 刷新按钮 -->
        <el-button type="primary" link @click="refreshPage" title="刷新页面">
          <el-icon><RefreshRight /></el-icon>
        </el-button>
      </div>

      <el-dropdown v-if="userInfo && userInfo.username">
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
            <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <div v-else class="user-loading">
        <el-skeleton-item variant="circle" style="width: 32px; height: 32px;" />
        <el-skeleton-item variant="text" style="width: 60px;" />
      </div>
    </div>
  </el-header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElLoading } from 'element-plus'
import { useUserStore } from '@/stores/user'
import {
  Grid, Connection, Search, Star, ChatDotRound,
  Bell, Expand, RefreshRight, ArrowDown
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 用户信息
const userInfo = computed(() => userStore.userInfo)

// 刷新页面方法
const refreshPage = () => {
  // 显示加载状态
  const loading = ElLoading.service({
    lock: true,
    text: '页面刷新中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  
  // 刷新当前路由
  setTimeout(() => {
    router.replace({
      path: '/redirect' + route.fullPath
    }).catch(() => {
      // 如果没有设置redirect路由，则使用window.location.reload()
      window.location.reload()
    }).finally(() => {
      loading.close()
    })
  }, 300)
}

// 退出登录
const handleLogout = () => {
  userStore.logout()
}
</script>

<style scoped lang="scss">
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

.user-loading {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 8px;
}
</style>