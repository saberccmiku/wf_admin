import request from '@/utils/request'

// 接口分页
export function pageList(data) {
  return request({
    url: '/wf/actInterfaces/page',
    method: 'post',
    data: { data: data }
  })
}

// 新增
export function add(data) {
  return request({
    url: '/wf/actInterfaces/insert',
    method: 'post',
    data
  })
}
