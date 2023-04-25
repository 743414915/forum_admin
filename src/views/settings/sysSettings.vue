<template>
  <div class="sys-settings">
    <el-form
      :model="formData"
      :rules="rules"
      ref="formDataRef"
      :style="{ width: '800px' }"
    >
      <el-divider content-position="left">用户注册欢迎消息</el-divider>
      <el-row>
        <el-col :span="24">
          <!--input输入-->
          <el-form-item label="欢迎消息" prop="registerWelcomInfo">
            <el-input
              clearable
              placeholder="请输入注册欢迎消息"
              v-model="formData.registerWelcomInfo"
              maxlength="250"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider content-position="left">邮件设置</el-divider>
      <el-row>
        <el-col :span="24">
          <!--input输入-->
          <el-form-item label="邮件标题" prop="emailTitle">
            <el-input
              clearable
              placeholder="请输入邮件标题"
              v-model="formData.emailTitle"
              maxlength="200"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <!--input输入-->
          <el-form-item label="邮件内容" prop="emailContent">
            <el-input
              clearable
              placeholder="请输入邮件内容,验证码使用%s占位符"
              v-model="formData.emailContent"
              maxlength="300"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider content-position="left">审核设置</el-divider>
      <el-row>
        <el-col :span="12">
          <!--input输入-->
          <el-form-item label="帖子是否需要审核" prop="postAudit">
            <el-radio-group v-model="formData.postAudit">
              <el-radio :label="false">无需审核</el-radio>
              <el-radio :label="true">需要审核</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <!--input输入-->
          <el-form-item label="评论是否需要审核" prop="commentAudit">
            <el-radio-group v-model="formData.commentAudit">
              <el-radio :label="false">无需审核</el-radio>
              <el-radio :label="true">需要审核</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider content-position="left">发帖设置</el-divider>
      <el-row>
        <el-col :span="12">
          <!--input输入-->
          <el-form-item label="发帖积分" prop="postIntegral">
            <el-input
              clearable
              placeholder="请输入发帖可以获得的积分"
              v-model="formData.postIntegral"
            ></el-input>
          </el-form-item>
          <el-form-item label="每天可以发帖数量" prop="postDayCountThreshold">
            <el-input
              clearable
              placeholder="请输入每天可发帖数量"
              v-model="formData.postDayCountThreshold"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <!--input输入-->
          <el-form-item label="每天可上传图片数量" prop="dayImageUploadCount">
            <el-input
              clearable
              placeholder="请输入每天可上传图片数量"
              v-model="formData.dayImageUploadCount"
            ></el-input>
          </el-form-item>
          <el-form-item label="允许附件大小（MB）" prop="attachmentSize">
            <el-input
              clearable
              placeholder="请输附件允许最大大小"
              v-model="formData.attachmentSize"
            >
              <template #append>MB</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider content-position="left">评论设置</el-divider>
      <el-row>
        <el-col :span="24">
          <!--input输入-->
          <el-form-item label="是否开启评论" prop="commentOpen">
            <el-radio-group v-model="formData.commentOpen">
              <el-radio :label="true">开启</el-radio>
              <el-radio :label="false">关闭</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <!--input输入-->
          <el-form-item label="评论积分" prop="commentIntegral">
            <el-input
              clearable
              placeholder="请输入评论可以获得的积分"
              v-model="formData.commentIntegral"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <!--input输入-->
          <el-form-item
            label="每天可发评论数量"
            prop="commentDayCountThreshold"
          >
            <el-input
              clearable
              placeholder="请输入每天可发评论数量"
              v-model="formData.commentDayCountThreshold"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider content-position="left">点赞设置</el-divider>
      <el-row>
        <el-col :span="12">
          <!--input输入-->
          <el-form-item label="每天可点赞数量" prop="likeDayCountThreshold">
            <el-input
              clearable
              placeholder="请输入每天可点赞数量"
              v-model="formData.likeDayCountThreshold"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="">
        <el-button type="primary" @click="saveSetting">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup>
import description from "./description.js";

import { ref, reactive, getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();

const api = {
  loadSetting: "/setting/getSetting",
  saveSetting: "/setting/saveSetting",
};
const rules = description.rules(proxy);

// 获取系统设置
const formData = ref({});
const formDataRef = ref();
const getSetting = () => {
  proxy
    .request({
      url: api.loadSetting,
    })
    .then((res) => {
      if (!res || res.code !== 200) {
        return;
      }
      let resData = res.data;
      for (let item in resData) {
        let subData = resData[item];
        if (subData != null) {
          for (let subItem in subData) {
            formData.value[subItem] = subData[subItem];
          }
        }
      }
    });
};
getSetting();

const saveSetting = () => {
  formDataRef.value.validate((valid) => {
    if (!valid) {
      return;
    }
    proxy
      .request({
        url: api.saveSetting,
        params: formData.value,
      })
      .then((res) => {
        if (!res || res.code !== 200) {
          return;
        }
        proxy.message.success("保存成功");
      });
  });
};
</script>
<style lang="less" scoped>
</style>