import { ref } from 'vue'
import { defineStore } from 'pinia'

//存储用户基本信息的仓库
export const useUserStore = defineStore('user', () => {
  const user = ref()
  function getUserInfo() {
    return user
  }
  function setUserInfo(u: any) {
    user.value = u
  }
  function setNickName(nickName: any) {
    user.value.nickName = nickName
  }
  function setAvatar(avatar: any) {
    user.value.avatar = avatar
  }
  function getPermissions() {
    return user.value.category
  }
  return {
    user,
    getUserInfo,
    setUserInfo,
    setNickName,
    setAvatar,
    getPermissions
  }
})
