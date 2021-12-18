import request from '@/utils/request'

// 查询全勤奖金管理列表
export function listBonus(query) {
  return request({
    url: '/compensation/bonus/list',
    method: 'get',
    params: query
  })
}

// 查询全勤奖金管理详细
export function getBonus(id) {
  return request({
    url: '/compensation/bonus/' + id,
    method: 'get'
  })
}

// 新增全勤奖金管理
export function addBonus(data) {
  return request({
    url: '/compensation/bonus',
    method: 'post',
    data: data
  })
}

// 修改全勤奖金管理
export function updateBonus(data) {
  return request({
    url: '/compensation/bonus',
    method: 'put',
    data: data
  })
}

// 删除全勤奖金管理
export function delBonus(id) {
  return request({
    url: '/compensation/bonus/' + id,
    method: 'delete'
  })
}
