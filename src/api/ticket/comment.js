import request from '@/utils/request'

// 查询影片评价列表
export function listComment(query) {
  return request({
    url: '/ticket/comment/list',
    method: 'get',
    params: query
  })
}

// 查询影片评价详细
export function getComment(id) {
  return request({
    url: '/ticket/comment/' + id,
    method: 'get'
  })
}

// 新增影片评价
export function addComment(data) {
  return request({
    url: '/ticket/comment',
    method: 'post',
    data: data
  })
}

// 修改影片评价
export function updateComment(data) {
  return request({
    url: '/ticket/comment',
    method: 'put',
    data: data
  })
}

// 删除影片评价
export function delComment(id) {
  return request({
    url: '/ticket/comment/' + id,
    method: 'delete'
  })
}
