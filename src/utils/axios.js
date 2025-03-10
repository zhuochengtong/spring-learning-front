import axios from 'axios'

// 修改第4行的环境变量访问方式
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 15000, // 添加15秒超时
})

// // 请求拦截器（类似Spring的Interceptor）
// service.interceptors.request.use((config) => {
//   config.headers['X-Requested-With'] = 'XMLHttpRequest'
//   // 添加认证token（类似Spring Security的Header）
//   if (localStorage.getItem('token')) {
//     config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
//   }
//   return config
// })

// // 响应拦截器（统一错误处理）
// service.interceptors.response.use(
//   (response) => {
//     if (response.data?.code !== 200) {
//       return Promise.reject(response.data)
//     }
//     return response.data
//   },
//   (error) => {
//     // 处理非JSON响应的情况
//     if (error.response.headers['content-type'].includes('text/html')) {
//       console.error('接收到HTML响应，可能是未认证或路由错误')
//       if (error.response.status === 401) {
//         localStorage.removeItem('token')
//         window.location.href = '/login' // 添加登录跳转逻辑
//       }
//       return Promise.reject({ message: '服务端返回异常响应' })
//     }

//     // 增强错误信息提取逻辑
//     const message =
//       error.response?.data?.message || error.response?.data?.error || error.message || '请求失败'
//     console.error(`API Error: ${message}`)
//     return Promise.reject({
//       message,
//       code: error.response?.status,
//       data: error.response?.data,
//     })
//   },
// )

export default service
