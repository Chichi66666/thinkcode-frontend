import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/pages/common/login.vue'
import AdminLogin from '@/pages/common/adminLogin.vue'
import Index from '@/pages/user/index.vue'
import Detail from '@/pages/user/components/detail.vue'
import Article from '@/pages/user/components/article.vue'
import Compose from '@/pages/user/components/compose.vue'
import Ask from '@/pages/user/components/Q&A.vue'
import Creative from '@/pages/user/components/creative.vue'
import Home from '@/pages/user/components/personalCenter.vue'
import Study from '@/pages/user/components/study.vue'
import { getToken } from '@/composables/cookies'
import AdminIndex from '@/pages/admin/index.vue'
import UserManage from '@/pages/admin/components/userManage.vue'
import SystemManage from '@/pages/admin/components/systemPanel.vue'
import ArticleManage from '@/pages/admin/components/articleManage.vue'
import AskManage from '@/pages/admin/components/askManage.vue'
import CategoryManage from '@/pages/admin/components/categoryManage.vue'
import TagManage from '@/pages/admin/components/tagManage.vue'
import TalkManage from '@/pages/admin/components/talkManage.vue'
import CommentManage from '@/pages/admin/components/commentManage.vue'
import QCommentManage from '@/pages/admin/components/qCommentManage.vue'
import InfoManage from '@/pages/admin/components/infoManage.vue'
import { useUserStore } from '@/stores/user'
import NotFound from '@/pages/common/404.vue'
import {
  infoMsg,
  warnMsg,
  showLoadingLine,
  hideLoadingLine,
  failMsg
} from '@/composables/utils'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/admin',
      redirect: '/admin/panel'
    },
    {
      path: '/index',
      component: Index,
      meta: {
        title: '用户主页面'
      },
      children: [
        {
          path: '',
          components: {
            Lcomp: () => import('@/pages/user/components/aside.vue'),
            default: Article,
            Rcomp: () => import('@/pages/user/components/raside.vue')
          }
        },
        {
          path: 'detail/:articleId',
          components: {
            Lcomp: () => import('@/pages/user/components/detail_aside.vue'),
            default: Detail,
            Rcomp: () => import('@/pages/user/components/detail_raside.vue')
          },
          meta: { title: '文章详情页面' },
          props: true
        },
        {
          path: 'draft',
          component: Compose,
          props: true,
          meta: { title: '文章编辑页面' }
        },
        {
          path: 'rewrite/:articleId',
          component: Compose,
          props: true,
          meta: { title: '文章更新页面' }
        },
        {
          path: 'ask',
          components: {
            Lcomp: () => import('@/pages/user/components/Q&A_left.vue'),
            default: Ask,
            Rcomp: () => import('@/pages/user/components/Q&A_right.vue')
          },
          meta: { title: '问答社区页面' }
        },
        {
          path: 'creative',
          components: {
            default: Creative
          },
          meta: { title: '创作中心' }
        },
        {
          path: 'home',
          components: {
            default: Home
          },
          meta: { title: '个人中心' }
        },
        {
          path: 'study',
          components: {
            default: Study
          },
          meta: { title: '学习中心' }
        }
      ]
    },
    {
      path: '/login',
      component: Login,
      meta: {
        title: '用户登录页面'
      }
    },
    {
      path: '/admin',
      component: AdminIndex,

      children: [
        {
          path: 'user',
          component: UserManage,
          meta: {
            title: '用户管理',
            roles: ['admin'],
            requireAuth: true
          }
        },
        {
          path: 'panel',
          component: SystemManage,
          meta: {
            title: '系统数据',
            roles: ['admin'],
            requireAuth: true
          }
        },
        {
          path: 'article/list',
          component: ArticleManage,
          meta: {
            title: '文章管理',
            roles: ['admin'],
            requireAuth: true
          }
        },
        {
          path: 'ask/list',
          component: AskManage,
          meta: {
            title: '问答管理',
            roles: ['admin'],
            requireAuth: true
          }
        },
        {
          path: 'content/category/list',
          component: CategoryManage,
          meta: {
            title: '分类管理',
            roles: ['admin'],
            requireAuth: true
          }
        },
        {
          path: 'content/tag/list',
          component: TagManage,
          meta: {
            title: '标签管理',
            roles: ['admin'],
            requireAuth: true
          }
        },
        {
          path: 'content/talk/list',
          component: TalkManage,
          meta: {
            title: '话题管理',
            roles: ['admin'],
            requireAuth: true
          }
        },
        {
          path: 'comment/acomment/list',
          component: CommentManage,
          meta: {
            title: '文章评论管理',
            roles: ['admin'],
            requireAuth: true
          }
        },
        {
          path: 'comment/qcomment/list',
          component: QCommentManage,
          meta: {
            title: '问答评论管理',
            roles: ['admin'],
            requireAuth: true
          }
        },
        {
          path: 'info',
          component: InfoManage,
          meta: {
            title: '消息管理',
            roles: ['admin'],
            requireAuth: true
          }
        }
      ]
    },
    {
      path: '/aLogin',
      component: AdminLogin,
      meta: {
        title: '管理员登录页面'
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound,
      meta: {
        title: '404 页'
      }
    }
  ]
})

//全局前置守卫
router.beforeEach((to, from, next) => {
  const regExp = new RegExp('^/admin')
  showLoadingLine()
  const token = getToken()
  console.log(token)

  //没有登录,再判断是否请求用户页面或者管理员页面
  if (!token) {
    //请求登录页面,直接放行
    if (to.path == '/login' || to.path == '/aLogin') {
      next()
      return
    }
    //管理员页面请求
    if (regExp.test(to.path)) {
      next('/aLogin')
    } else {
      next('/login')
    }
  } else {
    //登录了,但是要判断身份,禁止访问其他角色的页面
    //获取用户身份
    const userStore = useUserStore()
    const permission = userStore.getPermissions()
    //如果用户登录之后访问管理员页面了
    if (to.meta.requireAuth) {
      if (permission == 'admin' && to.meta.roles[0] === permission) {
        next()
      } else {
        failMsg('无权限访问!')
        next('/index')
      }
    }
    //登录之后重新访问登录页面,则跳回登录之后的页面
    if (to.path == '/login' || to.path == '/aLogin') {
      if (permission === 'user') {
        warnMsg('已经登录!')
        next('/index')
      } else {
        warnMsg('已经登录!')
        next('/admin')
      }
    }
    next()
  }
})
// 全局路由后置守卫
router.afterEach((to, from) => {
  hideLoadingLine()
  //动态设置页面 Title
  // const title = to.meta.title ? to.meta.title : ''
  // document.title = title
})

export default router
