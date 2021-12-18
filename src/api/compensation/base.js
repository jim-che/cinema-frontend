import request from '@/utils/request'

// 查询基本工资管理列表
export function listBase(query) {
  return request({
    url: '/compensation/base/list',
    method: 'get',
    params: query
  })
}

// 查询基本工资管理详细
export function getBase(id) {
  return request({
    url: '/compensation/base/' + id,
    method: 'get'
  })
}

// 新增基本工资管理
export function addBase(data) {
  return request({
    url: '/compensation/base',
    method: 'post',
    data: data
  })
}

// 修改基本工资管理
export function updateBase(data) {
  return request({
    url: '/compensation/base',
    method: 'put',
    data: data
  })
}

// 删除基本工资管理
export function delBase(id) {
  return request({
    url: '/compensation/base/' + id,
    method: 'delete'
  })
}
