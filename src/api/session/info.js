import request from '@/utils/request'

// 查询影厅管理列表
export function listInfo(query) {
  return request({
    url: '/session/info/list',
    method: 'get',
    params: query
  })
}

// 查询影厅管理详细
export function getInfo(id) {
  return request({
    url: '/session/info/' + id,
    method: 'get'
  })
}

// 新增影厅管理
export function addInfo(data) {
  return request({
    url: '/session/info',
    method: 'post',
    data: data
  })
}

// 修改影厅管理
export function updateInfo(data) {
  return request({
    url: '/session/info',
    method: 'put',
    data: data
  })
}

// 删除影厅管理
export function delInfo(id) {
  return request({
    url: '/session/info/' + id,
    method: 'delete'
  })
}
