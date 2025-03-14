import request from '@/utils/request'

/**
 * 获取系统菜单列表
 * @returns {Promise} 返回菜单列表数据
 */
export function getMenuList() {
  return request({
    url: '/api/system/menu/list',
    method: 'get'
  })
}

/**
 * 添加菜单
 * @param {Object} data 菜单数据
 * @returns {Promise}
 */
export function addMenu(data) {
  return request({
    url: '/api/system/menu',
    method: 'post',
    data
  })
}

/**
 * 更新菜单
 * @param {Object} data 菜单数据
 * @returns {Promise}
 */
export function updateMenu(data) {
  return request({
    url: '/api/system/menu',
    method: 'put',
    data
  })
}

/**
 * 删除菜单
 * @param {Number} id 菜单ID
 * @returns {Promise}
 */
export function deleteMenu(id) {
  return request({
    url: `/api/system/menu/${id}`,
    method: 'delete'
  })
}

/**
 * 获取菜单图标组件
 * @param {String} iconName 图标名称
 * @returns {String} 对应的Element Plus图标组件名
 */
export function getIconComponent(iconName) {
  // 图标名称映射表，将后端返回的图标名映射到Element Plus图标组件
  const iconMap = {
    'setting': 'Setting',
    'user': 'User',
    'avatar': 'Avatar',
    'menu': 'Menu',
    'info': 'InfoFilled',
    'document': 'Document',
    'monitor': 'Monitor',
    'share': 'Share',
    'lock': 'Lock',
    'data-analysis': 'DataAnalysis',
    'headset': 'Headset',
    'chat-dot-round': 'ChatDotRound'
  }

  return iconMap[iconName] || 'Document' // 默认返回Document图标
}