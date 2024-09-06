import axios from '@/axios'

export function getTalkPageList(data: any) {
  return axios.post('/admin/talk/list', data)
}

export function addTalk(data: any) {
  return axios.post('/admin/talk/add', data)
}

export function updateTalk(data: any) {
  return axios.post('/admin/talk/update', data)
}

export function deleteTalk(idList: any) {
  return axios.post('/admin/talk/delete', idList)
}
