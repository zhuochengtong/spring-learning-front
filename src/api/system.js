import request from '@/utils/axios'

export default {
  // 获取验证码
  getCaptcha() {
    return request({
      url: '/api/system/captcha',
      method: 'get',
    }).then((res) => res.data?.data || {})
  },

  // 用户登录
  login(data) {
    return request({
      url: '/api/system/login',
      method: 'get',
      params: data,
    }).then((res) => res.data?.data || {})
  },

  // 获取用户信息
  getUserInfo(id) {
    return request({
      url: `/api/system/${id}`,
      method: 'get',
    }).then((res) => res.data?.data || {})
  },
}
