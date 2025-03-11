<template>
  <el-container class="system-container">
    <!-- 侧边栏 -->
    <el-aside width="200px" class="sidebar">
      <div class="logo-wrap">
        <img src="@/assets/logo.png" class="logo" />
        <span class="system-title">后台管理系统</span>
      </div>
      
      <el-menu
        :default-active="activeMenu"
        router
        class="system-menu"
        background-color="#304156"
        text-color="#fff"
        active-text-color="#409EFF"
      >
        <el-menu-item index="/home">
          <el-icon><PieChart /></el-icon>
          <span>首页</span>
        </el-menu-item>

        <el-sub-menu index="2">
          <template #title>
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </template>
          <el-menu-item index="/user/list">用户列表</el-menu-item>
          <el-menu-item index="/user/role">角色管理</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="3">
          <template #title>
            <el-icon><Lock /></el-icon>
            <span>权限管理</span>
          </template>
          <el-menu-item index="/permission/list">权限列表</el-menu-item>
          <el-menu-item index="/permission/assign">权限分配</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>

    <el-container>
      <!-- 顶部导航 -->
      <el-header class="header">
        <div class="header-right">
          <el-space :size="20">
            <el-badge :value="3" class="badge">
              <el-icon :size="20"><Bell /></el-icon>
            </el-badge>
            
            <el-dropdown>
              <span class="user-info">
                <el-avatar :size="30" src="@/assets/user-avatar.png" />
                <span class="username">管理员</span>
                <el-icon><ArrowDown /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>个人中心</el-dropdown-item>
                  <el-dropdown-item divided @click="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-space>
        </div>
      </el-header>

      <!-- 内容区域 -->
      <el-main class="main-content">
        <div>首页内容展示</div>
    
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
// 在script setup顶部导入组件

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  PieChart,
  User,
  Lock,
  Bell,
  ArrowDown
} from '@element-plus/icons-vue'


const router = useRouter()
const activeMenu = ref('/home')

// 添加示例数据
const chartData = ref({/* 图表数据 */})
const quickActions = ref([
  {
    text: '新建用户',
    type: 'primary',
    handler: () => console.log('新建用户')
  },
  // 其他操作...
])

const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<style scoped lang="scss"> 
.system-container {
  height: 100vh;
}

.sidebar {
  background: #304156;
  transition: width 0.3s;
}

.logo-wrap {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 15px;
  color: #fff;
  
  .logo {
    width: 32px;
    margin-right: 10px;
  }
  
  .system-title {
    font-size: 18px;
    white-space: nowrap;
  }
}

.header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
}

.main-content {
  background: #f5f7f9;
  padding: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  
  .username {
    font-size: 14px;
  }
}

.badge :deep(.el-badge__content) {
  top: 12px;
  right: 12px;
}
</style>