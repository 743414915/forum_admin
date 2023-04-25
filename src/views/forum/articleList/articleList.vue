<template>
  <div class="article-list">
    <div class="top-panel">
      <el-form :model="searchFormData" label-width="50px">
        <el-row>
          <el-col :span="4">
            <!--input输入-->
            <el-form-item label="标题">
              <el-input
                clearable
                placeholder="请输入标题"
                v-model="searchFormData.titleFuzzy"
                @keyup.enter="loadDataList"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <!--input输入-->
            <el-form-item label="昵称">
              <el-input
                clearable
                placeholder="请输入昵称"
                v-model="searchFormData.nickNameFuzzy"
                @keyup.enter="loadDataList"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="板块">
              <el-cascader
                placeholder="请选择板块"
                :options="boardList"
                :props="boardProps"
                clearable
                v-model="searchFormData.boardIds"
                :style="{ width: '100%' }"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <!-- 下拉框 -->
            <el-form-item label="附件">
              <el-select
                v-model="searchFormData.attachmentType"
                clearable
                placeholder="请选择附件"
                :style="{ width: '100%' }"
              >
                <el-option :value="1" label="有附件"></el-option>
                <el-option :value="2" label="无附件"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <!-- 下拉框 -->
            <el-form-item label="状态">
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
          <el-col :span="4">
            <!-- 下拉框 -->
            <el-form-item label="置顶">
              <el-select
                v-model="searchFormData.topType"
                clearable
                placeholder="请选择是否置顶"
                :style="{ width: '100%' }"
              >
                <el-option :value="0" label="未置顶"></el-option>
                <el-option :value="1" label="已置顶"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5" :style="{ 'padding-left': '10px' }">
            <el-button-group>
              <el-button type="primary" @click="loadDataList">搜索</el-button>
              <el-button
                type="success"
                @click="auditBatch"
                :disabled="selectBatchList.length == 0"
                >批量审批</el-button
              ><el-button
                type="danger"
                @click="delBatch"
                :disabled="selectBatchList.length == 0"
                >批量删除</el-button
              >
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
              <div>{{ row.userIpAddress }}</div>
            </div>
          </div>
        </template>
        <!-- 封面 -->
        <template #cover="{ row }">
          <cover :cover="row.cover"></cover>
        </template>
        <!-- 标题 -->
        <template #titleInfo="{ row }">
          <a
            :href="`${proxy.globalInfo.webDomain}/post/${row.articleId}`"
            class="a-link"
            target="_blank"
            tag="a"
            >{{ row.title }}</a
          >
        </template>
        <!-- 板块 -->
        <template #boardInfo="{ row }">
          <div>
            <span>{{ row.pboardName }}</span>
            <span v-if="row.boardName">/{{ row.boardName }}</span>
          </div>
        </template>
        <!-- 互动信息 -->
        <template #interactionInfo="{ row }">
          <div>阅读：{{ row.readCount }}</div>
          <div>点赞：{{ row.goodCount }}</div>
          <div>
            评论：<span>{{ row.commentCount }}</span>
            <span
              class="a-link"
              :style="{ 'margin-left': '5px' }"
              @click="showComment(row.articleId)"
              v-if="row.commentCount"
              >查看</span
            >
          </div>
        </template>
        <!-- 附件信息 -->
        <template #attachmentInfo="{ row }">
          <div v-if="row.attachmentType == 0">无附件</div>
          <div v-if="row.attachmentType == 1">
            <span
              @click="showAttachment(row.nickName, row.articleId)"
              class="a-link"
              >查看附件</span
            >
          </div>
        </template>
        <!-- 状态信息 -->
        <template #statusInfo="{ row }">
          <span v-if="row.status == -1" :style="{ color: 'red' }">已删除</span>
          <span v-if="row.status == 0" :style="{ color: 'red' }">待审核</span>
          <span v-if="row.status == 1" :style="{ color: 'green' }">已审核</span>
          <div v-if="row.topType == 1" :style="{ color: 'green' }">已置顶</div>
          <div v-if="row.topType == 0" :style="{ color: 'green' }">未置顶</div>
        </template>
        <!-- 操作信息 -->
        <template #op="{ row }">
          <div class="op" v-if="row.status != -1">
            <el-dropdown trigger="click">
              <span class="iconfont icon-more"></span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="updateBoard(row)"
                    >修改板块</el-dropdown-item
                  >
                  <el-dropdown-item
                    @click="topArticle(row)"
                    v-if="row.topType == 1 && row.status == 1"
                    >取消置顶</el-dropdown-item
                  >
                  <el-dropdown-item
                    @click="topArticle(row)"
                    v-if="row.topType == 0 && row.status == 1"
                    >置顶</el-dropdown-item
                  >
                  <el-dropdown-item @click="delArticle(row)"
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
    <!-- 修改板块 -->
    <articleBoard ref="articleBoardRef" @reload="loadDataList"></articleBoard>
    <!-- 查看附件 -->
    <articleAttachment ref="articleAttachmentRef"></articleAttachment>
    <!-- 查看评论 -->
    <articleComment ref="articleCommentRef"></articleComment>
  </div>
</template>
<script setup>
import description from "./description.js";
import articleBoard from "../articleBoard/articleBoard.vue";
import articleAttachment from "../articleAttachment/articleAttachment.vue";
import articleComment from "../articleComment/articleComment.vue";

import { ref, reactive, getCurrentInstance } from "vue";
import { useRouter, useRoute } from "vue-router";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();

const api = {
  loadDataList: "/forum/loadArticle",
  loadBoard: "/board/loadBoard",
  auditArticle: "/forum/auditArticle",
  deleteArticle: "/forum/deleteArticle",
  topArticle: "/forum/topArticle",
};

// 搜索
const searchFormData = ref({});
// 板块信息
const boardProps = {
  multiple: false,
  checkStrictly: true,
  value: "boardId",
  label: "boardName",
};
const boardList = ref([]);
const loadBoardList = () => {
  proxy
    .request({
      url: api.loadBoard,
    })
    .then((res) => {
      if (!res || res.code !== 200) {
        return;
      }
      boardList.value = res.data;
    });
};
loadBoardList();

const tableOptions = ref({
  selectType: "checkbox",
  extHeight: 100,
  showIndex: true,
  tableHeight: null,
  stripe: true,
  border: false,
});
const columns = description.columns;
const tableData = ref([]);
const loadDataList = () => {
  let params = {
    pageNo: tableData.value.pageNo,
    pageSize: tableData.value.pageSize,
  };
  Object.assign(params, searchFormData.value);
  if (params.boardIds && params.boardIds.length == 1) {
    params.pboardId = params.boardIds[0];
  } else if (params.boardIds && params.boardIds.length == 2) {
    params.pboardId = params.boardIds[0];
    params.boardId = params.boardIds[1];
  }
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

// 修改板块
const articleBoardRef = ref();
const updateBoard = (data) => {
  articleBoardRef.value.updateBoard(data);
};

// 置顶
const topArticle = (data) => {
  const opName = data.topType ? "取消置顶" : "设为置顶";
  proxy.confirm(`你确定要将【${data.title}】${opName}吗？`, () => {
    proxy
      .request({
        url: api.topArticle,
        params: {
          topType: data.dataType == 0 ? 1 : 0,
          articleId: data.articleId,
        },
      })
      .then((res) => {
        if (!res || res.code !== 200) {
          return;
        }
        loadDataList();
        proxy.message.success("置顶成功");
      });
  });
};

// 批量选择
const selectBatchList = ref([]);
const setRowSelected = (rows) => {
  selectBatchList.value = [];
  rows.forEach((item) => {
    selectBatchList.value.push(item.articleId);
  });
};

// 批量审批
const tableRef = ref();
const auditBatch = () => {
  proxy.confirm("你确定要批量审核吗？", () => {
    proxy
      .request({
        url: api.auditArticle,
        params: {
          articleIds: selectBatchList.value.join(","),
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
// 单个审批
const audit = (data) => {
  proxy.confirm(`你确定要审核【${data.title}】吗？`, () => {
    proxy
      .request({
        url: api.auditArticle,
        params: {
          articleIds: data.articleId,
        },
      })
      .then((res) => {
        if (!res || res.code !== 200) {
          return;
        }
        loadBoardList();
        proxy.message.success("审核成功");
      });
  });
};
// 单个删除
const delArticle = (data) => {
  proxy.confirm(`你确定要删除【${data.title}】吗？`, () => {
    proxy
      .request({
        url: api.deleteArticle,
        params: {
          articleIds: data.articleId,
        },
      })
      .then((res) => {
        if (!res || res.code !== 200) {
          return;
        }
        loadBoardList();
        proxy.message.success("删除成功");
      });
  });
};
// 批量删除
const delBatch = () => {
  proxy.confirm("你确定要批量删除吗？", () => {
    proxy
      .request({
        url: api.deleteArticle,
        params: {
          articleIds: selectBatchList.value.join(","),
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

// 查看附件
const articleAttachmentRef = ref();
const showAttachment = (nickName, articleId) => {
  articleAttachmentRef.value.show(nickName, articleId);
};

// 查看评论
const articleCommentRef = ref();
const showComment = (articleId) => {
  articleCommentRef.value.show(articleId);
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