import request from '@/utils/request'

/**
 * 检查文件分片是否已存在
 * @param {Object} params 包含fileHash和total的对象
 * @returns {Promise}
 */
export function checkChunks(params) {
  return request({
    url: '/api/system/file/check',
    method: 'get',
    params,
  }).then((res) => res.data?.data || { existedChunks: [] }) // 添加兜底数据
}

/**
 * 上传文件分片
 * @param {FormData} data 包含分片数据的FormData对象
 * @returns {Promise}
 */
export function uploadChunk(data) {
  return request({
    url: '/api/system/file/upload', // 保持/api前缀
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data,
    // 添加以下配置确保axios不会修改Content-Type和请求体格式
    transformRequest: [function (data) {
      // 直接返回FormData对象，不做任何转换
      return data;
    }],
  })
}

/**
 * 合并文件分片
 * @param {Object} data 包含fileHash、fileName和totalChunks的对象
 * @returns {Promise}
 */
export function mergeFile(data) {
  return request({
    url: '/api/system/file/merge',
    method: 'post',
    params: {
      // 改用params传递参数（后端使用@RequestParam接收）
      fileHash: data.fileHash,
      fileName: data.fileName, // 参数名对应后端@RequestParam
      totalChunks: data.totalChunks,
    },
  })
}

/**
 * 获取文件列表
 * @param {Object} params 包含pageNum和pageSize的对象
 * @returns {Promise}
 */
export function getFileList() {
  return request({
    url: '/api/system/file/list',
    method: 'get',
  })
}

// 为了兼容性，同时导出默认对象
export default {
  checkChunks,
  uploadChunk,
  mergeFile
}
