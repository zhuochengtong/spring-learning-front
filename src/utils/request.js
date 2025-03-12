import axios from 'axios'

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
      return response.data.data // 返回嵌套的业务数据
    }
    return Promise.reject(response.data?.msg || '请求异常')
  },
  (error) => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  },
)
export default service
