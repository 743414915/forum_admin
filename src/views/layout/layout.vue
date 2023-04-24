<template>
  <div class="layout-body">
    <el-container>
      <el-aside class="aside" :style="{ width: asideWidth + 'px' }">
        <div class="logo">
          <span>
            <span>forum</span>
            <span v-if="!menuCollapse">管理后台</span>
          </span>
        </div>
        <div class="menu-panel">
          <el-menu
            :collapse-transition="false"
            :default-openeds="defaultOpeneds"
            :collapse="menuCollapse"
            class="el-menu-vertical-demo"
            background-color="#3d3c4a"
            text-color="#fff"
            active-text-color="#fff"
            router
            :default-active="defaultActive"
          >
            <template
              v-for="(item, index) in description.menuList"
              :key="item + index"
            >
              <el-sub-menu
                :index="item.path"
                v-if="item.children && item.children.length"
              >
                <template #title>
                  <i :class="['iconfont', item.icon]"></i>
                  <span class="menu-name">{{ item.menuName }}</span>
                </template>
                <el-menu-item
                  v-for="(subItem, subIndex) in item.children"
                  :key="subItem + subIndex"
                  :index="subItem.path"
                >
                  <span class="menu-name">{{ subItem.menuName }}</span>
                </el-menu-item>
              </el-sub-menu>
              <el-sub-menu v-else :index="item.path">
                <template #title>
                  <i :class="['iconfont', item.icon]"></i>
                  <span class="menu-name">{{ item.menuName }}</span>
                </template>
              </el-sub-menu>
            </template>
          </el-menu>
        </div>
      </el-aside>
      <el-container>
        <el-header class="header">
          <div
            :class="[
              'iconfont',
              'op-menu',
              menuCollapse ? 'icon-expand' : 'icon-collapse',
            ]"
            @click="opMenu"
          ></div>
          <div class="menu-bread">
            <el-breadcrumb>
              <template
                v-for="(item, index) in menuBreadCrumbList"
                :key="item + index"
              >
                <el-breadcrumb-item v-if="item.name">
                  {{ item.name }}
                </el-breadcrumb-item>
              </template>
            </el-breadcrumb>
          </div>
        </el-header>
        <el-main class="main-content">
          <div class="tag-content">
            <el-tabs
              type="border-card"
              v-model="defaultActive"
              @tab-change="tabClick"
              @edit="editTab"
            >
              <el-tab-pane
                v-for="(item, index) in tabList"
                :key="item + index"
                :name="item.path"
                :label="item.menuName"
                :closable="tabList.length > 1"
              ></el-tab-pane>
            </el-tabs>
          </div>
          <div class="content-body">
            <router-view></router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup>
import description from "./description.js";
import { ref, reactive, getCurrentInstance, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();

// 默认展开菜单
const defaultOpeneds = ref([]);

// 是否收起关闭菜单
const menuCollapse = ref(false);
const asideWidth = ref(250);
// 展开收起菜单
const opMenu = () => {
  menuCollapse.value = !menuCollapse.value;
  if (menuCollapse.value) {
    asideWidth.value = 63;
  } else {
    asideWidth.value = 250;
  }
};

const menuMap = {};
// 默认选中菜单
const defaultActive = ref();
// 面包屑集合
const menuBreadCrumbList = ref([]);
const init = () => {
  description.menuList.forEach((item) => {
    defaultOpeneds.value.push(item.path);
    item.children.forEach((item) => [(menuMap[item.path] = item)]);
  });
};
init();
// 面包屑导航

// tab操作
const tabList = ref([]);
const tabClick = (name) => {
  router.push(name);
};
const editTab = (targetKey, action) => {
  if (action !== "remove") {
    return;
  }
  let currentPath = defaultActive.value;
  let tabs = tabList.value;
  // 关闭当前选中的tab
  if (targetKey == currentPath) {
    tabs.forEach((tab, index) => {
      if (tab.path == targetKey) {
        let nextTab = tabs[index + 1] || tabs[index - 1];
        if (nextTab) {
          currentPath = nextTab.path;
        }
      }
    });
  }
  tabList.value = tabs.filter((tab) => {
    return tab.path !== targetKey;
  });
  if (currentPath !== defaultActive.value) {
    router.push(currentPath);
  }
};

watch(
  () => route,
  (newVal, oldVal) => {
    defaultActive.value = route.path;
    menuBreadCrumbList.value = route.matched;
    let currentMenu = tabList.value.find((item) => {
      return item.path == defaultActive.value;
    });
    if (!currentMenu) {
      tabList.value.push(menuMap[route.path]);
    }
  },
  { immediate: true, deep: true }
);
</script>
<style lang="less" scoped>
.layout-body {
  .aside {
    background: #3d3c4a;
    .logo {
      display: flex;
      align-items: center;
      height: 50px;
      color: #fff;
      background: #191828;
      font-size: 18px;
      padding-left: 5px;
    }
    ::v-deep(.menu-panel) {
      // 50是logo的高度
      height: calc(100vh - 50px);
      .menu-name {
        padding-left: 10px;
      }
      // 去除边框
      .el-menu {
        border-right: none;
      }
      // 每个菜单的颜色
      .el-menu-item {
        background: #353544;
        // 选中的颜色
        &:hover {
          color: #d8d8ee;
        }
        &.is-active {
          color: #fff;
          background: rgb(251, 185, 223);
        }
      }
    }
  }
  .header {
    display: flex;
    align-items: center;
    background: #fff;
    border-bottom: 1px solid #ddd;
    height: 50px;
    line-height: 50px;
    padding: 0 10px !important;
    .op-menu {
      font-size: 20px;
      cursor: pointer;
      color: #3a3a40;
    }
    .menu-bread {
      margin-left: 10px;
    }
  }
  .main-content {
    padding: 0;
    ::v-deep(.tag-content) {
      .el-tabs--border-card {
        border: none;
      }
      .el-tabs__content {
        display: none;
      }
    }
    .content-body {
      overflow: hidden;
      padding: 10px 10px 5px 10px;
    }
  }
}
</style>
<style lang="less">
.el-popper.is-pure {
  border: none !important;
  .el-menu--popup {
    padding: 0;
    .el-menu-item {
      &:hover {
        color: #d8d8ee;
      }
      &.is-active {
        background: #fbb9df;
      }
    }
  }
}
</style>