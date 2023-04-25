// @ts-nocheck
import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue';
import layout from '@/views/layout/layout.vue';
import ArticleList from '@/views/forum/articleList/articleList.vue'
import BoardList from '@/views/forum/boardList/boardList.vue'
import CommentList from '@/views/forum/commentList/commentList.vue'
import SysSetting from '@/views/settings/sysSettings.vue'
import UserList from '@/views/user/userList.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      name: '',
      component: layout,
      redirect: "/forum/article",
      children: [
        {
          path: "/forum",
          name: "内容管理",
          children: [{
            path: "article",
            name: "帖子列表",
            component: ArticleList
          },
          {
            path: "comment",
            name: "评论列表",
            component: CommentList
          },
          {
            path: "board",
            name: "板块列表",
            component: BoardList
          }]
        },
        {
          path: "/user",
          name: "用户管理",
          children: [{
            path: "list",
            name: "用户列表",
            component: UserList
          }]
        },
        {
          path: "/settings",
          name: "设置",
          children: [{
            path: "sys",
            name: "系统设置",
            component: SysSetting
          }]
        }]
    },
  ]
})

export default router
