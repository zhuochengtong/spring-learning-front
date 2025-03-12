<template>
  <el-sub-menu v-if="menuItem.children && menuItem.children.length" :index="menuItem.path">
    <template #title>
      <el-icon><component :is="getIcon(menuItem.icon)" /></el-icon>
      <span>{{ menuItem.title }}</span>
    </template>
    <menu-item 
      v-for="child in menuItem.children" 
      :key="child.id" 
      :menu-item="child"
    />
  </el-sub-menu>
  <el-menu-item v-else :index="menuItem.path">
    <el-icon><component :is="getIcon(menuItem.icon)" /></el-icon>
    <span>{{ menuItem.title }}</span>
  </el-menu-item>
</template>

<script>
import { getIconComponent } from '@/api/system/menu'
import {
  Document, Setting, User, Avatar, Menu, InfoFilled,
  Monitor, Share, Lock, DataAnalysis, Headset, ChatDotRound
} from '@element-plus/icons-vue'

export default {
  name: 'MenuItem',
  props: {
    menuItem: {
      type: Object,
      required: true
    }
  },
  methods: {
    getIcon(iconName) {
      const iconComponent = getIconComponent(iconName)
      // 使用动态导入的图标组件
      switch(iconComponent) {
        case 'Setting': return Setting;
        case 'User': return User;
        case 'Avatar': return Avatar;
        case 'Menu': return Menu;
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
  }
}
</script>