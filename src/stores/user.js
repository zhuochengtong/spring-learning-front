import { defineStore } from 'pinia'
import { getUserInfo } from '@/api/system/login'
import router from '@/router'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: {
      username: '',
      avatar: '',
      permissions: []
    },
    token: localStorage.getItem('token') || '',
    loading: false
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.token,
    getUsername: (state) => state.userInfo.username
  },
  
  actions: {
    // 获取用户信息
    async fetchUserInfo() {
      if (!this.token) return
      
      this.loading = true
      try {
        const response = await getUserInfo()
        this.userInfo = response.data
      } catch (error) {
        console.error('获取用户信息失败:', error)
        // token 失效处理
        if (error.response?.status === 401) {
          this.logout()
        }
      } finally {
        this.loading = false
      }
    },
    
    // 设置 token
    setToken(token) {
      this.token = token
      localStorage.setItem('token', token)
    },
    
    // 退出登录
    logout() {
      this.token = ''
      this.userInfo = {
        username: '',
        avatar: '',
        permissions: []
      }
      localStorage.removeItem('token')
      router.push('/login')
    }
  }
})