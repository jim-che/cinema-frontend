import request from '@/utils/request'

// 查询场次管理列表
export function listManage(query) {
  return request({
    url: '/session/manage/list',
    method: 'get',
    params: query
  })
}

// 查询场次管理详细
export function getManage(id) {
  return request({
    url: '/session/manage/' + id,
    method: 'get'
  })
}

// 新增场次管理
export function addManage(data) {
  return request({
    url: '/session/manage',
    method: 'post',
    data: data
  })
}

// 修改场次管理
export function updateManage(data) {
  return request({
    url: '/session/manage',
    method: 'put',
    data: data
  })
}

// 删除场次管理
export function delManage(id) {
  return request({
    url: '/session/manage/' + id,
    method: 'delete'
  })
}
