import request from '@/utils/request'

// 查询票房管理列表
export function listOffice(query) {
  return request({
    url: '/movie/office/list',
    method: 'get',
    params: query
  })
}

// 查询票房管理详细
export function getOffice(id) {
  return request({
    url: '/movie/office/' + id,
    method: 'get'
  })
}

// 新增票房管理
export function addOffice(data) {
  return request({
    url: '/movie/office',
    method: 'post',
    data: data
  })
}

// 修改票房管理
export function updateOffice(data) {
  return request({
    url: '/movie/office',
    method: 'put',
    data: data
  })
}

// 删除票房管理
export function delOffice(id) {
  return request({
    url: '/movie/office/' + id,
    method: 'delete'
  })
}
