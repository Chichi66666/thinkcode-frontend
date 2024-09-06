import axios from '@/axios'

export function getQCommentPageList(data: any) {
  return axios.post('/admin/qcomment/list', data)
}

export function deleteQComment(idList: any) {
  return axios.post('/admin/qcomment/delete', idList)
}

export function examineQComment(data: any) {
  return axios.post('/admin/qcomment/examine', data)
}
