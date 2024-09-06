import axios from '@/axios'
//获取所有的话题
export function getAllTalks() {
  return axios.get('/ask/talks')
}
//发布问题
export function publishQuestion(formObj: any) {
  return axios.post('/ask/publish', formObj)
}
//分页获取问答列表信息（普通）
export function getQuestionListPage(formObj: any) {
  return axios.post('/ask/page', formObj)
}
//分页获取问答列表信息（最热）
export function getQuestionHotListPage(formObj: any) {
  return axios.post('/ask/page/hot', formObj)
}
//分页获取问答列表信息（话题）
export function getQuestionTalkListPage(formObj: any) {
  return axios.post('/ask/page/talk', formObj)
}
//结题某个问答
export function overQuestion(id: number) {
  return axios.put(`/ask/over/${id}`)
}
//获取个人问答列表
export function getPersonalQuestionList(formObj: any) {
  return axios.post('/ask/get/personal', formObj)
}
//逻辑删除某个问答
export function deleteQuestionByIdLogical(id: Number) {
  return axios.get(`/ask/delete/${id}`)
}
//获取话题排行
export function getTalkRank() {
  return axios.get('/ask/talks/rank')
}
