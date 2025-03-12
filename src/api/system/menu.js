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