import axios from '@/axios'

// 获取仪表盘基础信息（文章数、分类数、标签数、总浏览量）
export function getBaseStatisticsInfo() {
  return axios.post('/admin/dashboard/statistics')
}

// 获取仪表盘文章发布热点统计信息
export function getPublishArticleStatisticsInfo() {
  return axios.post('/admin/dashboard/publishArticle/statistics')
}

// 获取仪表盘文章发布热点统计信息
export function getPublishArticleStatisticsInfoLineChart() {
  return axios.post('/admin/dashboard/last/statistics')
}
