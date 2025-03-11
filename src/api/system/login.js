import request from '@/utils/axios'
const prefix = '/api/system'

export default {
  // 获取验证码
  getCaptcha() {
    return request({
      url: '/api/system/captcha',
      method: 'get',
    })
  },

  // 用户登录
  login(data) {
    return request({
      url: '/api/system/login',
      method: 'get',
      params: data,
    })
  },

  // 获取用户信息
  getUserInfo() {
    return request({
      url: `/api/system/currentUser`,
      method: 'get',
    })
  },
}

// export function getCaptcha() {
//   return request({
//     url: '/api/system/captcha',
//     method: 'GET',
//   })
// }
