<!-- 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果 -->

<template>
    <div class="min-h-screen bg-gray-50">
      <!-- 顶部导航 -->
      <header class="bg-white shadow-sm h-14 flex items-center justify-between px-4 fixed w-full top-0 z-50">
        <div class="flex items-center space-x-4">
          <img src="https://ai-public.mastergo.com/ai/img_res/3d83a115ca5ebf4bac4f145fe829be00.jpg" 
               alt="Logo" 
               class="h-8 w-8"/>
          <h1 class="text-lg font-medium">应用支撑平台</h1>
          <el-button type="primary" class="!rounded-button">
            <el-icon><Grid /></el-icon>
          </el-button>
        </div>
        
        <div class="flex items-center space-x-4">
          <el-button class="!rounded-button whitespace-nowrap">
            <el-icon><Connection /></el-icon>
            应用切换
          </el-button>
          <div class="flex space-x-3">
            <el-icon><Search /></el-icon>
            <el-icon><Star /></el-icon>
            <el-icon><Message /></el-icon>
            <el-icon><Bell /></el-icon>
            <el-icon><FullScreen /></el-icon>
            <el-icon><Refresh /></el-icon>
            <el-icon><Setting /></el-icon>
          </div>
          <el-avatar size="small" src="https://ai-public.mastergo.com/ai/img_res/a93bbe33fd3e1e553f303ad4f4dd93ec.jpg" />
        </div>
      </header>
  
      <!-- 主体内容 -->
      <div class="flex pt-14">
        <!-- 左侧菜单 -->
        <aside class="w-48 bg-white h-screen fixed left-0 shadow-sm">
          <el-menu default-active="8" class="h-full">
            <el-menu-item index="1">
              <el-icon><Document /></el-icon>
              <span>协同办公</span>
            </el-menu-item>
            <el-menu-item index="2">
              <el-icon><Monitor /></el-icon>
              <span>在线开发</span>
            </el-menu-item>
            <el-menu-item index="3">
              <el-icon><Share /></el-icon>
              <span>统一流程</span>
            </el-menu-item>
            <el-menu-item index="4">
              <el-icon><Lock /></el-icon>
              <span>安全审计</span>
            </el-menu-item>
            <el-menu-item index="5">
              <el-icon><DataLine /></el-icon>
              <span>数据应用</span>
            </el-menu-item>
            <el-menu-item index="6">
              <el-icon><Service /></el-icon>
              <span>消息中心</span>
            </el-menu-item>
            <el-menu-item index="7">
              <el-icon><Setting /></el-icon>
              <span>系统管理</span>
            </el-menu-item>
            <el-menu-item index="8">
              <el-icon><Message /></el-icon>
              <span>系统公告</span>
            </el-menu-item>
          </el-menu>
        </aside>
  
        <!-- 右侧内容 -->
        <main class="flex-1 ml-48 p-6">
          <!-- 面包屑 -->
          <el-breadcrumb separator=">" class="mb-4">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>系统公告</el-breadcrumb-item>
          </el-breadcrumb>
  
          <!-- 搜索区域 -->
          <div class="bg-white p-4 rounded-lg mb-4">
            <div class="flex items-center space-x-4">
              <el-input
                v-model="searchKeyword"
                placeholder="请输入关键词"
                class="w-64"
              >
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
              
              <el-select v-model="searchType" placeholder="请选择类型" class="w-48">
                <el-option label="全部" value="" />
                <el-option label="公告" value="notice" />
                <el-option label="通知" value="notification" />
              </el-select>
  
              <el-select v-model="searchStatus" placeholder="请选择状态" class="w-48">
                <el-option label="全部" value="" />
                <el-option label="待发送" value="pending" />
                <el-option label="已发送" value="sent" />
              </el-select>
  
              <el-button type="primary" class="!rounded-button whitespace-nowrap">
                查询
              </el-button>
              <el-button class="!rounded-button whitespace-nowrap">
                重置
              </el-button>
              <el-button type="primary" class="!rounded-button whitespace-nowrap ml-auto">
                <el-icon><Plus /></el-icon>
                新建
              </el-button>
            </div>
          </div>
  
          <!-- 表格 -->
          <div class="bg-white rounded-lg">
            <el-table :data="tableData" style="width: 100%">
              <el-table-column prop="id" label="序号" width="80" />
              <el-table-column prop="title" label="标题" />
              <el-table-column prop="type" label="类型" width="120" />
              <el-table-column prop="expireTime" label="失效时间" width="180" />
              <el-table-column prop="creator" label="创建人" width="120" />
              <el-table-column prop="createTime" label="创建时间" width="180" />
              <el-table-column prop="publisher" label="发布人" width="120" />
              <el-table-column prop="publishTime" label="发布时间" width="180" />
              <el-table-column prop="status" label="状态" width="120">
                <template #default="scope">
                  <el-tag :type="scope.row.status === '已发送' ? 'success' : 'warning'">
                    {{ scope.row.status }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180">
                <template #default>
                  <el-button link type="primary" class="!rounded-button">编辑</el-button>
                  <el-button link type="primary" class="!rounded-button">删除</el-button>
                  <el-dropdown>
                    <el-button link type="primary" class="!rounded-button">
                      更多<el-icon><ArrowDown /></el-icon>
                    </el-button>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item>查看详情</el-dropdown-item>
                        <el-dropdown-item>复制</el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </template>
              </el-table-column>
            </el-table>
  
            <!-- 分页 -->
            <div class="flex justify-between items-center p-4">
              <span class="text-gray-500">共 2 条数据</span>
              <el-pagination
                :current-page="currentPage"
                :page-size="20"
                layout="prev, pager, next"
                :total="2"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue';
  import { 
    Search, Grid, Connection, Star, Message, Bell, FullScreen, 
    Refresh, Setting, Document, Monitor, Share, Lock, DataLine, 
    Service, Plus, ArrowDown 
  } from '@element-plus/icons-vue';
  
  const searchKeyword = ref('');
  const searchType = ref('');
  const searchStatus = ref('');
  const currentPage = ref(1);
  
  const tableData = ref([
    {
      id: 1,
      title: '公告来源',
      type: '公告',
      expireTime: '',
      creator: '管理员/admin',
      createTime: '2025-01-08 14:20:19',
      publisher: '',
      publishTime: '',
      status: '待发送'
    },
    {
      id: 2,
      title: '新增公告',
      type: '公告',
      expireTime: '',
      creator: '管理员/admin',
      createTime: '2025-01-10 09:23:29',
      publisher: '管理员/admin',
      publishTime: '2025-02-14 11:15:15',
      status: '已发送'
    }
  ]);
  </script>
  
  <style scoped lang="scss"> 
  .el-menu {
    border-right: none;
  }
  </style>
  
  