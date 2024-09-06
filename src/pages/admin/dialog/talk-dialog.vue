<script setup>
import { ref, reactive, defineEmits, defineProps } from 'vue'

const props = defineProps({
  id: Number,
  title: String,
  name: String,
  isAdd: Boolean,
  confirm: String
})

const opened = () => {
  form.name = props.name
}

const dialogVisible = ref(false)
defineExpose({ dialogVisible })

const formRef = ref(null)
const form = reactive({ name: props.name })
// 规则校验
const rules = {
  name: [
    {
      required: true,
      message: '问答话题名称不能为空',
      trigger: 'blur'
    },
    {
      min: 1,
      max: 10,
      message: '问答话题名称字数要求大于 1 个字符，小于 10 个字符',
      trigger: 'blur'
    }
  ]
}

const emits = defineEmits(['refreshData'])
//表单提交
const onSubmit = () => {
  if (!formRef.value) return
  // 先验证 form 表单字段
  formRef.value.validate((valid) => {
    if (!valid) {
      return false
    }
    emits('refreshData', { isAdd: props.isAdd, name: form.name })
  })
}

const closeDialog = () => {
  dialogVisible.value = false
  form.name = ''
}
</script>

<template>
  <!-- 标签对话框组件 -->
  <el-dialog
    @opened="opened"
    v-model="dialogVisible"
    :title="title"
    width="40%"
    :draggable="true"
    align-center
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form ref="formRef" :rules="rules" :model="form">
      <el-form-item label="话题名称" prop="name" label-width="80px">
        <!-- 输入框组件 -->
        <el-input
          size="large"
          v-model="form.name"
          placeholder="请输入话题名称"
          maxlength="20"
          show-word-limit
          clearable
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button color="#1a56db" plain @click="closeDialog">取消</el-button>
        <el-button type="primary" color="#1a56db" @click="onSubmit">
          {{ confirm }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
