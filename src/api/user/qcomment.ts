import axios from '@/axios'
//分页获取某个问答的评论
export function getQCommentListPage(formObj: any) {
  return axios.post('/qcomment/page', formObj)
}
//分页获取次级评论
export function getSubQCommentListPage(obj: any) {
  return axios.post('/qcomment/subPage', obj)
}
//收藏某个问答
export function storeQCommentById(askId: Number) {
  return axios.get(`/qcomment/store/${askId}`)
}
//点赞某个问答
export function supportQCommentById(askId: Number) {
  return axios.get(`/qcomment/support/${askId}`)
}
//发布问答回复
export function publishQComment(obj: any) {
  return axios.post('/qcomment/publish', obj)
}
//采纳某个问答回复
export function selectQComment(askId: number, id: number) {
  return axios.put(`/qcomment/select/${askId}/${id}`)
}
//点赞某个回复
export function supportQCommentReply(id: number) {
  return axios.put(`/qcomment/support/${id}`)
}
