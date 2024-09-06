import axios from '@/axios'

export function getUserPageList(data: any) {
  return axios.post('/admin/user/list', data)
}
