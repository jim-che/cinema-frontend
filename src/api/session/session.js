import request from '@/utils/request'

// 查询维护管理列表
export function listSession(query) {
  return request({
    url: '/session/session/list',
    method: 'get',
    params: query
  })
}

// 查询维护管理详细
export function getSession(id) {
  return request({
    url: '/session/session/' + id,
    method: 'get'
  })
}

// 新增维护管理
export function addSession(data) {
  return request({
    url: '/session/session',
    method: 'post',
    data: data
  })
}

// 修改维护管理
export function updateSession(data) {
  return request({
    url: '/session/session',
    method: 'put',
    data: data
  })
}

// 删除维护管理
export function delSession(id) {
  return request({
    url: '/session/session/' + id,
    method: 'delete'
  })
}
