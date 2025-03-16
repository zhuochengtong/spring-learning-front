import { defineStore } from 'pinia'
import { getMenuList } from '@/api/system/menu'

export const useMenuStore = defineStore('menu', {
  // 状态
  state: () => ({
    menuTree: [],
    loading: false,
    error: null
  }),
  
  // getter，类似计算属性
  getters: {
    // 获取菜单树
    getMenuTree: (state) => state.menuTree,
    
    // 获取扁平化的菜单列表
    getFlatMenuList: (state) => {
      const flattenMenus = (menus, result = []) => {
        menus.forEach(menu => {
          result.push(menu)
          if (menu.children && menu.children.length) {
            flattenMenus(menu.children, result)
          }
        })
        return result
      }
      
      return flattenMenus(state.menuTree)
    }
  },
  
  // actions，用于处理业务逻辑
  actions: {
    // 获取菜单数据
    async fetchMenuData() {
      this.loading = true
      try {
        const response = await getMenuList()
        if (response.data) {
          this.menuTree = response.data
        } else {
          this.error = '获取菜单数据失败'
          console.error('获取菜单数据失败:', response)
        }
      } catch (error) {
        this.error = '获取菜单数据失败'
        console.error('获取菜单数据失败:', error)
      } finally {
        this.loading = false
      }
    },
    
    // 刷新菜单数据
    async refreshMenuData() {
      this.menuTree = []
      await this.fetchMenuData()
    }
  }
})