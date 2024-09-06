import axios from '@/axios'

//请求所有文章分类分页接口
export function getTagPageList(data: any) {
  return axios.post('/admin/tag/list', data)
}
// 添加分类
export function addTag(data: any) {
  return axios.post('/admin/tag/add', data)
}
// 更新分类
export function updateTag(data: any) {
  return axios.post('/admin/tag/update', data)
}
// 删除分类
export function deleteTag(idList: any) {
  return axios.post('/admin/tag/delete', idList)
}
