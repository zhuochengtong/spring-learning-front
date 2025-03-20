import axios from 'axios'
import { ElMessage } from 'element-plus' // 添加导入 ElMessage
import router from '@/router' // 导入路由

// 环境变量访问方式
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 15000, // 添加15秒超时
})

// 添加请求拦截器
service.interceptors.request.use((config) => {
  config.headers['Content-Type'] = 'application/json'
  const token = localStorage.getItem('token')
  //console.log('请求拦截器:', token)
  if (token) {
    config.headers.Authorization = `${token}`
  }
  //console.log('请求配置:', config)
  return config
})

// 修改响应拦截器
service.interceptors.response.use(
  (response) => {
    console.log('原始响应:', response)
    if (response.data?.code === 200) {
      return response.data // 返回嵌套的业务数据
    }
    return Promise.reject(response.data?.msg || '请求异常')
  },
  (error) => {
    // 处理401错误（未授权，通常是token过期）
    if (error.response && error.response.status === 401) {
      // 清除本地存储的token
      localStorage.removeItem('token')
      
      // 使用Element Plus的消息提示
      ElMessage.error({
        message: '登录已过期，请重新登录',
        duration: 3000
      })
      
      // 延迟跳转到登录页，让用户有时间看到提示信息
      // setTimeout(() => {
      //   window.location.href = '/login'
      // }, 1500)
    }
    
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)
export default service
