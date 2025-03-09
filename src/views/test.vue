<!-- 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果 -->

<template>
    <div class="flex flex-col items-center">
      <nav class="w-full glass-effect fixed top-0 z-50">
        <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div class="flex items-center">
            <span class="text-2xl font-['Pacifico'] text-white">logo</span>
          </div>
          <div class="flex items-center space-x-8">
            <a href="#" class="text-secondary font-medium">首页</a>
            <a href="#" class="text-white hover:text-secondary transition-colors">课程</a>
            <a href="#" class="text-white hover:text-secondary transition-colors">社区</a>
            <a href="#" class="text-white hover:text-secondary transition-colors">个人中心</a>
          </div>
        </div>
      </nav>
  
      <main class="flex items-center justify-center min-h-screen w-full px-4">
        <el-card class="login-card w-full max-w-md shadow-xl">
          <h1 class="text-2xl font-bold text-center mb-8 text-gray-800">欢迎登录</h1>
          
          <div class="space-y-6">
            <el-input
              v-model="username"
              placeholder="请输入用户名"
              class="custom-input"
            >
              <template #prefix>
                <el-icon class="text-gray-400">
                  <User />
                </el-icon>
              </template>
            </el-input>
  
            <el-input
              v-model="password"
              type="password"
              placeholder="请输入密码"
              class="custom-input"
            >
              <template #prefix>
                <el-icon class="text-gray-400">
                  <Lock />
                </el-icon>
              </template>
            </el-input>
  
            <div class="flex items-center">
              <el-checkbox v-model="rememberPassword">记住密码</el-checkbox>
            </div>
  
            <el-button 
              type="primary" 
              @click="handleLogin" 
              class="w-full !rounded-button whitespace-nowrap login-btn"
            >
              登录
            </el-button>
  
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500">其他登录方式</span>
              </div>
            </div>
  
            <div class="flex justify-center space-x-6">
              <i class="fab fa-weixin text-2xl text-green-500 cursor-pointer social-icon" @click="handleSocialLogin('weixin')"></i>
              <i class="fab fa-qq text-2xl text-blue-500 cursor-pointer social-icon" @click="handleSocialLogin('qq')"></i>
              <i class="fab fa-github text-2xl text-gray-800 cursor-pointer social-icon" @click="handleSocialLogin('github')"></i>
            </div>
          </div>
        </el-card>
      </main>
  
      <footer class="w-full glass-effect py-4 px-6">
        <div class="max-w-7xl mx-auto flex justify-between items-center">
          <div class="text-white text-sm">© 2023 webMasterGo AI</div>
          <div class="flex space-x-6">
            <a href="#" class="text-white hover:text-secondary text-sm transition-colors">隐私政策</a>
            <a href="#" class="text-white hover:text-secondary text-sm transition-colors">用户协议</a>
            <a href="#" class="text-white hover:text-secondary text-sm transition-colors">联系我们</a>
          </div>
        </div>
      </footer>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue';
  import { User, Lock } from '@element-plus/icons-vue';
  import { ElMessage } from 'element-plus';
  
  const username = ref('');
  const password = ref('');
  const rememberPassword = ref(false);
  
  const handleLogin = () => {
    console.log('登录信息:', {
      username: username.value,
      password: password.value,
      rememberPassword: rememberPassword.value
    });
    ElMessage.success('登录成功');
  };
  
  const handleSocialLogin = (platform: string) => {
    console.log('第三方登录:', platform);
    ElMessage.info(`正在跳转至${platform}登录页面`);
  };
  </script>
  
  <style scoped>
  body {
    min-height: 1024px;
    background-image: url('https://ai-public.mastergo.com/ai/img_res/87aaaf0a3f202b158590931107568f62.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
  
  .glass-effect {
    backdrop-filter: blur(10px);
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  .login-card {
    backdrop-filter: blur(16px);
    background-color: rgba(255, 255, 255, 0.95);
  }
  
  .custom-input :deep(.el-input__wrapper) {
    background: transparent;
    box-shadow: none;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
  }
  
  .custom-input :deep(.el-input__wrapper):hover {
    border-color: #42b983;
  }
  
  .custom-input :deep(.el-input__wrapper.is-focus) {
    border-color: #42b983;
    box-shadow: none;
  }
  
  .social-icon:hover {
    transform: rotate(3deg);
    transition: transform 0.3s ease;
  }
  
  .login-btn {
    background: linear-gradient(to right, #42b983, #3aa676);
  }
  
  .login-btn:hover {
    transform: scale(1.05);
    transition: all 0.3s ease;
  }
  </style>
  
  