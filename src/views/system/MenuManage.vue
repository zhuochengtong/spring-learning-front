<template>
  <!-- 菜单管理容器：整个页面的最外层容器 -->
  <div class="menu-manage-container">
    <!-- 1、顶部操作区：包含新增、展开/折叠、刷新按钮和搜索框 -->
    <div class="operation-bar">
      <!-- （1）左侧按钮组：功能操作按钮区域 -->
      <div class="left-actions">
        <!-- 新增菜单按钮 -->
        <el-button type="primary" @click="handleAddMenu">
          <el-icon><Plus /></el-icon>新增菜单
        </el-button>
        <!-- 展开/折叠按钮：控制树形表格的展开状态 -->
        <el-button type="success">
          <el-icon><Expand /></el-icon>展开/折叠
        </el-button>
        <!-- 刷新按钮：重新加载菜单数据 -->
        <el-button type="warning">
          <el-icon><RefreshRight /></el-icon>刷新
        </el-button>
      </div>
      <!-- （2）右侧搜索区：搜索菜单的输入框和按钮 -->
      <div class="right-search">
        <!-- 搜索输入框 -->
        <el-input
          v-model="searchKey"
          placeholder="请输入菜单名称"
          class="search-input"
          clearable
        >
          <!-- 搜索图标前缀 -->
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <!-- 搜索按钮 -->
        <el-button type="primary">搜索</el-button>
      </div>
    </div>

    <!-- 2、表格区域：显示菜单数据的树形表格 -->
    <el-card class="table-card">
      <!-- 树形表格：以层级结构展示菜单数据 -->
      <el-table
        :data="menuData"
        row-key="id"
        border
        default-expand-all
        :tree-props="{ children: 'children' }"
        style="width: 100%"
        v-loading="loading"
      >
        <!-- 菜单名称列：显示图标和名称 -->
        <el-table-column prop="title" label="菜单名称" min-width="180">
          <template #default="scope">
            <!-- 菜单图标 -->
            <el-icon v-if="scope.row.icon"><component :is="scope.row.icon" /></el-icon>
            <!-- 菜单名称 -->
            <span style="margin-left: 8px">{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <!-- 路由路径列：显示菜单对应的前端路由 -->
        <el-table-column prop="path" label="路由路径" min-width="180" />
        <!-- 组件路径列：显示菜单对应的前端组件 -->
        <el-table-column prop="component" label="组件路径" min-width="180" />
        <!-- 权限标识列：显示菜单对应的权限标识符 -->
        <el-table-column prop="permission" label="权限标识" min-width="150" />
        <!-- 排序列：显示菜单的排序值 -->
        <el-table-column prop="sort" label="排序" width="80" align="center" />
        <!-- 类型列：显示菜单类型（目录、菜单、按钮） -->
        <el-table-column prop="type" label="类型" width="100" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.type === 0" type="success">目录</el-tag>
            <el-tag v-else-if="scope.row.type === 1" type="primary">菜单</el-tag>
            <el-tag v-else-if="scope.row.type === 2" type="warning">按钮</el-tag>
          </template>
        </el-table-column>
        <!-- 状态列：显示菜单是否启用的开关 -->
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
            />
          </template>
        </el-table-column>
        <!-- 操作列：提供编辑、添加子菜单、删除功能 -->
        <el-table-column label="操作" width="220" align="center" fixed="right">
          <template #default="scope">
            <!-- 编辑按钮：编辑当前菜单 -->
            <el-button type="primary" link @click="handleEditMenu(scope.row)" >
              <el-icon><Edit /></el-icon>编辑
            </el-button>
            <!-- 添加子菜单按钮：在当前菜单下添加子菜单 -->
            <el-button type="primary" link @click="handleAddChildMenu(scope.row)">
              <el-icon><Plus /></el-icon>添加
            </el-button>
            <!-- 删除按钮：删除当前菜单 -->
            <el-button type="danger" link @click="handlDeleteMenu(scope.row)">
              <el-icon><Delete /></el-icon>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 3、菜单表单对话框：用于新增和编辑菜单 -->
    <el-dialog
      :title="isEdit ? '编辑菜单' : '新增菜单'"
      v-model="dialogVisible"
      width="600px"
      destroy-on-close
    >
      <!-- 菜单表单：包含菜单的各项属性输入 -->
      <el-form
        ref="menuFormRef"
        :model="menuForm"
        label-width="100px"
      >
        <!-- 上级菜单选择：选择菜单的父级 -->
        <el-form-item label="上级菜单" prop="parentId">
          <el-tree-select
            v-model="menuForm.parentId"
            :data="menuTreeData"
            check-strictly
            default-expand-all
            node-key="id"
            :render-after-expand="false"
            placeholder="请选择上级菜单"
            style="width: 100%"
          />
        </el-form-item>
        <!-- 菜单类型选择：目录、菜单或按钮 -->
        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="menuForm.type">
            <el-radio :value="0">目录</el-radio>
            <el-radio :value="1">菜单</el-radio>
            <el-radio :value="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 菜单名称输入 -->
        <el-form-item label="菜单名称" prop="title">
          <el-input v-model="menuForm.title" placeholder="请输入菜单名称" />
        </el-form-item>
        <!-- 路由路径输入：非按钮类型显示 -->
        <el-form-item label="路由路径" prop="path" v-if="menuForm.type !== 2">
          <el-input v-model="menuForm.path" placeholder="请输入路由路径" />
        </el-form-item>
        <!-- 组件路径输入：仅菜单类型显示 -->
        <el-form-item label="组件路径" prop="component" v-if="menuForm.type === 1">
          <el-input v-model="menuForm.component" placeholder="请输入组件路径" />
        </el-form-item>
        <!-- 权限标识输入：非目录类型显示 -->
        <el-form-item label="权限标识" prop="permission" v-if="menuForm.type !== 0">
          <el-input v-model="menuForm.permission" placeholder="请输入权限标识" />
        </el-form-item>
        <!-- 菜单图标输入：非按钮类型显示 -->
        <el-form-item label="菜单图标" prop="icon" v-if="menuForm.type !== 2">
          <el-input v-model="menuForm.icon" placeholder="请输入菜单图标" />
        </el-form-item>
        <!-- 排序输入 -->
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="menuForm.sort" :min="0" :max="999" />
        </el-form-item>
        <!-- 状态选择：启用或禁用 -->
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="menuForm.status">
            <el-radio :value="1">启用</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <!-- 对话框底部按钮：取消和确定 -->
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitMenuForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>

// 1、import 导入
// 导入Vue的响应式API，ref: 用于创建基本类型的响应式引用，reactive: 用于创建复杂对象的响应式状态
import { ref, reactive } from 'vue'
// 导入Element Plus图标组件，这些图标将用于界面中的按钮和表格等位置
import {
  Plus, Edit, Delete, Search, RefreshRight,
  Expand, Document, Menu, Setting
} from '@element-plus/icons-vue'
// 引入接口函数
import { getMenuList, addMenu, updateMenu, deleteMenu} from '@/api/system/menu'
// 组件挂载时执行的钩子函数
import { onMounted } from 'vue'
// 导入Element Plus消息提示组件
import { ElMessage, ElMessageBox } from 'element-plus'
// 导入pinia store，用于刷新左侧菜单
// import { useUserStore } from '@/stores/user'

// 2、基础响应式数据定义
// 获取用户store，用于刷新左侧菜单
// const userStore = useUserStore()
// 搜索关键字：用于菜单搜索功能
const searchKey = ref('')
// 菜单数据列表：存储从后端获取的菜单数据
const menuData = ref([])
// 数据加载状态：控制表格的加载动画
const loading = ref(false)
// 对话框可见性控制：控制菜单表单对话框的显示和隐藏
const dialogVisible = ref(false)
// 表单引用：用于表单验证
const menuFormRef = ref(null)
// 菜单表单数据：用于新增和编辑菜单时的数据绑定
const menuForm = reactive({
  id: null,
  parentId: 0,
  title: '',
  path: '',
  component: '',
  permission: '',
  icon: '',
  sort: 0,
  type: 0,
  status: 1
})
// 是否为编辑模式
const isEdit = ref(false)
// 菜单树形数据：用于上级菜单选择
const menuTreeData = ref([
  {
    id: 0,
    label: '顶级菜单',
    children: []
  }
])

// 3、事件处理函数

/**
 * 获取菜单数据函数
 * 从后端API获取菜单列表数据，并更新到menuData响应式变量中
 * 同时处理加载状态和错误情况
 */
const fetchMenuData = async () => {
  // 设置加载状态为true，显示加载动画
  loading.value = true
  // 调用菜单查询接口
  try {
    // 调用API获取菜单列表数据
    const res = await getMenuList()
    // 更新menuData响应式变量，将获取的数据赋值给他，menuData，如果返回为空则设为空数组
    menuData.value = res.data || []
    console.log('菜单数据获取成功:', menuData.value)

    // 处理菜单树形数据，用于上级菜单选择
    formatMenuTreeData()
  } catch (error) {
    // 捕获并处理请求错误
    console.error('获取菜单数据失败:', error)
    // 可以在这里添加错误提示，例如使用Element Plus的消息提示
  } finally {
    // 无论成功或失败，最终都将加载状态设为false，关闭加载动画
    loading.value = false
  }
}

/**
 * 格式化菜单树形数据
 * 将菜单数据转换为树形选择器需要的格式
 */
const formatMenuTreeData = () => {
  // 深拷贝菜单数据，避免直接修改原始数据，防止引用类型带来的副作用
  const formattedData = JSON.parse(JSON.stringify(menuData.value))
  
  // 定义内部转换函数，用于递归处理菜单数据
  const convertData = (items) => {
    // 如果传入的数组为空或不存在，则返回空数组
    if (!items || !items.length) return []
    
    // 使用map方法遍历数组中的每一项，并进行格式转换
    return items.map(item => {
      // 创建新的对象，按照el-tree-select组件要求的格式进行转换
      const newItem = {
        id: item.id,         // 保留原始ID作为节点的唯一标识
        label: item.title,   // 将菜单标题转换为显示标签
        value: item.id       // 将ID设置为选中时的值
      }
      
      // 如果当前项有子菜单，则递归处理子菜单
      if (item.children && item.children.length) {
        newItem.children = convertData(item.children)
      }
      
      // 返回转换后的菜单项
      return newItem
    })
  }
  
  // 设置顶级菜单的子菜单，将转换后的数据作为顶级菜单的子节点
  menuTreeData.value[0].children = convertData(formattedData)
}

/**
 * 打开菜单表单对话框函数，准备新增菜单
 */
const handleAddMenu = () => {
  // 打开菜单显示"新增菜单"
  isEdit.value = false
  // 重置菜单表单数据
  resetMenuForm()
  // 设置对话框可见性为true，打开菜单表单对话框
  dialogVisible.value = true
}

/**
 * 打开菜单表单对话框函数，准备编辑菜单
 * @param {Object} row 当前行的菜单数据
 */
 const handleEditMenu = (row) => {
  // 设置为编辑模式
  isEdit.value = true
  // 复制当前行数据到表单
  Object.assign(menuForm, JSON.parse(JSON.stringify(row)))
  // 打开对话框
  dialogVisible.value = true
}

/**
 * 打开菜单表单对话框函数，准备添加子菜单
 * @param {Object} row 当前行的菜单数据，作为父菜单
 */
 const handleAddChildMenu = (row) => {
  // 设置为新增模式
  isEdit.value = false
  // 重置表单
  resetMenuForm()
  // 设置父级ID为当前菜单ID
  menuForm.parentId = row.id
  // 打开对话框
  dialogVisible.value = true
}

/**
 * 重置菜单表单数据
 * 将表单数据恢复到初始状态
 */
 const resetMenuForm = () => {
  // 重置表单为默认值
  Object.assign(menuForm, {
    id: null,
    parentId: 0,
    title: '',
    path: '',
    component: '',
    permission: '',
    icon: '',
    sort: 0,
    type: 0,
    status: 1
  })
}

/**
 * 提交表单函数 - 修改为支持编辑模式
 */
const submitMenuForm = async () => {
  // 获取表单引用
  const formEl = menuFormRef.value
  if (!formEl) {
    console.error('表单元素不存在')
    return
  }
  try {
    // 验证表单数据
    await formEl.validate()
    // 显示加载状态
    loading.value = true
    
    let res
    if (isEdit.value) {
      // 编辑模式：调用更新菜单接口
      res = await updateMenu(menuForm.id, menuForm)
      ElMessage.success('更新菜单成功')
    } else {
      // 新增模式：调用新增菜单接口
      res = await addMenu(menuForm)
      ElMessage.success('新增菜单成功')
    }
    
    // 关闭对话框
    dialogVisible.value = false
    // 刷新菜单数据
    await fetchMenuData()
    // 刷新左侧菜单 - 调用store中的方法重新获取用户菜单
    //await userStore.getUserMenus()
  } catch (error) {
    console.error('表单验证或提交失败:', error)
    ElMessage.error(isEdit.value ? '更新菜单失败' : '新增菜单失败')
  } finally {
    loading.value = false
  }
}

/**
 * 删除菜单函数
 * @param {*} row 
 */
const handlDeleteMenu = async (row) => {
  // 显示确认对话框
  ElMessageBox.confirm('确认删除改菜单吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    // 用户确认删除
    try {
      // 调用删除菜单接口
      const res = await deleteMenu(row.id)
      if (res.code === 200) {
        // 删除成功，刷新菜单数据
        await fetchMenuData()
        ElMessage.success('删除菜单成功')
      } else {
        // 删除失败，显示错误信息
        ElMessage.error(res.message)
      }
    } catch (error) {
      console.error('删除菜单失败:', error)
      ElMessage.error('删除菜单失败')
    }
  }).catch(() => {
    // 用户取消删除
    ElMessage.info('已取消删除')
  })
}

/**
 * 组件挂载后自动执行
 * 初始化页面数据
 */
 onMounted(() => {
  // 组件挂载后自动获取菜单数据
  fetchMenuData()
})


</script>

<style scoped lang="scss">
.menu-manage-container {
  padding: 0;
}

.operation-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  
  .left-actions {
    display: flex;
    gap: 8px;
  }
  
  .right-search {
    display: flex;
    gap: 8px;
    
    .search-input {
      width: 220px;
    }
  }
}

.table-card {
  margin-bottom: 16px;
}

:deep(.el-table__row) {
  .cell {
    display: flex;
    align-items: center;
  }
}
/* 鼠标悬停效果 */
:deep(.el-table__row:hover) {
  background-color: #ecf5ff !important;
}
</style>