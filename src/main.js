// @ts-nocheck
import { createApp } from 'vue'
import './assets/base.less'
import App from './App.vue'
//引入cookies
import VueCookies from 'vue-cookies'
//引入element plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//图标
import '@/assets/icon/iconfont.css'
import request from './axios/request.js'
import router from './router'

// 全局组件
const app = createApp(App);
import Dialog from "@/components/Dialog/Dialog.vue"
import Avatar from '@/components/avatar/avatar.vue'
import cover from '@/components/cover/cover.vue'
import message from '@/common/message.js'

app.config.globalProperties.VueCookies = VueCookies;
app.config.globalProperties.message = message
app.config.globalProperties.request = request
app.config.globalProperties.globalInfo = {
  bodyWidth: 60,
  avatarUrl: '/api/file/getAvatar/',
  imageUrl: '/api/file/getImage/'
};
app.use(router)
  .use(ElementPlus)
  .component("Dialog", Dialog)
  .component("Avatar", Avatar)
  .component("cover", cover)
app.mount('#app');
