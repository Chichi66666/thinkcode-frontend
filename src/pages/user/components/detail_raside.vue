<script setup>
import UserCard from '@/pages/user/components/user_card.vue'
import Catalog from '@/pages/user/components/catalog.vue'
import EventBus from '@/eventBus'
import { reactive } from 'vue'

const user = reactive({ id: -1, nickName: '', avatar: '' })
//如果接收到事件，则进行数据加载
EventBus.on('getDetailUserInfo', (data) => {
  user.id = data.id
  user.nickName = data.nickName
  user.avatar = data.avatar
})
</script>

<template>
  <div class="mr-1">
    <UserCard :avatar="user.avatar" :nickName="user.nickName"></UserCard>
    <Catalog></Catalog>
  </div>
</template>

<style></style>
