import axios from '@/axios'
//文章分页搜索

export function searchArticleByKeyWords(formObj: any) {
  return axios.post('/article/search', formObj)
}
