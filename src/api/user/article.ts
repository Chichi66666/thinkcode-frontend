import axios from '@/axios'

//分页获取文章列表请求，post,默认方式
export function getArticlePage(current: Number, size: Number) {
  return axios.post('/article/page', { current, size })
}

//分页获取文章列表请求，post,类型方式
export function getArticlePageType(key: String, current: Number, size: Number) {
  return axios.post('/article/page/type', { key, current, size })
}

//分页获取文章列表请求，post,观看量方式
export function getArticlePageRead(current: Number, size: Number) {
  return axios.post('/article/page/read', { current, size })
}

//获取所有文章类别
export function getArticleCategory() {
  return axios.get('/article/category')
}

//获取文章的所有tag
export function getArticleAllTag() {
  return axios.get('/article/tags')
}

//文章发布接,post
export function publishArticle(obj: any) {
  return axios.post('/article/publish', obj)
}

//获取某篇文章的详情
export function getArticleDetail(articleId: any) {
  return axios.get(`/article/detail/${articleId}`)
}

//删除已经上传的图片
export function deleteUploaded(fileName: string) {
  return axios.delete(`/article/revoke/${fileName}`)
}

//点赞或者撤销点赞某条文章
export function toggleArticleSupport(articleId: any) {
  return axios.get(`/article/support/${articleId}`)
}

//收藏或者撤销收藏某篇文章
export function toggleArticleStore(articleId: any) {
  return axios.get(`/article/store/${articleId}`)
}
//获取个人的所有文章
export function getArticlePersonal(obj: any) {
  return axios.post('/article/manage/all', obj)
}
//获取某篇文章的题目和内容
export function getArticleById(articleId: Number) {
  return axios.get(`/article/get/${articleId}`)
}

//获取某篇文章的类型和标签ID
export function getArticleOtherInfo(articleId: Number) {
  return axios.get(`/article/getOthers/${articleId}`)
}

//逻辑删除文章
export function deleteArticleByIdLogical(ArticleId: Number) {
  return axios.delete(`/article/delete/${ArticleId}`)
}
