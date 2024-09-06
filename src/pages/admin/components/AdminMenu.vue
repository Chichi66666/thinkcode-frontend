<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMenuStore } from '@/stores/menu'

const menuStore = useMenuStore()
// 是否折叠
const isCollapse = computed(() => !(menuStore.menuWidth == '250px'))

const menus = [
  {
    name: '系统数据',
    icon: 'Monitor',
    path: '/admin/panel'
  },
  {
    name: '用户管理',
    icon: 'User',
    path: '/admin/user'
  },
  {
    name: '问答管理',
    icon: 'Finished',
    path: '/admin/ask/list'
  },

  {
    name: '文章管理',
    icon: 'Document',
    path: '/admin/article/list'
  },

  {
    name: '内容管理',
    icon: 'Setting',
    path: '/admin/content/',
    children: [
      {
        name: '分类管理',
        icon: 'FolderOpened',
        path: 'category/list'
      },
      {
        name: '标签管理',
        icon: 'PriceTag',
        path: 'tag/list'
      },
      {
        name: '话题管理',
        icon: 'ChatDotRound',
        path: 'talk/list'
      }
    ]
  },
  {
    name: '评论管理',
    icon: 'ChatLineSquare',
    path: '/admin/comment/',
    children: [
      {
        name: '文章评论',
        icon: 'EditPen',
        path: 'acomment/list'
      },

      {
        name: '问答评论',
        icon: 'Stopwatch',
        path: 'qcomment/list'
      }
    ]
  },
  {
    name: '通知管理',
    icon: 'Notification',
    path: '/admin/info'
  }
]
const router = useRouter()
const route = useRoute()
// 根据路由地址判断哪个菜单被选中
const defaultActive = ref(route.path)
// 菜单选择事件
const handleSelect = (path: any) => {
  router.push(path)
}
</script>

<template>
  <div
    class="bg-slate-800 h-screen text-white transition-all"
    :style="{ width: menuStore.menuWidth }"
  >
    <!-- 顶部 Logo, 指定高度为 64px, 和右边的 Header 头保持一样高 -->
    <div class="flex items-center justify-center gap-1 h-[64px]">
      <img width="30" src="@/assets/logo.svg" />
      <p
        v-if="isCollapse ? false : true"
        class="text-lg"
        style="font-family: 幼圆"
      >
        码悟后台管理系统
      </p>
    </div>
    <!-- 下方菜单 -->
    <el-menu
      :default-active="defaultActive"
      @select="handleSelect"
      :collapse="isCollapse"
      :collapse-transition="false"
      menu-trigger="click"
    >
      <template v-for="(item, index) in menus" :key="index">
        <!-- 二级菜单样式 -->
        <template v-if="item.children !== undefined">
          <el-sub-menu :index="item.path">
            <template #title>
              <el-icon>
                <!-- 动态图标 -->
                <component :is="item.icon"></component>
              </el-icon>
              <span>{{ item.name }}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item
                v-for="(child, index) in item.children"
                :key="index"
                :index="item.path + child.path"
              >
                <el-icon>
                  <!-- 动态图标 -->
                  <component :is="child.icon"></component>
                </el-icon>
                <span> {{ child.name }}</span></el-menu-item
              >
            </el-menu-item-group>
          </el-sub-menu>
        </template>
        <!-- 一级菜单样式 -->
        <template v-else>
          <el-menu-item :index="item.path">
            <el-icon>
              <!-- 动态图标 -->
              <component :is="item.icon"></component>
            </el-icon>
            <span>{{ item.name }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<style scoped>
:deep(.el-menu) {
  background-color: rgb(30 41 59 / 1);

  border-right: 0;
}

:deep(.el-sub-menu__title) {
  color: #fff;
}

:deep(.el-sub-menu__title:hover) {
  background-color: #ffffff10;
}

.el-menu-item.is-active {
  background-color: #1a56db95;
  color: #fff;
}

.el-menu-item.is-active:hover {
  background-color: #1a56db95;
}

.el-menu-item,
.el-sub-menu {
  color: hsl(0, 0%, 100%);
  background-color: rgb(30 41 59 / 1);
}

:deep(.el-menu-item:hover) {
  background-color: #2c3647;
}
:deep(.el-menu-item-group__title) {
  padding: 0;
}
:deep(.el-menu--popup) {
  padding: 0;
}
</style>
