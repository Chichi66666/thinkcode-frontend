import { ElMessage } from 'element-plus'
import nprogress from 'nprogress'

//封装消息框start
export const infoMsg = (message: string) => {
  ElMessage({
    message,
    type: 'info',
    grouping: true
  })
}

export const successMsg = (message: string) => {
  ElMessage({
    message,
    type: 'success',
    grouping: true
  })
}

export const warnMsg = (message: string) => {
  ElMessage({
    message,
    type: 'warning',
    grouping: true
  })
}

export const failMsg = (message: string) => {
  ElMessage({
    message,
    type: 'error',
    grouping: true
  })
}
//封装消息框end

//封装加载横条start
export const showLoadingLine = () => {
  nprogress.start()
}

export const hideLoadingLine = () => {
  nprogress.done()
}
//封装加载横条end
