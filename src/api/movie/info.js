import request from '@/utils/request'

// 查询电影信息列表
export function listInfo(query) {
  return request({
    url: '/movie/info/list',
    method: 'get',
    params: query
  })
}

// 查询电影信息详细
export function getInfo(id) {
  return request({
    url: '/movie/info/' + id,
    method: 'get'
  })
}

// 新增电影信息
export function addInfo(data) {
  return request({
    url: '/movie/info',
    method: 'post',
    data: data
  })
}

// 修改电影信息
export function updateInfo(data) {
  return request({
    url: '/movie/info',
    method: 'put',
    data: data
  })
}

// 删除电影信息
export function delInfo(id) {
  return request({
    url: '/movie/info/' + id,
    method: 'delete'
  })
}
