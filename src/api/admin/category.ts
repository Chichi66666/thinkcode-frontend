import axios from '@/axios'

//请求所有文章分类分页接口
export function getCategoryPageList(data: any) {
  return axios.post('/admin/category/list', data)
}
// 添加分类
export function addCategory(data: any) {
  return axios.post('/admin/category/add', data)
}
// 更新分类
export function updateCategory(data: any) {
  return axios.post('/admin/category/update', data)
}
// 删除分类
export function deleteCategory(idList: any) {
  return axios.post('/admin/category/delete', idList)
}
