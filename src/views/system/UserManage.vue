<template>
  <div class="user-manage-container">
    <el-card class="box-card">
      <!-- 搜索区域 -->
      <div class="search-box">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
          <el-form-item label="用户名">
            <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable />
          </el-form-item>
          <el-form-item label="状态">
            <el-select 
              v-model="searchForm.isEnabled" 
              placeholder="请选择状态" 
              clearable
              class="status-select"
            >
              <el-option label="启用" :value="1" />
              <el-option label="禁用" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 操作按钮区域 -->
      <div class="action-box">
        <el-button type="primary" @click="handleAdd">新增用户</el-button>
        <el-button type="danger" :disabled="!selectedRows.length" @click="handleBatchDelete">批量删除</el-button>
      </div>

      <!-- 表格区域 -->
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="email" label="邮箱" width="180" />
        <el-table-column prop="phone" label="手机号" width="120" />
        <el-table-column label="头像" width="80">
          <template #default="scope">
            <el-avatar :size="40" :src="scope.row.avatar" />
          </template>
        </el-table-column>
        <el-table-column prop="lastLogin" label="最后登录时间" width="180" />
        <el-table-column label="状态" width="120">
          <template #default="scope">
            <div class="status-column">
              <el-switch
                v-model="scope.row.isEnabled"
                :active-value="1"
                :inactive-value="0"
                @change="handleToggleStatus(scope.row)"
                class="status-switch"
                inline-prompt
                active-text="启用"
                inactive-text="禁用"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="锁定状态" width="80">
          <template #default="scope">
            <el-tag :type="scope.row.isLocked ? 'danger' : 'info'">
              {{ scope.row.isLocked ? '已锁定' : '未锁定' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="creatorTime" label="创建时间" width="180" />
        <el-table-column label="操作" fixed="right" width="150">
          <template #default="scope">
            <el-button type="primary" link @click="handleEdit(scope.row)">
              <el-icon><Edit /></el-icon>编辑
            </el-button>
            <el-button type="danger" link @click="handleDelete(scope.row)">
              <el-icon><Delete /></el-icon>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <div class="pagination-box">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 用户表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增用户' : '编辑用户'"
      width="500px"
    >
      <el-form
        ref="userFormRef"
        :model="userForm"
        :rules="userFormRules"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="dialogType === 'add'">
          <el-input v-model="userForm.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userForm.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <el-input v-model="userForm.avatar" placeholder="请输入头像URL" />
        </el-form-item>
        <el-form-item label="状态" prop="isEnabled">
          <el-switch
            v-model="userForm.isEnabled"
            :active-value="1"
            :inactive-value="0"
            inline-prompt
            active-text="启用"
            inactive-text="禁用"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitUserForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getUserList, addUser, updateUser, deleteUser } from '@/api/system/user'
// 导入Element Plus图标组件，这些图标将用于界面中的按钮和表格等位置
import {
  Plus,
  Edit,
  Delete,
} from '@element-plus/icons-vue'

// 表格数据
const tableData = ref([])
const loading = ref(false)
const selectedRows = ref([])

// 分页参数
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 搜索表单
const searchForm = reactive({
  username: '',
  isEnabled: ''
})

// 用户表单对话框
const dialogVisible = ref(false)
const dialogType = ref('add') // 'add' 或 'edit'
const userFormRef = ref(null)
const userForm = reactive({
  username: '',
  password: '',
  email: '',
  phone: '',
  avatar: '',
  isEnabled: 1
})

// 表单验证规则
const userFormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ]
}

// 获取用户列表数据
const fetchUserList = async () => {
  loading.value = true
  try {
    const params = {
      currentPage: pagination.currentPage,
      pageSize: pagination.pageSize,
      ...searchForm
    }
    
    const res = await getUserList(params)
    if (res.code === 200) {
      tableData.value = res.data.list
      pagination.total = res.data.pagination.total
    } else {
      ElMessage.error(res.msg || '获取用户列表失败')
    }
  } catch (error) {
    console.error('获取用户列表出错:', error)
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

// 组件挂载时获取数据
onMounted(() => {
  fetchUserList()
})

// 表格多选事件
const handleSelectionChange = (rows) => {
  selectedRows.value = rows
}

// 搜索
const handleSearch = () => {
  pagination.currentPage = 1
  fetchUserList()
}

// 重置搜索
const resetSearch = () => {
  Object.keys(searchForm).forEach(key => {
    searchForm[key] = ''
  })
  pagination.currentPage = 1
  fetchUserList()
}

// 分页大小变化
const handleSizeChange = (val) => {
  pagination.pageSize = val
  fetchUserList()
}

// 当前页变化
const handleCurrentChange = (val) => {
  pagination.currentPage = val
  fetchUserList()
}

// 新增用户
const handleAdd = () => {
  dialogType.value = 'add'
  Object.keys(userForm).forEach(key => {
    userForm[key] = key === 'isEnabled' ? 1 : ''
  })
  dialogVisible.value = true
}

// 编辑用户
const handleEdit = (row) => {
  dialogType.value = 'edit'
  Object.keys(userForm).forEach(key => {
    if (key in row) {
      userForm[key] = row[key]
    }
  })
  dialogVisible.value = true
}

// 删除用户
const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该用户吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await deleteUser(row.id)
      if (res.code === 200) {
        ElMessage.success('删除成功')
        fetchUserList()
      } else {
        ElMessage.error(res.msg || '删除失败')
      }
    } catch (error) {
      console.error('删除用户出错:', error)
      ElMessage.error('删除失败')
    }
  }).catch(() => {})
}

// 批量删除
const handleBatchDelete = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要删除的用户')
    return
  }
  
  ElMessageBox.confirm(`确定要删除选中的 ${selectedRows.value.length} 个用户吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      // 这里应该调用批量删除API，这里简化为循环单个删除
      const promises = selectedRows.value.map(row => deleteUser(row.id))
      await Promise.all(promises)
      ElMessage.success('批量删除成功')
      fetchUserList()
    } catch (error) {
      console.error('批量删除用户出错:', error)
      ElMessage.error('批量删除失败')
    }
  }).catch(() => {})
}

// 切换用户状态
const handleToggleStatus = async (row) => {
  try {
    const res = await updateUser(row.id, {
      isEnabled: row.isEnabled
    })
    
    if (res.code === 200) {
      ElMessage.success(`用户已${row.isEnabled === 1 ? '启用' : '禁用'}`)
    } else {
      // 如果更新失败，恢复原来的状态
      row.isEnabled = row.isEnabled === 1 ? 0 : 1
      ElMessage.error(res.msg || '操作失败')
    }
  } catch (error) {
    // 如果发生错误，恢复原来的状态
    row.isEnabled = row.isEnabled === 1 ? 0 : 1
    console.error('切换用户状态出错:', error)
    ElMessage.error('操作失败')
  }
}

// 提交用户表单
const submitUserForm = async () => {
  if (!userFormRef.value) return
  
  await userFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const api = dialogType.value === 'add' ? addUser : updateUser
        const res = await api(userForm)
        
        if (res.code === 200) {
          ElMessage.success(dialogType.value === 'add' ? '添加成功' : '更新成功')
          dialogVisible.value = false
          fetchUserList()
        } else {
          ElMessage.error(res.msg || (dialogType.value === 'add' ? '添加失败' : '更新失败'))
        }
      } catch (error) {
        console.error(dialogType.value === 'add' ? '添加用户出错:' : '更新用户出错:', error)
        ElMessage.error(dialogType.value === 'add' ? '添加失败' : '更新失败')
      }
    }
  })
}
</script>

<style scoped lang="scss">
.user-manage-container {
  width: 100%;
  max-width: 100%;
  padding: 0; // 移除内边距
  
  .box-card {
    margin-bottom: 20px;
    border-radius: 4px;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  }
  
  .search-box {
    margin-bottom: 20px;
    
    .status-select {
      width: 180px; // 设置足够的宽度以显示选项内容
    }
  }
  
  .action-box {
    margin-bottom: 20px;
    display: flex;
    justify-content: flex-start;
    
    .el-button {
      margin-right: 10px;
    }
  }
  
  .pagination-box {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
  
  .status-column {
    display: flex;
    align-items: center;
    justify-content: center;
    
    .status-switch {
      width: 75px; // 调整宽度以适应内部文字
    }
  }
}

// 覆盖 el-card 的默认内边距，使其与面包屑保持一致
:deep(.el-card__body) {
  padding: 16px 20px;
}

// 移除不再需要的开关标签样式
:deep(.el-switch__label) {
  display: none;
}
</style>