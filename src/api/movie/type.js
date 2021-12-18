import request from '@/utils/request'

// 查询电影类型列表
export function listType(query) {
  return request({
    url: '/movie/type/list',
    method: 'get',
    params: query
  })
}

// 查询电影类型详细
export function getType(id) {
  return request({
    url: '/movie/type/' + id,
    method: 'get'
  })
}

// 新增电影类型
export function addType(data) {
  return request({
    url: '/movie/type',
    method: 'post',
    data: data
  })
}

// 修改电影类型
export function updateType(data) {
  return request({
    url: '/movie/type',
    method: 'put',
    data: data
  })
}

// 删除电影类型
export function delType(id) {
  return request({
    url: '/movie/type/' + id,
    method: 'delete'
  })
}
