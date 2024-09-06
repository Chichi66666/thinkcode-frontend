import axios from 'axios'
import { getToken, removeToken } from './composables/cookies'
import router from '@/router/index'
import { failMsg, showLoadingLine, hideLoadingLine } from './composables/utils'

const instance = axios.create({
  baseURL: '/api',
  timeout: 20000
})

//排除的请求URL，不显示加载条
const excludeUrl = ['/article/support', '/article/store']

//自定义请求过滤器
instance.interceptors.request.use(
  (config) => {
    const reqUrl = config.url
    if (reqUrl) {
      if (excludeUrl.includes(reqUrl)) {
        showLoadingLine()
      }
    }
    const token = getToken()
    if (token) {
      config.headers.Authorization = 'Bearer ' + token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

//自定义响应过滤器
instance.interceptors.response.use(
  (response) => {
    hideLoadingLine()
    return response.data
  },
  (error) => {
    const status = error.response.status
    if (status === 500) {
      failMsg('服务器异常！')
      removeToken()
      if (router.currentRoute.value.meta.requireAuth) {
        router.replace('/aLogin')
      } else {
        router.replace('/login')
      }
    } else {
      //未授权，跳转到登录页面，引导用户重新登陆
      if (status === 401) {
        removeToken()
        router.replace('/login')
      }
      const errorMsg: string = error.response.data.message ?? error.message
      failMsg(errorMsg)
    }
    return Promise.reject(error)
  }
)

export default instance
