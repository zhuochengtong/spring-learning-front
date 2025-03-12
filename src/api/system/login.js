import request from '@/utils/request'
const prefix = '/api/system'

/**
 * 获取验证码
 * @returns {Promise} 返回验证码数据
 */
export function getCaptcha() {
  return request({
    url: '/api/system/captcha',
    method: 'get',
  })
}

/**
 * 用户登录
 * @param {Object} data 登录参数
 * @returns {Promise} 返回登录结果
 */
export function login(data) {
  return request({
    url: '/api/system/login',
    method: 'get',
    params: data,
  })
}

/**
 * 获取用户信息
 * @returns {Promise} 返回当前用户信息
 */
export function getUserInfo() {
  return request({
    url: `/api/system/currentUser`,
    method: 'get',
  })
}