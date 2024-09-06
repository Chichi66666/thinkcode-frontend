import { useCookies } from '@vueuse/integrations/useCookies'
import { timePlusDays } from './date'
const cookie = useCookies()

// ============================== Token 令牌 ==============================
const TOKEN_KEY = 'Authorization'
export const getToken = (): string => {
  return cookie.get(TOKEN_KEY)
}

export const setToken = (token: string) => {
  return cookie.set(TOKEN_KEY, token, {
    expires: timePlusDays(new Date(), 1)
  })
}

export const removeToken = () => {
  cookie.set(TOKEN_KEY, {
    expires: -1
  })
  cookie.remove(TOKEN_KEY)
}
// ============================== 标签页 ==============================
// 存储在 Cookie 中的标签页数据的 key
const TAB_LIST_KEY = 'tabList'

// 获取 TabList
export function getTabList() {
  return cookie.get(TAB_LIST_KEY)
}

// 存储 TabList 到 Cookie 中
export function setTabList(tabList: any) {
  return cookie.set(TAB_LIST_KEY, tabList)
}
