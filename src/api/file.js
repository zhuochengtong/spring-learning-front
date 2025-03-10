import request from '@/utils/axios'

// 修改接口路径匹配代理配置
export default {
  checkChunks: (params) =>
    request({
      url: '/api/files/check',
      method: 'get',
      params,
    }).then((res) => res.data?.data || { existedChunks: [] }), // 添加兜底数据

  uploadChunk: (data) =>
    request({
      url: '/api/files/upload', // 保持/api前缀
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' },
      data,
    }),

  mergeFile: (data) =>
    request({
      url: '/api/files/merge',
      method: 'post',
      params: {
        // 改用params传递参数（后端使用@RequestParam接收）
        fileHash: data.fileHash,
        fileName: data.fileName, // 参数名对应后端@RequestParam
        totalChunks: data.totalChunks,
      },
    }),
}
