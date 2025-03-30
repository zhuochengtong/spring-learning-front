<template>
  <div class="guest-container">
    <!-- 新增隐藏的文件上传输入 -->
    <input ref="fileInput" type="file" style="display: none" @change="handleFileSelect" />

    <!-- 工具展示区 -->
    <div class="tool-grid">
      <el-card
        v-for="(tool, index) in tools"
        :key="index"
        class="tool-card"
        @click="handleToolClick(tool.action)"
      >
        <div class="card-content">
          <el-icon :size="40" class="tool-icon">
            <component :is="tool.icon" />
          </el-icon>
          <h3>{{ tool.title }}</h3>
          <p class="desc">{{ tool.description }}</p>
        </div>
      </el-card>
    </div>

    <!-- 游客提示 -->
    <div class="upload-progress" v-if="uploadProgress > 0">
      <el-progress :percentage="uploadProgress" :stroke-width="15" :status="uploadStatus" striped />
      <div class="upload-status" v-if="uploadStatus === 'success'">
        上传完成！文件正在转码处理...
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus' 
import { useRouter, useRoute } from 'vue-router' 
import { ref, markRaw, onMounted, watch } from 'vue' 
import { Upload, Download, Share, Delete, View, Setting, Files } from '@element-plus/icons-vue'
// 修改导入方式，使用命名导入
import { checkChunks, uploadChunk, mergeFile } from '@/api/system/file'
import SparkMD5 from 'spark-md5'

const router = useRouter()
const fileInput = ref(null) 
const uploadProgress = ref(0) 
const uploadStatus = ref('') 
uploadStatus.value = 'exception' 

// 新增页面初始化逻辑
const initPage = () => {
  console.log('文件管理页面初始化')
  // 重置上传状态
  uploadProgress.value = 0
  uploadStatus.value = ''
}

// 监听路由变化
const route = useRoute()
watch(
  () => route.path,
  () => {
    initPage()
  },
)

// 组件挂载时执行
onMounted(() => {
  initPage()
})

// 工具列表数据保持不变
const tools = ref([
  {
    title: '文件预览',
    icon: markRaw(View),
    description: '支持常见格式的在线预览',
    action: 'preview',
  },
  {
    title: '快速下载',
    icon: markRaw(Download),
    description: '高速下载已共享文件',
    action: 'download',
  },
  {
    title: '临时存储',
    icon: markRaw(Files), // 补充 markRaw
    description: '7天有效期的临时存储空间',
    action: 'storage',
  },
  {
    title: '分享管理',
    icon: markRaw(Share), // 补充 markRaw
    description: '查看已分享的文件链接',
    action: 'share',
  },
  {
    title: '回收站',
    icon: markRaw(Delete), // 补充 markRaw
    description: '保留30天的删除文件',
    action: 'trash',
  },
  {
    title: '系统设置',
    icon: markRaw(Setting), // 补充 markRaw
    description: '基础参数配置',
    action: 'settings',
  },
  {
    title: '文件上传',
    icon: markRaw(Upload), // 需要先导入Upload图标
    description: '支持大文件分片上传',
    action: 'upload',
  },
  {
    title: '文件列表',
    icon: markRaw(View), 
    description: '查看已上传的文件',
    action: 'listFile',
  },
])

// 工具点击处理保持不变
const handleToolClick = (action) => {
  // 根据实际需求实现不同功能
  console.log('触发功能:', action)
  if (action === 'preview') {
    router.push('/preview-demo') // 需要配置对应路由
  }
  if (action === 'upload') {
    fileInput.value.click() // 触发文件选择
    return
  }
  if (action === 'listFile') {
    router.push('/file/viewFile') // 需要配置对应路由
  }
}

// 文件选择处理
const handleFileSelect = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  try {
    uploadProgress.value = 0
    await uploadFile(file)
    ElMessage.success('文件上传成功')
  } catch (error) {
    ElMessage.error('上传失败: ' + error.message)
  } finally {
    fileInput.value.value = '' // 清空选择
  }
}

// 修改上传文件逻辑，使用命名导入的函数
const uploadFile = async (file) => {
  try {
    const CHUNK_SIZE = 5 * 1024 * 1024
    const chunks = Math.ceil(file.size / CHUNK_SIZE)
    const fileHash = await calcFileHash(file)
    
    // 使用命名导入的checkChunks函数
    const response = await checkChunks({
      fileHash,
      total: chunks,
    }).catch(handleCheckError)
    
    // 由于checkChunks已经处理了兜底数据，这里可以简化
    const existedChunks = response.existedChunks || []
    
    // 并行上传优化
    const uploadQueue = []
    let uploadedCount = existedChunks.length || 0

    for (let i = 0; i < chunks; i++) {
      if (existedChunks.includes(i)) continue

      const chunk = file.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE)
      const formData = new FormData()
      formData.append('chunk', chunk)
      formData.append('fileHash', fileHash)
      formData.append('chunkIndex', i)
      formData.append('totalChunks', chunks)

      uploadQueue.push(() =>
        uploadChunk(formData).then(() => {
          uploadedCount++
          uploadProgress.value = Math.min(95, Math.round((uploadedCount / chunks) * 95))
        }),
      )
    }

    // 控制并发数为3
    const PARALLEL_LIMIT = 3
    for (let i = 0; i < uploadQueue.length; i += PARALLEL_LIMIT) {
      await Promise.all(uploadQueue.slice(i, i + PARALLEL_LIMIT).map((fn) => fn()))
    }

    // 使用命名导入的mergeFile函数
    await mergeFile({
      fileHash,
      fileName: file.name,
      totalChunks: chunks,
    })

    uploadStatus.value = 'success'
    uploadProgress.value = 100
  } catch (error) {
    uploadStatus.value = 'error'
    throw error
  }
}

// 错误处理函数
const handleCheckError = (error) => {
  if (error.response?.status === 401) {
    router.push('/login')
  }
  throw new Error(`分片检查失败: ${error.message}`)
}

// 文件哈希计算函数保持不变
const calcFileHash = (file) => {
  return new Promise((resolve) => {
    const spark = new SparkMD5.ArrayBuffer()
    const reader = new FileReader()
    reader.onload = (e) => {
      spark.append(e.target.result)
      resolve(spark.end())
    }

    reader.readAsArrayBuffer(file)
  })
}
</script>

<style lang="scss" scoped>
// 主容器样式
.guest-container {
  width: 100%; // 占满父容器宽度
  margin: 0 auto; // 水平居中
  padding: 20px; // 内边距


  // 工具卡片网格容器
  .tool-grid {
    display: grid; // 使用网格布局
    grid-template-columns: repeat(3, 1fr); // 3列等宽布局
    gap: 20px; // 网格间距
    margin-bottom: 30px; // 底部外边距

    // 中等屏幕适配（992px以下）
    @media (max-width: 992px) {
      grid-template-columns: repeat(2, 1fr); // 改为2列布局
    }
    // 小屏幕适配（600px以下）
    @media (max-width: 600px) {
      grid-template-columns: 1fr; // 单列布局
    }
  }

  // 单个工具卡片样式
  .tool-card {
    cursor: pointer; // 鼠标手势
    transition: transform 0.3s ease; // 悬浮动画过渡效果

    // 卡片悬浮效果
    &:hover {
      transform: translateY(-5px); // 上移5像素
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1); // 添加阴影
    }

    // 卡片内容容器
    .card-content {
      text-align: center; // 内容居中
      padding: 20px; // 内边距

      // 工具图标样式
      .tool-icon {
        color: var(--el-color-primary); // 使用Element主题色
        margin-bottom: 15px; // 底部外边距
      }

      // 卡片标题
      h3 {
        margin: 10px 0; // 上下外边距
        color: #333; // 文字颜色
      }

      // 描述文字
      .desc {
        color: #666; // 浅灰色文字
        font-size: 0.9em; // 字体大小
        line-height: 1.6; // 行高
      }
    }
  }
}

.upload-progress {
  margin: 20px auto;
  max-width: 600px;

  .upload-status {
    margin-top: 10px;
    text-align: center;
    color: #67c23a;
    font-size: 14px;
  }
}
</style>
@/api/file/file
@/api/system/file