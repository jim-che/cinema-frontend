import request from '@/utils/request'

// 查询加班薪资管理列表
export function listOvertime(query) {
  return request({
    url: '/compensation/overtime/list',
    method: 'get',
    params: query
  })
}

export function getEmployeeIds(){
  return request({
    url: '/compensation/overtime/list2',
    method: 'get'
  })
}

// 查询加班薪资管理详细
export function getOvertime(id) {
  return request({
    url: '/compensation/overtime/' + id,
    method: 'get'
  })
}

// 新增加班薪资管理
export function addOvertime(data) {
  return request({
    url: '/compensation/overtime',
    method: 'post',
    data: data
  })
}

// 修改加班薪资管理
export function updateOvertime(data) {
  return request({
    url: '/compensation/overtime',
    method: 'put',
    data: data
  })
}

// 删除加班薪资管理
export function delOvertime(id) {
  return request({
    url: '/compensation/overtime/' + id,
    method: 'delete'
  })
}
