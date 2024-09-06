<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { onMounted, reactive, ref, watch } from 'vue'
import _ from 'lodash'
import { publishComment } from '@/api/user/comment'
import { successMsg, failMsg } from '@/composables/utils'
import EventBus from '@/eventBus'
// emojis 表情符号
import { emojis } from '@/composables/emojis'

//选择表情进入评论内容之后
const commentInputEl = ref()
const selectEmoji = (e: any) => {
  From.replyText += e.target.innerText
  commentInputEl.value.focus()
}

const props = defineProps({
  isChild: {
    type: Boolean,
    default: false
  },
  articleId: Number,
  arvatarUrl: String,
  replyName: String,
  replyOuterCommentId: Number,
  replyInnerCommentId: Number
})
//如果是二级评论，修改样式
const reply = ref()
onMounted(() => {
  if (props.isChild === true) {
    reply.value.classList.remove('col-span-9')
    reply.value.classList.add('col-span-10')
  }
})
const From = reactive({ replyText: '' })
const text_count = ref(0)
const formRef = ref<FormInstance>()
const span_count = ref()
//侦听用户输入的字数
watch(
  () => From.replyText,
  (n, o) => {
    //校验输入的字符，校验除了中文或英文标点字符以外的文本信息
    const RegExp = /[\w\u4e00-\u9fa5]+/g
    text_count.value = n.length - n.replace(RegExp, '').length
    if (text_count.value > 120) {
      span_count.value.classList.add('text-red-500')
    } else {
      span_count.value.classList.remove('text-red-500')
    }
  },
  { deep: true }
)
//自定义表单验证规则，来提示用户输入字数超出限制
const checkWordsLength = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error('请输入评论内容！'))
  } else if (text_count.value > 120) {
    return callback(new Error('字数超过限制！'))
  } else callback()
}
//自定义表单验证规则，限制用户输入字数
const rules = reactive<FormRules>({
  replyText: [{ validator: checkWordsLength, trigger: 'change' }]
})
//传递事件，关闭输入框
const emits = defineEmits(['closeReplyDialog'])
//提交表单信息
const submitForm = _.debounce(
  () => {
    if (!formRef.value) return
    formRef.value.validate((valid) => {
      if (valid) {
        const reqCommentObj = {
          comment: From.replyText,
          articleId: props.articleId,
          replyOuterCommentId: props.replyOuterCommentId,
          replyInnerCommentId: props.replyInnerCommentId
        }

        publishComment(reqCommentObj).then((res: any) => {
          if (res.success) {
            successMsg('发布评论成功！')
            EventBus.emit('published')
            emits('closeReplyDialog')
            //清空输入内容
            formRef.value.resetFields()
          } else {
            failMsg(res.message)
          }
        })
      } else {
        return false
      }
    })
  },
  800,
  { leading: 'true', trailing: false }
)
</script>

<template>
  <div class="grid grid-cols-10">
    <!-- 一级回复组件不隐藏,左侧的头像区域 -->
    <div v-if="!isChild" class="col-span-1 mt-2 mr-2">
      <el-avatar :size="45" :src="arvatarUrl" @error="true">
        <img
          src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
        />
      </el-avatar>
    </div>
    <!-- 评论回复表单区域 -->
    <div ref="reply" class="bg-[#F2F3F5] rounded-sm m-2 col-span-9">
      <el-form ref="formRef" :model="From" :rules="rules">
        <el-form-item prop="replyText">
          <el-input
            ref="commentInputEl"
            :autosize="{ minRows: 4, maxRows: 6 }"
            v-model="From.replyText"
            :placeholder="replyName ? '@' + replyName : '请发布友好评论...'"
            type="textarea"
            resize="none"
          />
        </el-form-item>
      </el-form>

      <!-- 评论回复底部栏 -->
      <div class="p-2 flex justify-between items-center gap-2 select-none">
        <div>
          <el-popover
            placement="bottom-start"
            title=""
            :width="200"
            hide-after="50"
            trigger="hover"
          >
            <template #default>
              <!-- 自定义插槽，选择表情 -->
              <div
                ref="emojisContainer"
                class="container grid place-items-center grid-cols-5"
              >
                <span
                  @click="selectEmoji"
                  class="mb-1 cursor-pointer select-none hover:scale-125 transition-all"
                  v-for="(emoji, index) in emojis"
                  :key="index"
                  >{{ emoji }}</span
                >
              </div>
            </template>
            <template #reference>
              <svg
                t="1711098125258"
                class="cursor-pointer text-[#5D5D5D] hover:text-stone-400"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="8912"
                width="25"
                height="25"
              >
                <path
                  d="M942.577061 507.011382c0-237.637282-192.632275-430.269557-430.269557-430.269557s-430.269557 192.632275-430.269557 430.269557c0 237.647515 192.632275 430.27979 430.269557 430.27979 97.553827 0 186.878225-33.189913 259.055081-87.88563 2.964518-3.363607 4.91187-7.655354 4.91187-12.479219 0-10.531867-8.541537-19.073404-19.072381-19.073404-5.465478 0-10.334369 2.168386-13.808494 5.842055l-0.242524 0c-64.584947 47.526433-144.086629 75.981509-230.422973 75.981509-215.179804 0-389.645324-174.489056-389.645324-389.656581 0-215.201294 174.466544-389.644301 389.645324-389.644301 215.202317 0 389.645324 174.443008 389.645324 389.644301 0 65.738213-15.423271 127.60219-44.186362 181.922353l0 0.321318c-0.533143 1.814322-1.108241 3.583618-1.108241 5.53097 0 10.531867 8.541537 19.073404 19.073404 19.073404 8.207939 0 15.06716-5.265934 17.745153-12.523221l0 0.13303C924.544359 645.279493 942.577061 578.258053 942.577061 507.011382zM399.574976 391.378805c0-24.028253-19.47147-43.499723-43.500746-43.499723-24.029276 0-43.478234 19.47147-43.478234 43.499723 0 24.029276 19.448958 43.479257 43.478234 43.479257C380.102483 434.858062 399.574976 415.408081 399.574976 391.378805zM669.735999 347.945597c-24.004717 0-43.476187 19.448958-43.476187 43.478234 0 24.029276 19.47147 43.500746 43.476187 43.500746 24.029276 0 43.50177-19.47147 43.50177-43.500746C713.237769 367.394554 693.766298 347.945597 669.735999 347.945597zM702.196295 630.742405c0-11.793604-9.558703-21.330818-21.350261-21.330818-1.88186 0-3.562129 0.620124-5.335519 1.084705l-0.441045 0c-49.473785 22.723537-104.548124 38.610366-162.562423 38.610366-57.130162 0-111.007233-16.130376-159.907966-38.233789l-0.177032 0c-2.300392-0.818645-4.690836-1.461281-7.2798-1.461281-11.880585 0-21.505803 9.602705-21.505803 21.485337 0 8.120958 4.513804 15.222703 11.129478 18.872836 54.209646 24.6494 113.883747 42.980907 177.319521 42.980907 63.037708 0 124.240629-18.686594 178.185238-43.046399 0.308015-0.149403 0.217964-0.11154 0.070608-0.045025C696.59574 645.928269 702.196295 638.545114 702.196295 630.742405z"
                  fill="currentColor"
                  p-id="8913"
                ></path>
              </svg>
            </template>
          </el-popover>
        </div>
        <div class="flex gap-2 justify-center items-center">
          <span ref="span_count" class="text-xs">{{ text_count }}/120</span>
          <el-tooltip
            content="Emoji、中文、英文标点及字符不计入字数"
            placement="bottom-end"
            effect="light"
          >
            <svg
              class="w-[16px] h-[16px] text-[#4978B3] cursor-pointer"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1024 1024"
            >
              <path
                fill="currentColor"
                d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896m23.744 191.488c-52.096 0-92.928 14.784-123.2 44.352-30.976 29.568-45.76 70.4-45.76 122.496h80.256c0-29.568 5.632-52.8 17.6-68.992 13.376-19.712 35.2-28.864 66.176-28.864 23.936 0 42.944 6.336 56.32 19.712 12.672 13.376 19.712 31.68 19.712 54.912 0 17.6-6.336 34.496-19.008 49.984l-8.448 9.856c-45.76 40.832-73.216 70.4-82.368 89.408-9.856 19.008-14.08 42.24-14.08 68.992v9.856h80.96v-9.856c0-16.896 3.52-31.68 10.56-45.76 6.336-12.672 15.488-24.64 28.16-35.2 33.792-29.568 54.208-48.576 60.544-55.616 16.896-22.528 26.048-51.392 26.048-86.592 0-42.944-14.08-76.736-42.24-101.376-28.16-25.344-65.472-37.312-111.232-37.312zm-12.672 406.208a54.272 54.272 0 0 0-38.72 14.784 49.408 49.408 0 0 0-15.488 38.016c0 15.488 4.928 28.16 15.488 38.016A54.848 54.848 0 0 0 523.072 768c15.488 0 28.16-4.928 38.72-14.784a51.52 51.52 0 0 0 16.192-38.72 51.968 51.968 0 0 0-15.488-38.016 55.936 55.936 0 0 0-39.424-14.784z"
              ></path>
            </svg>
          </el-tooltip>
          <el-button @click="submitForm" type="info">回复</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.el-textarea__wrapper) {
  align-items: start !important;
  box-shadow: 0 0 0 1px #dcdfe6 inset;
  padding: 5px;
}

:deep(.el-textarea__inner:focus) {
  box-shadow: 0 0 0 1px #1a56db inset;
}
</style>
