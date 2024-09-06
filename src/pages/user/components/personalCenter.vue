<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import CLeft from '@/pages/user/components/CenterLeft.vue'
import CenterInfo from './CenterInfo.vue'
const Comp = ref(CenterInfo)
const emits = defineEmits(['changeDimensionHome'])

onMounted(() => {
  emits('changeDimensionHome')
})

onBeforeUnmount(() => {
  emits('changeDimensionHome')
})

const changeComp = (comp: any) => {
  Comp.value = comp
}
</script>

<template>
  <div class="grid grid-cols-10 mt-5 bg-white">
    <div class="col-span-2 mr-2"><CLeft @changeComp="changeComp"></CLeft></div>
    <div class="col-span-8">
      <component :is="Comp"></component>
    </div>
  </div>
</template>
