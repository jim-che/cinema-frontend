import request from '@/utils/request'

// 查询出票管理列表
export function listDraw(query) {
  return request({
    url: '/ticket/draw/list',
    method: 'get',
    params: query
  })
}

// 查询出票管理详细
export function getDraw(id) {
  return request({
    url: '/ticket/draw/' + id,
    method: 'get'
  })
}

// 新增出票管理
export function addDraw(data) {
  return request({
    url: '/ticket/draw',
    method: 'post',
    data: data
  })
}

// 修改出票管理
export function updateDraw(data) {
  return request({
    url: '/ticket/draw',
    method: 'put',
    data: data
  })
}

// 删除出票管理
export function delDraw(id) {
  return request({
    url: '/ticket/draw/' + id,
    method: 'delete'
  })
}
