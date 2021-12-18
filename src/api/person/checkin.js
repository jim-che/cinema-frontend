import request from '@/utils/request'

// 查询考勤管理列表
export function listCheckin(query) {
  return request({
    url: '/person/checkin/list',
    method: 'get',
    params: query
  })
}

// 查询考勤管理详细
export function getCheckin(id) {
  return request({
    url: '/person/checkin/' + id,
    method: 'get'
  })
}

// 新增考勤管理
export function addCheckin(data) {
  return request({
    url: '/person/checkin',
    method: 'post',
    data: data
  })
}

// 修改考勤管理
export function updateCheckin(data) {
  return request({
    url: '/person/checkin',
    method: 'put',
    data: data
  })
}

// 删除考勤管理
export function delCheckin(id) {
  return request({
    url: '/person/checkin/' + id,
    method: 'delete'
  })
}
