<template>
  <div class="article-attachment">
    <Dialog
      :isShow="dialogConfig.isShow"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      width="500px"
      :isShowCancel="false"
      @close="dialogConfig.isShow = false"
    >
      <el-form :model="formData" label-width="120px">
        <el-form-item label="发布人">
          <avatar :userId="formData.userId" :width="40"></avatar>
          <span :style="{ 'margin-left': '5px' }">{{ formData.nickName }}</span>
        </el-form-item>
        <el-form-item label="文件名">{{ formData.fileName }}</el-form-item>
        <el-form-item label="大小">{{
          utils.formatFileSize(formData.fileSize)
        }}</el-form-item>
        <el-form-item label="下载所需积分">{{
          formData.integral
        }}</el-form-item>
        <el-form-item label="">
          <a
            :href="`/api/forum/attachmentDownload?fileId=${formData.fileId}`"
            target="_blank"
            class="a-link"
            >下载</a
          >
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>
<script setup>
import utils from "@/utils/utils.js";

import { ref, reactive, getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();

const api = {
  getAttachment: "/forum/getAttachment",
};

const dialogConfig = reactive({
  isShow: false,
  title: "查看附件",
  buttons: [
    {
      text: "关闭",
      click: (e) => {
        dialogConfig.isShow = false;
      },
    },
  ],
});

const formData = ref({});
const show = (nickName, articleId) => {
  dialogConfig.isShow = true;
  proxy
    .request({
      url: api.getAttachment,
      params: {
        articleId,
      },
    })
    .then((res) => {
      if (!res || res.code !== 200) {
        return;
      }
      formData.value = res.data;
      formData.value.nickName = nickName;
    });
};
defineExpose({ show });
</script>
<style lang="less" scoped>
</style>