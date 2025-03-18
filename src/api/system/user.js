import request from '@/utils/request'

/**
 * 获取用户列表
 * @param {*} params 
 * @returns 
 */
export function getUserList(params) {
  return request({
    url: '/api/system/users/page',
    method: 'get',
    params
  })
}

/**
 * 添加用户
 * @param {*} data 
 * @returns 
 */
export function addUser(data) {
  return request({
    url: '/api/system/users/create',
    method: 'post',
    data
  })
}

/**
 * 更新用户
 * @param {*} data 
 * @returns 
 */
export function updateUser(id,data) {
  return request({
    url: `/api/system/users/${id}`,
    method: 'put',
    data
  })
}

/**
 * 获取用户详情
 * @param {*} id 
 * @returns 
 */
export function getUserDetail(id) {
  return request({
    url: `/api/system/users/${id}`,
    method: 'get'
  })
}

/**
 * 删除用户
 * @param {*} id 
 * @returns 
 */
export function deleteUser(id) {
  return request({
    url: `/api/system/users/${id}`,
    method: 'delete'
  })
}

/**
 * 批量删除用户
 * @param {*} ids 
 * @returns 
 */
export function batchDeleteUsers(ids) {
  return request({
    url: '/api/system/users/deleteBatch',
    method: 'delete',
    data: { ids }
  })
}

/**
 * 重置用户密码
 * @param {*} id 
 * @param {*} password 
 * @returns 
 */
export function resetUserPassword(id, password) {
  return request({
    url: `/api/system/users/${id}/password`,
    method: 'put',
    data: { password }
  })
}