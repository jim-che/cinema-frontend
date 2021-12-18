import request from '@/utils/request'

// 查询影院信息列表
export function listInfo(query) {
  return request({
    url: '/manage/info/list',
    method: 'get',
    params: query
  })
}

// 查询影院信息详细
export function getInfo(id) {
  return request({
    url: '/manage/info/' + id,
    method: 'get'
  })
}

// 新增影院信息
export function addInfo(data) {
  return request({
    url: '/manage/info',
    method: 'post',
    data: data
  })
}

// 修改影院信息
export function updateInfo(data) {
  return request({
    url: '/manage/info',
    method: 'put',
    data: data
  })
}

// 删除影院信息
export function delInfo(id) {
  return request({
    url: '/manage/info/' + id,
    method: 'delete'
  })
}
