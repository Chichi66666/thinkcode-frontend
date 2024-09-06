import axios from '@/axios'

export function getCommentPageList(data: any) {
  return axios.post('/admin/comment/list', data)
}

export function deleteComment(idList: any) {
  return axios.post('/admin/comment/delete', idList)
}

// 审核评论
export function examineComment(data: any) {
  return axios.post('/admin/comment/examine', data)
}
