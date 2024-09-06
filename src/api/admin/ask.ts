import axios from '@/axios'

export function getAskPageList(data: any) {
  return axios.post('/admin/ask/list', data)
}

export function updateAskStatus(data: any) {
  return axios.post('/admin/ask/update', data)
}

export function deleteAsk(data: any) {
  return axios.post('/admin/ask/delete', data)
}
