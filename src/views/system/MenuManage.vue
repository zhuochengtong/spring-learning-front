<template>
  <div class="menu-manage-container">
    <!-- 顶部操作区 -->
    <div class="operation-bar">
      <div class="left-actions">
        <el-button type="primary" @click="handleAddMenu">
          <el-icon><Plus /></el-icon>新增菜单
        </el-button>
        <el-button type="success" @click="handleExpandAll">
          <el-icon><Expand /></el-icon>展开/折叠
        </el-button>
        <el-button type="warning" @click="refreshTable">
          <el-icon><RefreshRight /></el-icon>刷新
        </el-button>
      </div>
      <div class="right-search">
        <el-input
          v-model="searchKey"
          placeholder="请输入菜单名称"
          class="search-input"
          clearable
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </div>
    </div>

    <!-- 表格区域 -->
    <el-card class="table-card">
      <el-table
        :data="filteredMenuData"
        row-key="id"
        border
        default-expand-all
        :tree-props="{ children: 'children' }"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column prop="title" label="菜单名称" min-width="180">
          <template #default="scope">
            <el-icon v-if="scope.row.icon"><component :is="scope.row.icon" /></el-icon>
            <span style="margin-left: 8px">{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <!-- 其他列保持不变 -->
        <el-table-column prop="path" label="路由路径" min-width="180" />
        <el-table-column prop="component" label="组件路径" min-width="180" />
        <el-table-column prop="permission" label="权限标识" min-width="150" />
        <el-table-column prop="sort" label="排序" width="80" align="center" />
        <el-table-column prop="type" label="类型" width="100" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.type === 0" type="success">目录</el-tag>
            <el-tag v-else-if="scope.row.type === 1" type="primary">菜单</el-tag>
            <el-tag v-else-if="scope.row.type === 2" type="warning">按钮</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" align="center" fixed="right">
          <template #default="scope">
            <el-button type="primary" link @click="handleEdit(scope.row)">
              <el-icon><Edit /></el-icon>编辑
            </el-button>
            <el-button type="primary" link @click="handleAddChild(scope.row)">
              <el-icon><Plus /></el-icon>添加
            </el-button>
            <el-button type="danger" link @click="handleDelete(scope.row)">
              <el-icon><Delete /></el-icon>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 菜单表单对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="600px"
      destroy-on-close
    >
      <el-form
        ref="menuFormRef"
        :model="menuForm"
        :rules="menuRules"
        label-width="100px"
      >
        <el-form-item label="上级菜单" prop="parentId">
          <el-tree-select
            v-model="menuForm.parentId"
            :data="menuTreeOptions"
            check-strictly
            default-expand-all
            node-key="id"
            :render-after-expand="false"
            placeholder="请选择上级菜单"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="menuForm.type">
            <el-radio :label="0">目录</el-radio>
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称" prop="title">
          <el-input v-model="menuForm.title" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="路由路径" prop="path" v-if="menuForm.type !== 2">
          <el-input v-model="menuForm.path" placeholder="请输入路由路径" />
        </el-form-item>
        <el-form-item label="组件路径" prop="component" v-if="menuForm.type === 1">
          <el-input v-model="menuForm.component" placeholder="请输入组件路径" />
        </el-form-item>
        <el-form-item label="权限标识" prop="permission" v-if="menuForm.type !== 0">
          <el-input v-model="menuForm.permission" placeholder="请输入权限标识" />
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon" v-if="menuForm.type !== 2">
          <el-input v-model="menuForm.icon" placeholder="请输入菜单图标" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="menuForm.sort" :min="0" :max="999" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="menuForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus, Edit, Delete, Search, RefreshRight,
  Expand, Document, Menu, Setting
} from '@element-plus/icons-vue'
import { getMenuList, addMenu, updateMenu, deleteMenu } from '@/api/system/menu'

// 数据加载状态
const loading = ref(false)
// 菜单数据
const menuData = ref([])
// 搜索关键字
const searchKey = ref('')
// 是否展开所有
const isExpandAll = ref(true)
// 对话框相关
const dialogVisible = ref(false)
const dialogTitle = ref('新增菜单')
const menuFormRef = ref(null)
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

// 表单验证规则
const menuRules = {
  title: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
  path: [{ required: true, message: '请输入路由路径', trigger: 'blur' }],
  component: [{ required: true, message: '请输入组件路径', trigger: 'blur' }]
}

// 过滤后的菜单数据
const filteredMenuData = computed(() => {
  if (!searchKey.value) return menuData.value
  
  // 递归搜索菜单
  const filterMenus = (menus) => {
    return menus.filter(menu => {
      const matchCurrent = menu.title.includes(searchKey.value)
      
      // 处理子菜单
      if (menu.children && menu.children.length) {
        menu.children = filterMenus(menu.children)
        return matchCurrent || menu.children.length > 0
      }
      
      return matchCurrent
    })
  }
  
  return filterMenus(JSON.parse(JSON.stringify(menuData.value)))
})

// 菜单树选择器选项
const menuTreeOptions = computed(() => {
  // 添加一个根节点选项
  return [
    {
      id: 0,
      title: '根菜单',
      children: menuData.value
    }
  ]
})

// 获取菜单数据
const fetchMenuData = async () => {
  loading.value = true
  try {
    const res = await getMenuList()
    menuData.value = res || []
  } catch (error) {
    console.error('获取菜单数据失败:', error)
    ElMessage.error('获取菜单数据失败')
  } finally {
    loading.value = false
  }
}

// 刷新表格
const refreshTable = () => {
  fetchMenuData()
}

// 搜索
const handleSearch = () => {
  // 搜索时自动展开所有
  isExpandAll.value = true
}

// 展开/折叠所有
const handleExpandAll = () => {
  isExpandAll.value = !isExpandAll.value
}

// 新增菜单
const handleAddMenu = () => {
  resetForm()
  dialogTitle.value = '新增菜单'
  dialogVisible.value = true
}

// 新增子菜单
const handleAddChild = (row) => {
  resetForm()
  menuForm.parentId = row.id
  dialogTitle.value = `新增 ${row.title} 的子菜单`
  dialogVisible.value = true
}

// 编辑菜单
const handleEdit = (row) => {
  resetForm()
  dialogTitle.value = '编辑菜单'
  // 复制数据到表单
  Object.keys(menuForm).forEach(key => {
    if (key in row) {
      menuForm[key] = row[key]
    }
  })
  dialogVisible.value = true
}

// 删除菜单
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除菜单 "${row.title}" 吗？${row.children?.length ? '将同时删除其所有子菜单！' : ''}`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await deleteMenu(row.id)
      ElMessage.success('删除成功')
      refreshTable()
    } catch (error) {
      console.error('删除菜单失败:', error)
      ElMessage.error('删除菜单失败')
    }
  }).catch(() => {})
}

// 修改菜单状态
const handleStatusChange = async (row) => {
  try {
    await updateMenu({
      id: row.id,
      status: row.status
    })
    ElMessage.success('状态修改成功')
  } catch (error) {
    console.error('修改菜单状态失败:', error)
    ElMessage.error('修改菜单状态失败')
    // 恢复原状态
    row.status = row.status === 1 ? 0 : 1
  }
}

// 重置表单
const resetForm = () => {
  if (menuFormRef.value) {
    menuFormRef.value.resetFields()
  }
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

// 提交表单
const submitForm = async () => {
  if (!menuFormRef.value) return
  
  await menuFormRef.value.validate(async (valid) => {
    if (!valid) return
    
    try {
      if (menuForm.id) {
        // 更新
        await updateMenu(menuForm)
        ElMessage.success('更新成功')
      } else {
        // 新增
        await addMenu(menuForm)
        ElMessage.success('新增成功')
      }
      dialogVisible.value = false
      refreshTable()
    } catch (error) {
      console.error('保存菜单失败:', error)
      ElMessage.error('保存菜单失败')
    }
  })
}

// 初始化
onMounted(() => {
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