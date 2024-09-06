import axios from '@/axios'
import type { LocationQueryValue } from 'vue-router'

// 应用登录登录接口
export function loginApi(
  username: string,
  password: string,
  loginType: string
) {
  return axios.post('/login', { username, password, loginType })
}

//第三方应用Gitee登录接口
export function loginByGitee() {
  return axios.get('/login/gitee/url')
}
//第三方应用Gitee获取token
export function getAccessToken(code: string | LocationQueryValue[]) {
  return axios.get(`/login/gitee/authorize/${code}`)
}

//登录成功之后获取用户信息的接口
export function getUserInfo() {
  return axios.get('/login/user')
}
//个人中心获取个人信息
export function getUserProfile() {
  return axios.get('/user/profile')
}
//修改个人信息
export function modifyUserProfile(formObj: any) {
  return axios.post('/user/modify', formObj)
}

//获取重置邮箱的验证码
export function getResetEmailCode(obj: any) {
  return axios.post('/user/email/resetCode', obj)
}
//重置邮箱
export function resetEmailAddress(obj: any) {
  return axios.post('/user/email/reset', obj)
}

//获取重置密码的邮箱验证码
export function getResetPasswordCode() {
  return axios.get('/user/pwd/resetCode')
}
//重置密码
export function resetUserPassword(obj: any) {
  return axios.post('/user/pwd/reset', obj)
}
//退出登录
export function logout() {
  return axios.get('/user/logout')
}
//用户注销
export function destory() {
  return axios.get('/user/destroy')
}
//获取用户文章数据
export function getUserArticleData() {
  return axios.get('/user/articleData')
}
//获取最近七天的数据
export function getUserArticleChart() {
  return axios.get('/user/chart')
}
//注册发送邮箱验证码
export function sendRegisterCode(formObj: any) {
  return axios.post('/user/email/register', formObj)
}
//注册
export function userRegister(formObj: any) {
  return axios.post('/user/register', formObj)
}
