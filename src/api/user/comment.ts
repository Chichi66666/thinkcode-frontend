import axios from '@/axios'

//获取某篇文章的所有一级评论的个数
export function getTotalComment(articleId: number | undefined) {
  return axios.get(`/comment/total/${articleId}`)
}

//获取某篇文章的评论
export function getCommentPage(reqObj: any) {
  return axios.post('/comment/page', reqObj)
}

//获取某篇剩余的二级评论
export function getSubComments(reqObj: any) {
  return axios.post('/comment/subComments', reqObj)
}

//发布评论
export function publishComment(reqObj: any) {
  return axios.post('/comment/publish', reqObj)
}
//点赞某个评论
export function supportCommentById(id: number | undefined) {
  return axios.put(`/comment/support/${id}`)
}
