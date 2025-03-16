<template>
  <el-aside width="220px" class="sidebar">
    <el-menu
      :default-active="activeMenu"
      class="menu"
      background-color="#001529"
      text-color="#fff"
      active-text-color="#409EFF"
      :router="true"
    >
      <!-- 一级菜单 -->
      <template v-for="item in menuItems" :key="item.id">
        <!-- 有子菜单的情况 -->
        <el-sub-menu v-if="item.children && item.children.length" :index="item.path || item.id.toString()">
          <template #title>
            <el-icon><component :is="getIcon(item.icon)" /></el-icon>
            <span>{{ item.title }}</span>
          </template>
          
          <!-- 二级菜单 -->
          <template v-for="subItem in item.children" :key="subItem.id">
            <!-- 二级菜单有子菜单的情况 -->
            <el-sub-menu v-if="subItem.children && subItem.children.length" :index="subItem.path || subItem.id.toString()">
              <template #title>
                <el-icon><component :is="getIcon(subItem.icon)" /></el-icon>
                <span>{{ subItem.title }}</span>
              </template>
              
              <!-- 三级菜单 -->
              <el-menu-item 
                v-for="child in subItem.children" 
                :key="child.id" 
                :index="child.path || child.id.toString()"
              >
                <el-icon><component :is="getIcon(child.icon)" /></el-icon>
                <span>{{ child.title }}</span>
              </el-menu-item>
            </el-sub-menu>
            
            <!-- 二级菜单无子菜单的情况 -->
            <el-menu-item v-else :index="subItem.path || subItem.id.toString()">
              <el-icon><component :is="getIcon(subItem.icon)" /></el-icon>
              <span>{{ subItem.title }}</span>
            </el-menu-item>
          </template>
        </el-sub-menu>
        
        <!-- 无子菜单的情况 -->
        <el-menu-item v-else :index="item.path || item.id.toString()">
          <el-icon><component :is="getIcon(item.icon)" /></el-icon>
          <span>{{ item.title }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </el-aside>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMenuStore } from '@/stores/menu'
import {
  Document, Setting, User, Avatar, Menu as MenuIcon, InfoFilled,
  Monitor, Share, Lock, DataAnalysis, Headset, ChatDotRound
} from '@element-plus/icons-vue'
import { getIconComponent } from '@/api/system/menu'

const route = useRoute()
const menuStore = useMenuStore()

// 菜单数据
const menuItems = computed(() => menuStore.menuTree)

// 当前激活的菜单
const activeMenu = ref('')

// 监听路由变化，更新激活的菜单项
watch(() => route.path, (newPath) => {
  activeMenu.value = newPath
})

// 获取图标组件
const getIcon = (iconName) => {
  if (!iconName) return Document
  
  const iconComponent = getIconComponent(iconName)
  // 使用动态导入的图标组件
  switch(iconComponent) {
    case 'Setting': return Setting;
    case 'User': return User;
    case 'Avatar': return Avatar;
    case 'Menu': return MenuIcon;
    case 'InfoFilled': return InfoFilled;
    case 'Document': return Document;
    case 'Monitor': return Monitor;
    case 'Share': return Share;
    case 'Lock': return Lock;
    case 'DataAnalysis': return DataAnalysis;
    case 'Headset': return Headset;
    case 'ChatDotRound': return ChatDotRound;
    default: return Document;
  }
}
</script>

<style scoped lang="scss">
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
</style>