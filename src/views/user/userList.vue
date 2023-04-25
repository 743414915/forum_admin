<template>
  <div class="user-list">
    <div class="top-panel">
      <el-form :model="searchFormData" label-width="50px">
        <el-row>
          <el-col :span="4">
            <!--input输入-->
            <el-form-item label="昵称" prop="nickNameFuzzy">
              <el-input
                clearable
                placeholder="请输入昵称"
                v-model="searchFormData.nickNameFuzzy"
                @keyup.enter="loadDataList"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <!--input输入-->
            <el-form-item label="性别" prop="sex">
              <el-select
                v-model="searchFormData.sex"
                clearable
                placeholder="请选择性别"
                :style="{ width: '100%' }"
              >
                <el-option :value="0" label="女"></el-option>
                <el-option :value="1" label="男"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <!-- 下拉框 -->
            <el-form-item label="状态" prop="status">
              <el-select
                v-model="searchFormData.status"
                clearable
                placeholder="请选择状态"
                :style="{ width: '100%' }"
              >
                <el-option :value="0" label="禁用"></el-option>
                <el-option :value="1" label="正常"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5" :style="{ 'padding-left': '10px' }">
            <el-button-group>
              <el-button type="primary" @click="loadDataList">搜索</el-button>
            </el-button-group>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="data-list">
      <tables
        :columns="columns"
        :dataSource="tableData"
        :fetch="loadDataList"
        :options="tableOptions"
        :showPagination="true"
        :style="{ 'margin-top': '10px' }"
      >
        <!-- 序号 -->
        <template #serialNumber="{ row }">
          <span>{{ row.serialNumber }}</span>
        </template>
        <!-- 头像 -->
        <template #avatar="{ row }">
          <avatar :userId="row.userId"></avatar>
        </template>
        <!-- 昵称 -->
        <template #nickName="{ row }">
          <span>{{ row.nickName }}</span>
          <span v-if="row.sex">{{ row.sex == 0 ? "女" : "男" }}</span>
        </template>
        <!-- 登录信息 -->
        <template #loginInfo="{ row }">
          <div>最后登录时间：{{ row.lastLoginTime }}</div>
          <div>最后登录IP：{{ row.lastLoginIp }}</div>
          <div>最后登录地点：{{ row.lastLoginIpAddress }}</div>
        </template>
        <!-- 类型 -->
        <template #integral="{ row }">
          <div>总积分：{{ row.totalIntegral }}</div>
          <div>当前积分：{{ row.currentIntegral }}</div>
        </template>
        <!-- 状态 -->
        <template #status="{ row }">
          <span v-if="row.status == 1" :style="{ color: 'green' }">正常</span>
          <span v-else :style="{ color: 'red' }">禁用</span>
        </template>
        <!-- 操作信息 -->
        <template #op="{ row }">
          <div class="op" v-if="row.status != -1">
            <el-dropdown trigger="click">
              <span class="iconfont icon-more"></span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="updateUserStatus(row)">{{
                    row.status == 1 ? "禁用" : "启用"
                  }}</el-dropdown-item>
                  <el-dropdown-item @click="sendMessage(row)"
                    >发送系统消息</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </tables>
    </div>
    <!-- 发送消息 -->
    <sendMessages ref="sendMessageRef" @reload="loadDataList"></sendMessages>
  </div>
</template>
<script setup>
import description from "./description.js";
import sendMessages from "./sendMessage/sendMessage.vue";

import { ref, reactive, getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();

const api = {
  loadDataList: "/user/loadUserList",
  updateUserStatus: "/user/updateUserStatus",
};

const columns = description.columns;

const searchFormData = ref({});

const tableData = ref({});
const tableOptions = {
  extHeight: 60,
  selectType: "checkbox",
  showIndex: true,
  tableHeight: null,
  stripe: true,
  border: false,
};
const loadDataList = () => {
  let params = {
    pageNo: tableData.value.pageNo,
    pageSize: tableData.value.pageSize,
  };
  Object.assign(params, searchFormData.value);
  proxy
    .request({
      url: api.loadDataList,
      params,
    })
    .then((res) => {
      if (!res || res.code !== 200) {
        return;
      }
      res.data.list.forEach((item, index) => {
        item.serialNumber = index + 1 + (params.pageNo - 1 || 0) * 15;
      });
      tableData.value = res.data;
    });
};

// 禁用或启用用户
const updateUserStatus = (data) => {
  const title = data.status == 1 ? "禁用" : "启用";
  proxy.confirm(`你确定要${title}用户${data.nickName}吗？`, () => {
    proxy
      .request({
        url: api.updateUserStatus,
        params: {
          userId: data.userId,
          status: data.status == 1 ? 0 : 1,
        },
      })
      .then((res) => {
        if (!res || res.code !== 200) {
          return;
        }
        loadDataList();
        proxy.message.success(`${title}成功`);
      });
  });
};

// 发送系统消息
const sendMessageRef = ref();
const sendMessage = (row) => {
  sendMessageRef.value.sendMessage(row);
};
</script>
<style lang="less" scoped>
.op {
  cursor: pointer;
}
</style>