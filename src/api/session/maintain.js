import request from '@/utils/request'

// 查询维护管理列表
export function listMaintain(query) {
  return request({
    url: '/session/maintain/list',
    method: 'get',
    params: query
  })
}

// 查询维护管理详细
export function getMaintain(id) {
  return request({
    url: '/session/maintain/' + id,
    method: 'get'
  })
}

// 新增维护管理
export function addMaintain(data) {
  return request({
    url: '/session/maintain',
    method: 'post',
    data: data
  })
}

// 修改维护管理
export function updateMaintain(data) {
  return request({
    url: '/session/maintain',
    method: 'put',
    data: data
  })
}

// 删除维护管理
export function delMaintain(id) {
  return request({
    url: '/session/maintain/' + id,
    method: 'delete'
  })
}
