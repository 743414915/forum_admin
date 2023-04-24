<template>
  <div class="article-board">
    <Dialog
      :isShow="dialogConfig.isShow"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      width="400px"
      :isShowCancel="false"
      @close="dialogConfig.isShow = false"
    >
      <el-form
        :model="formData"
        :rules="rules"
        ref="formDataRef"
        label-width="80px"
        @submit.prevent
      >
        <el-form-item label="标题">
          {{ formData.title }}
        </el-form-item>
        <el-form-item label="板块" prop="boardIds">
          <el-cascader
            placeholder="请选择板块"
            :options="boardList"
            :props="boardProps"
            clearable
            v-model="formData.boardIds"
            :style="{ width: '100%' }"
          ></el-cascader>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>
<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
const { proxy } = getCurrentInstance();

const api = {
  loadBoard: "/board/loadBoard",
  updateBoard: "forum/updateBoard",
};

const formData = ref({});
const formDataRef = ref();
const rules = {
  boardIds: [{ required: true, message: "请选择板块" }],
};

const dialogConfig = reactive({
  isShow: false,
  title: "修改板块",
  buttons: [
    {
      type: "primary",
      text: "确定",
      click: (e) => {
        submitForm();
      },
    },
  ],
});

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

const emit = defineEmits();
const submitForm = () => {
  formDataRef.value.validate((valid) => {
    if (!valid) {
      return;
    }
    let params = { articleId: formData.value.articleId };
    params.boardIds = formData.value.boardIds;
    if (params.boardIds && params.boardIds.length == 1) {
      params.pBoardId = params.boardIds[0];
    } else if (params.boardIds && params.boardIds.length == 2) {
      params.pBoardId = params.boardIds[0];
      params.boardId = params.boardIds[1];
    }
    proxy
      .request({
        url: api.updateBoard,
        params,
      })
      .then((res) => {
        if (!res || res.code !== 200) {
          return;
        }
        proxy.message.success("板块更改成功！")
        dialogConfig.isShow = false;
        emit("reload");
      });
  });
};

const updateBoard = (data) => {
  dialogConfig.isShow = true;
  nextTick(() => {
    formDataRef.value.resetFields();
    data.boardIds = [];
    data.boardIds.push(data.pboardId);
    if (data.boardId) {
      data.boardIds.push(data.boardId);
    }
    formData.value = data;
  });
};
defineExpose({ updateBoard });
</script>
<style lang="less" scoped>
</style>