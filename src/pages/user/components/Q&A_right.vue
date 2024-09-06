<script lang="ts" setup>
import UserCard from '@/pages/user/components/user_card.vue'
import { useUserStore } from '@/stores/user'
import Card from '@/pages/user/components/creative_card.vue'

const userStore = useUserStore()
</script>

<template>
  <!-- 用户卡片内容 -->
  <UserCard
    :nickName="userStore.user.nickName"
    :avatar="userStore.user.avatar"
  ></UserCard>
  <!-- 问答社区右边栏内容 -->
  <Card></Card>
</template>

<style scoped></style>
