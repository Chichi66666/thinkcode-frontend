import axios from '@/axios'

export function getArticlePageList(data: any) {
  return axios.post('/admin/article/list', data)
}

export function updateArticleStatus(data: any) {
  return axios.post('/admin/article/update', data)
}

export function deleteArticle(idList: any) {
  return axios.post('/admin/article/delete', idList)
}
