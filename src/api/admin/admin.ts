import axios from '@/axios'

//管理员更新密码
export function updatePassword(reqForm: any) {
  return axios.post('/admin/password/update', reqForm)
}
//管理员退出登录
export function logout() {
  return axios.get('/admin/logout')
}
