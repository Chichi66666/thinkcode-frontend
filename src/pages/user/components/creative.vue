<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref, type Component } from 'vue'
import Left from '@/pages/user/components/creative_left.vue'
import ArticleManage from './articleManage.vue'

const emits = defineEmits(['changeDimensionCreative'])
const Comp = ref(ArticleManage)

onMounted(() => {
  emits('changeDimensionCreative')
})

onBeforeUnmount(() => {
  emits('changeDimensionCreative')
})

//改变组件
const changeComp = (comp: Component) => {
  Comp.value = comp
}
</script>

<template>
  <div class="grid grid-cols-10 mt-5 bg-white">
    <div class="col-span-2 mr-2"><Left @changeComp="changeComp"></Left></div>
    <div class="col-span-8">
      <component :is="Comp"></component>
    </div>
  </div>
</template>
