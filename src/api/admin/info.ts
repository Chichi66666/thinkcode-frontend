import axios from '@/axios'

export function getInfoPageList(data: any) {
  return axios.post('/info/list', data)
}

export function addInfo(data: any) {
  return axios.post('/info/add', data)
}
export function deleteInfo(data: any) {
  return axios.post('/info/delete', data)
}
