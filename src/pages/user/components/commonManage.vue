<script setup lang="ts">
import { ref } from 'vue'

const activeName = ref('1')
</script>

<template>
  <div class="w-full border-b h-[55px] p-3 flex justify-between items-center">
    <div class="flex items-center gap-5">
      <div class="cursor-pointer">
        常见问题(<span class="text-blue-600">5</span>)
      </div>
    </div>
  </div>
  <div
    class="articleContainer box-border min-h-[570px] max-h-[570px] overflow-auto p-2"
  >
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item title="为什么存在评论审核？" name="1">
        <div>
          1.根据国家相关法律法规规定，保障平台内容安全：过滤涉黄、涉暴、涉毒、赌博等安全底线问题。
          <br />2.保障用户体验，有助于提升平台长期价值：打击低俗、辱骂、广告等低质内容。
        </div>
      </el-collapse-item>
      <el-collapse-item title="创作中心是什么？" name="2">
        <div>1.提供给用户进行文章编辑和分享的线上平台</div>
        <div>2.打造知识透明性的平台，共享编程知识</div>
      </el-collapse-item>
      <el-collapse-item title="问答社区是什么？" name="3">
        <div>1.提供用户进行问题提问的平台</div>
        <div>
          2.用户可以在浏览技术文章的时候出现的问题发布出来，其他用户提供帮助
        </div>
      </el-collapse-item>
      <el-collapse-item title="什么是码悟编程平台？" name="4">
        <div>
          码悟编程技术分享平台是随着用户规模的增长和技术的发展出现的技术创新应用，针对用户的学习方式提供更加深入的指导建议，并且做到全球化、国际化、技术领先型的线上知识平台，为平台的发展提供了更多的机遇和挑战。
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
