import request from '@/utils/request'

// 查询影厅管理列表
export function listHall(query) {
  return request({
    url: '/manage/hall/list',
    method: 'get',
    params: query
  })
}

// 查询影厅管理详细
export function getHall(id) {
  return request({
    url: '/manage/hall/' + id,
    method: 'get'
  })
}

// 新增影厅管理
export function addHall(data) {
  return request({
    url: '/manage/hall',
    method: 'post',
    data: data
  })
}

// 修改影厅管理
export function updateHall(data) {
  return request({
    url: '/manage/hall',
    method: 'put',
    data: data
  })
}

// 删除影厅管理
export function delHall(id) {
  return request({
    url: '/manage/hall/' + id,
    method: 'delete'
  })
}
