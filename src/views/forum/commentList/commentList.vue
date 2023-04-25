<template>
  <div class="comment-list">
    <div class="top-panel">
      <el-form :model="searchFormData" label-width="50px">
        <el-row>
          <el-col :span="4">
            <!--input输入-->
            <el-form-item label="内容" prop="contentFuzzy">
              <el-input
                clearable
                placeholder="支持模糊搜索"
                v-model="searchFormData.contentFuzzy"
                @keyup.enter="loadDataList"
              ></el-input>
            </el-form-item>
          </el-col>
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
            <!-- 下拉框 -->
            <el-form-item label="状态" prop="status">
              <el-select
                v-model="searchFormData.status"
                clearable
                placeholder="请选择状态"
                :style="{ width: '100%' }"
              >
                <el-option :value="-1" label="已删除"></el-option>
                <el-option :value="0" label="待审核"></el-option>
                <el-option :value="1" label="已审核"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5" :style="{ 'padding-left': '10px' }">
            <el-button-group>
              <el-button type="primary" @click="loadDataList">搜索</el-button>
              <el-button type="success" @click="auditBatch">批量审批</el-button>
              <el-button type="danger" @click="delBatch">批量删除</el-button>
            </el-button-group>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="data-list">
      <tables
        ref="tableRef"
        :columns="columns"
        :dataSource="tableData"
        :fetch="loadDataList"
        :options="tableOptions"
        @rowSelected="setRowSelected"
        :showPagination="true"
        :style="{ 'margin-top': '10px' }"
      >
        <!-- 序号 -->
        <template #serialNumber="{ row }">
          <span>{{ row.serialNumber }}</span>
        </template>
        <!-- 用户信息 -->
        <template #userInfo="{ row }">
          <div class="user-info">
            <avatar :userId="row.userId" :width="50"></avatar>
            <div class="name-info">
              <div>
                <a
                  :href="`${proxy.globalInfo.webDomain}/user/${row.userId}`"
                  class="a-link"
                  target="_blank"
                  >{{ row.nickName }}</a
                >
              </div>
            </div>
          </div>
        </template>
        <!-- 评论内容 -->
        <template #contentInfo="{ row }">
          <span>
            <a
              :href="`${proxy.globalInfo.webDomain}/post/${row.articleId}`"
              class="a-link"
              target="_blank"
              >查看文章</a
            >
          </span>
          <div v-html="row.content"></div>
          <div v-if="row.imgPath">
            <commentImage
              :src="proxy.globalInfo.imageUrl + row.imgPath.replace('.', '_.')"
              :imgList="[proxy.globalInfo.imageUrl + row.imgPath]"
            ></commentImage>
          </div>
        </template>
        <template #goodCount="{ row }">
          {{ row.goodCount }}
        </template>
        <!-- 状态 -->
        <template #statusInfo="{ row }">
          <span v-if="row.status == -1" :style="{ color: 'red' }">已删除</span>
          <span v-if="row.status == 0" :style="{ color: 'red' }">待审核</span>
          <span v-if="row.status == 1" :style="{ color: 'green' }">已审核</span>
        </template>
        <!-- 操作信息 -->
        <template #op="{ row }">
          <div class="op" v-if="row.status == 0 || row.status == 1">
            <el-dropdown trigger="click">
              <span class="iconfont icon-more"></span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="delComment(row)"
                    >删除</el-dropdown-item
                  >
                  <el-dropdown-item @click="audit(row)" v-if="row.status == 0"
                    >审核</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </tables>
    </div>
  </div>
</template>
<script setup>
import description from "./description.js";
import commentImage from "@/components/commentImage/commentImage.vue";

import { ref, reactive, getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();

const api = {
  loadDataList: "/forum/loadComment",
  delComment: "/forum/delComment",
  auditComment: "/forum/auditComment",
};

const searchFormData = ref({});

const columns = description.columns;
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

// 删除
const delComment = (data) => {
  proxy.confirm("你确定要删除该评论吗？", () => {
    proxy
      .request({
        url: api.delComment,
        params: {
          commentIds: data.commentId,
        },
      })
      .then((res) => {
        if (!res || res.code !== 200) {
          return;
        }
        loadDataList();
        proxy.message.success("删除成功");
      });
  });
};

// 审核
const audit = (data) => {
  proxy.confirm("你确定要审核该评论吗？", () => {
    proxy
      .request({
        url: api.auditComment,
        params: {
          commentIds: data.commentId,
        },
      })
      .then((res) => {
        if (!res || res.code !== 200) {
          return;
        }
        loadDataList();
        proxy.message.success("审核成功");
      });
  });
};

// 批量选择
const selectBatchList = ref([]);
const setRowSelected = (rows) => {
  selectBatchList.value = [];
  rows.forEach((item) => {
    selectBatchList.value.push(item.commentId);
  });
};

// 批量审批
const tableRef = ref();
const auditBatch = () => {
  proxy.confirm("你确定要批量审核吗？", () => {
    proxy
      .request({
        url: api.auditComment,
        params: {
          commentIds: selectBatchList.value.join(","),
        },
      })
      .then((res) => {
        if (!res || res.code !== 200) {
          return;
        }
        tableRef.value.clearSelection();
        loadDataList();
        proxy.message.success("审核成功");
      });
  });
};
// 批量删除
const delBatch = () => {
  proxy.confirm("你确定要批量删除吗？", () => {
    proxy
      .request({
        url: api.delComment,
        params: {
          commentIds: selectBatchList.value.join(","),
        },
      })
      .then((res) => {
        if (!res || res.code !== 200) {
          return;
        }
        tableRef.value.clearSelection();
        loadDataList();
        proxy.message.success("删除成功");
      });
  });
};
</script>
<style lang="less" scoped>
.data-list {
  .user-info {
    display: flex;
    align-items: center;
    .name-info {
      margin-left: 5px;
      font-size: 13px;
    }
  }
  .op {
    .iconfont {
      cursor: pointer;
    }
  }
}
</style>