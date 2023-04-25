<template>
  <div class="board-list">
    <div class="top-panel">
      <el-button type="primary" @click="showEdit('add', 0)">新增板块</el-button>
    </div>
    <el-row :gutter="10" :style="{ 'margin-top': '10px' }">
      <el-col :span="14">
        <el-card class="box-card">
          <template #header>
            <div class="card-height">
              <span>一级板快</span>
            </div>
          </template>
          <tables
            :columns="columns"
            :showPagination="false"
            :dataSource="tableData"
            :fetch="loadDataList"
            :options="tableOptions"
            ref="dataTableRef"
            @rowClick="rowClick"
          >
            <!-- 封面 -->
            <template #cover="{ row }">
              <cover :cover="row.cover"></cover>
            </template>

            <!-- 板块信息 -->
            <template #boardInfo="{ row }">
              <div>板块名称：{{ row.boardName }}</div>
              <div>发帖权限：{{ postTypeMap[row.postType] }}</div>
            </template>
            <!-- 操作 -->
            <template #op="{ index, row }">
              <div class="op">
                <span class="a-link" @click="showEdit('update', 0, row)"
                  >修改</span
                >
                <el-divider direction="vertical"></el-divider>
                <span class="a-link" @click="delBoard(row)">刪除</span>
                <el-divider direction="vertical"></el-divider>
                <span
                  :class="[index == 0 ? 'not-allow' : 'a-link']"
                  @click="changeSort(index, 'up', 0)"
                  >上移</span
                >
                <el-divider direction="vertical"></el-divider>
                <span
                  :class="[
                    tableData.list.length - 1 == index ? 'not-allow' : 'a-link',
                  ]"
                  @click="changeSort(index, 'down', 0)"
                  >下移</span
                >
              </div>
            </template>
          </tables>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card class="box-card">
          <template #header>
            <div class="card-height">
              <span>二级板快</span>
              <a href="#" class="a-link" @click="showEdit('add', 1)"
                >新增二级板块</a
              >
            </div>
          </template>
          <tables
            :columns="columns"
            :showPagination="false"
            :dataSource="tableChildData"
            :options="tableOptions"
          >
            <!-- 封面 -->
            <template #cover="{ row }">
              <cover :cover="row.cover"></cover>
            </template>

            <!-- 板块信息 -->
            <template #boardInfo="{ row }">
              <div>板块名称：{{ row.boardName }}</div>
              <div>发帖权限：{{ postTypeMap[row.postType] }}</div>
            </template>
            <!-- 操作 -->
            <template #op="{ index, row }">
              <div class="op">
                <span class="a-link" @click="showEdit('update', 1, row)"
                  >修改</span
                >
                <el-divider direction="vertical"></el-divider>
                <span class="a-link" @click="delBoard(row)">刪除</span>
                <el-divider direction="vertical"></el-divider>
                <span
                  :class="[index == 0 ? 'not-allow' : 'a-link']"
                  @click="changeSort(index, 'up', 1)"
                  >上移</span
                >
                <el-divider direction="vertical"></el-divider>
                <span
                  :class="[
                    tableChildData.list.length - 1 == index
                      ? 'not-allow'
                      : 'a-link',
                  ]"
                  @click="changeSort(index, 'down', 1)"
                  >下移</span
                >
              </div>
            </template>
          </tables>
        </el-card>
      </el-col>
    </el-row>
    <!-- 新增修改 -->
    <Dialog
      :isShow="dialogConfig.isShow"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      width="550px"
      @close="dialogConfig.isShow = false"
    >
      <el-form
        :model="formData"
        :rules="rules"
        ref="formDataRef"
        label-width="110px"
      >
        <!--input输入-->
        <el-form-item
          label="一级板块"
          prop="boardName"
          v-if="formData.boardType == 1"
        >
          {{ formData.pBoardName }}
        </el-form-item>
        <!--input输入-->
        <el-form-item label="板块名称" prop="boardName">
          <el-input
            clearable
            placeholder="请输入名称"
            v-model="formData.boardName"
          ></el-input>
        </el-form-item>
        <!-- 单选 -->
        <el-form-item label="发帖权限" prop="postType">
          <el-radio-group v-model="formData.postType">
            <el-radio :label="1">{{ postTypeMap[1] }}</el-radio>
            <el-radio :label="0">{{ postTypeMap[0] }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 单选 -->
        <el-form-item label="封面" prop="cover">
          <coverUpload v-model="formData.cover"></coverUpload>
        </el-form-item>
        <!--textarea输入-->
        <el-form-item label="简介" prop="boardDesc">
          <el-input
            clearable
            placeholder="请输入简介"
            type="textarea"
            v-model="formData.boardDesc"
            :autosize="{ minRows: 4, maxRows: 4 }"
          ></el-input>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>
<script setup>
import description from "./description.js";

import { ref, reactive, getCurrentInstance, nextTick } from "vue";
const { proxy } = getCurrentInstance();

const api = {
  loadBoard: "/board/loadBoard",
  saveBoard: "/board/saveBoard",
  delBoard: "/board/delBoard",
  changeBoardSort: "/board/changeBoardSort",
};
const postTypeMap = description.postTypeMap;
const columns = description.columns;

// 一级板块信息
const tableData = ref({});
// 二级板块信息
const tableChildData = ref({});
const tableOptions = {
  extHeight: 100,
  showIndex: true,
  tableHeight: null,
  stripe: true,
  border: false,
};

const currentBoard = ref(null);
const dataTableRef = ref();
const loadDataList = () => {
  proxy
    .request({
      url: api.loadBoard,
    })
    .then((res) => {
      if (!res || res.code !== 200) {
        return;
      }
      tableData.value.list = res.data;
      if (currentBoard.value == null && res.data.length > 0) {
        rowClick(res.data[0]);
      } else {
        currentBoard.value = res.data.find((item) => {
          return item.boardId == currentBoard.value.boardId;
        });
        rowClick(currentBoard.value);
      }
      nextTick(() => {
        dataTableRef.value.setCurrentRow("boardId", currentBoard.value.boardId);
      });
    });
};
loadDataList();
const rowClick = (row) => {
  currentBoard.value = row;
  tableChildData.value.list = row.children;
};

// 板块新增修改
const dialogConfig = reactive({
  isShow: false,
  title: "标题",
  buttons: [
    {
      text: "确定",
      click: (e) => {
        submitForm();
      },
    },
  ],
});

const formData = ref({});
const formDataRef = ref();
const rules = {
  boardName: [{ required: true, message: "请输入板块名称" }],
  postType: [{ required: true, message: "请输入发帖权限" }],
};
// 弹窗展示
const showEdit = (opType, boardType, data) => {
  dialogConfig.isShow = true;
  nextTick(() => {
    formDataRef.value.resetFields();
    switch (opType) {
      case "add":
        dialogConfig.title = boardType == 0 ? "新增板块" : "新增二级板块";
        formData.value = {};
        break;
      case "update":
        dialogConfig.title = boardType == 0 ? "修改板块" : "修改二级板块";
        formData.value = JSON.parse(JSON.stringify(data));
        if (formData.value.cover) {
          formData.value.cover = {
            imageUrl: formData.value.cover,
          };
        }
        break;
    }
    formData.value.boardType = boardType;
    switch (boardType) {
      case 1:
        formData.value.pBoardName = currentBoard.value.boardName;
        formData.value.pBoardId = currentBoard.value.boardId;
        break;
      default:
        formData.value.pBoardId = 0;
        break;
    }
  });
};

const submitForm = () => {
  formDataRef.value.validate((valid) => {
    if (!valid) {
      return;
    }
    let params = Object.assign({}, formData.value);
    // 封面不是文件类型时，设为空
    if (!params.cover instanceof File) {
      delete params.cover;
    }
    proxy
      .request({
        url: api.saveBoard,
        params,
      })
      .then((res) => {
        if (!res || res.code !== 200) {
          return;
        }
        dialogConfig.isShow = false;
        proxy.message.success("保存成功");
        loadDataList();
      });
  });
};
const delBoard = (data) => {
  proxy.confirm(`你确定要删除【${data.boardName}】吗？`, () => {
    proxy
      .request({
        url: api.delBoard,
        params: {
          boardId: data.boardId,
        },
      })
      .then((res) => {
        if (!res || res.code !== 200) {
          return;
        }
        // 如果删除当前选中的，清除选中
        if (currentBoard.value.boardId == data.boardId) {
          currentBoard.value = null;
        }
        proxy.message.success("删除成功");
        loadDataList();
      });
  });
};

// 修改排序
const changeSort = (index, type, boardType) => {
  let dataList = tableData.value.list;
  if (boardType == 1) {
    dataList = tableChildData.value.list;
  }
  if (
    (type === "down" && index == dataList.length - 1) ||
    (type === "up" && index == 0)
  ) {
    return;
  }
  let temp = dataList[index];
  let number = type === "down" ? 1 : -1;
  dataList.splice(index, 1);
  dataList.splice(index + number, 0, temp);
  let boardIdList = [];
  dataList.forEach((item) => {
    boardIdList.push(item.boardId);
  });
  proxy
    .request({
      url: api.changeBoardSort,
      params: {
        boardIds: boardIdList.join(","),
      },
    })
    .then((res) => {
      if (!res || res.code !== 200) {
        return;
      }
    });
};
</script>
<style lang="less" scoped>
.board-list {
  .box-card {
    .card-height {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .a-link {
        font-size: 14px;
      }
    }
    .op {
      .not-allow {
        cursor: not-allowed;
        color: #ddd;
        text-decoration: none;
      }
    }
  }
}
</style>