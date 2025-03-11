<template>
  <!-- 根容器 -->
  <div class="login-container">
    <!-- 背景层 -->
    <div class="background-layer"></div>

    <!-- 主内容卡片 -->
    <div class="login-card">
      <!-- 头部区域 -->
      <header class="card-header">
        <img src="@/assets/logo.png" class="logo" />
        <h1 class="title">用户登录</h1>
      </header>

      <!-- 表单容器 -->
      <div class="form-container">
        <!-- 用户名输入域 -->
        <div class="input-group">
          <label>用户名</label>
          <el-input v-model="form.username" placeholder="请输入用户名" />
          <!-- 添加 v-model -->
        </div>

        <!-- 密码输入域 -->
        <div class="input-group">
          <label>密码</label>
          <el-input v-model="form.password" type="password" placeholder="请输入密码" />
        </div>
        <!-- 验证码输入域 -->
        <div class="input-group">
          <label>验证码</label>
          <div class="captcha-wrapper">
            <el-input v-model="form.captchaCode" placeholder="请输入验证码" style="width: 60%" />
            <img :src="captchaImage" @click="getCaptcha" class="captcha-image" alt="验证码" />
          </div>
        </div>
        <!-- 操作按钮组 -->
        <div class="action-group">
          <el-button type="primary" class="login-btn" :loading="loading" @click="handleLogin"
            >立即登录</el-button
          >
        </div>

        <!-- 辅助链接 -->
        <div class="link-group">
          <el-link type="info">忘记密码?</el-link>
          <el-link type="primary">注册账号</el-link>
          <el-link type="info" class="guest-link" @click="handleGuestLogin">游客登录</el-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import authApi from '@/api/system'

const router = useRouter()
const form = ref({
  username: 'admin',  // 设置默认用户名
  password: 'admin',   // 设置默认密码
  captchaCode: '',
  captchaKey: '',
})

// 新增验证码相关逻辑
const captchaImage = ref('')
const loading = ref(false)

// 1、初始化时获取验证码
const getCaptcha = async () => {
  try {
    const res = await authApi.getCaptcha()
    captchaImage.value = res.image
    form.value.captchaKey = res.key
  } catch (error) {
    console.error('获取验证码失败:', error)
  }
}

// 2、处理登录提交
const handleLogin = async () => {
  try {
    loading.value = true
    const res = await authApi.login({
      username: form.value.username,
      password: form.value.password,
      captchaKey: form.value.captchaKey, // 确保传递 captchaKey
      captchaCode: form.value.captchaCode,
    })
    localStorage.setItem('token', res.token || res.data?.token)
    router.push({ name: 'home' })
  } catch (error) {
    console.error('登录失败:', error)
    ElMessage.error(error.response?.data?.message || '登录失败') // 添加错误提示
    getCaptcha() // 登录失败刷新验证码
  } finally {
    loading.value = false
  }
}

// 初始化获取验证码
getCaptcha()

// 新增游客登录方法
const handleGuestLogin = () => {
  router.push({ name: 'guest' }) // 导航到游客登录页面
}
</script>

<style scoped>
/* 根容器 */
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

/* 背景层 */
.background-layer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  z-index: 0;
  background-image: url('../assets/login_img_02.jpg');
  /* 调整图片 */
  background-size: cover;
}

/* 登录卡片 */
.login-card {
  width: 420px; /* 卡片固定宽度 */
  background: rgba(255, 255, 255, 0.95); /* 半透明白色背景 */
  border-radius: 12px; /* 圆角尺寸 */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); /* 柔和阴影效果 */
  z-index: 1; /* 层级高于背景 */
  padding: 40px; /* 内边距 */
  margin-left: auto; /* 靠右对齐 */
  margin-right: 15%; /* 右边距保持15% */
}

/* 头部区域 */
.card-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  width: 80px;
  margin-bottom: 1rem;
}

.title {
  color: #2d3748;
  font-size: 1.5rem;
}

/* 表单容器 */
.form-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* 输入组 */
.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* 操作按钮 */
.login-btn {
  width: 100%;
  height: 45px;
  margin-top: 1rem;
}

/* 链接组 */
.link-group {
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
}

/* 响应式设计
@media (max-width: 480px) {
  .login-card {
    width: 90%;
    padding: 25px;
  }
} */
</style>

<style scoped>
.guest-link {
  /* 自定义游客链接样式 */
  --el-link-text-color: #67c23a;
  --el-link-hover-text-color: #85ce61;
  --el-link-active-color: #5daf34;
}
</style>
