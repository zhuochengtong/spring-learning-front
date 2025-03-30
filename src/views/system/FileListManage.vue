<template>
  <div class="file-list-container">
    <el-card class="box-card" :body-style="{ padding: '10px' }">
      <template #header>
        <div class="card-header">
          <span>文件列表</span>
          <el-button type="primary" @click="refreshFileList">刷新列表</el-button>
        </div>
      </template>
      <el-table
        v-loading="loading"
        :data="fileList"
        style="width: 100%"
        border
        stripe
      >
        <!-- 表格内容保持不变 -->
        <el-table-column
          type="index"
          label="序号"
          width="80"
          align="center"
        />
        <el-table-column
          prop="fileName"
          label="文件名"
          min-width="300"
        >
          <template #default="scope">
            <div class="file-name-cell">
              <el-icon class="file-icon"><Document /></el-icon>
              <span>{{ scope.row.fileName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="size"
          label="文件大小"
          width="150"
          align="center"
        >
          <template #default="scope">
            <span>{{ formatFileSize(scope.row.size) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="150"
          align="center"
        >
          <template #default="scope">
            <el-button
              type="primary"
              link
              @click="downloadFile(scope.row.fileName)"
            >
              下载
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="empty-block" v-if="fileList.length === 0 && !loading">
        <el-empty description="暂无文件" />
      </div>
    </el-card>
  </div>
</template>

<!-- script部分保持不变 -->
<script setup>
import { ref, onMounted } from 'vue'
import { Document } from '@element-plus/icons-vue'
import { getFileList } from '@/api/system/file'
import { ElMessage } from 'element-plus'

const fileList = ref([])
const loading = ref(false)

// 格式化文件大小
const formatFileSize = (size) => {
  if (size === 0) return '0 B'
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(size) / Math.log(1024))
  return (size / Math.pow(1024, i)).toFixed(2) + ' ' + units[i]
}

// 获取文件列表
const fetchFileList = async () => {
  loading.value = true
  try {
    const res = await getFileList()
    if (res.data && Array.isArray(res.data)) {
      fileList.value = res.data
    } else {
      fileList.value = []
      ElMessage.warning('获取文件列表失败')
    }
  } catch (error) {
    console.error('获取文件列表出错:', error)
    ElMessage.error('获取文件列表失败')
    fileList.value = []
  } finally {
    loading.value = false
  }
}

// 刷新文件列表
const refreshFileList = () => {
  fetchFileList()
}

// 下载文件
const downloadFile = (fileName) => {
  // 这里可以实现文件下载逻辑
  // 示例：通过创建一个隐藏的a标签并模拟点击来下载文件
  ElMessage.success(`准备下载文件: ${fileName}`)
  // 实际下载逻辑需要根据后端API实现
  // window.open(`/api/system/file/download?fileName=${encodeURIComponent(fileName)}`, '_blank')
}

// 页面加载时获取文件列表
onMounted(() => {
  fetchFileList()
})
</script>

<style scoped>
.file-list-container {
  padding: 0;
  width: 100%;
}

.box-card {
  margin: 0;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 5px;
}

.file-name-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.file-icon {
  color: #409EFF;
}

.empty-block {
  margin: 20px 0;
}
</style>