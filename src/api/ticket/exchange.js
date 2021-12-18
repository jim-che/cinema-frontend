import request from '@/utils/request'

// 查询退换票管理列表
export function listExchange(query) {
  return request({
    url: '/ticket/exchange/list',
    method: 'get',
    params: query
  })
}

// 查询退换票管理详细
export function getExchange(id) {
  return request({
    url: '/ticket/exchange/' + id,
    method: 'get'
  })
}

// 新增退换票管理
export function addExchange(data) {
  return request({
    url: '/ticket/exchange',
    method: 'post',
    data: data
  })
}

// 修改退换票管理
export function updateExchange(data) {
  return request({
    url: '/ticket/exchange',
    method: 'put',
    data: data
  })
}

// 删除退换票管理
export function delExchange(id) {
  return request({
    url: '/ticket/exchange/' + id,
    method: 'delete'
  })
}
