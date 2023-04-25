<template>
  <div class="send-message">
    <Dialog
      :isShow="dialogConfig.isShow"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      width="500px"
      @close="dialogConfig.isShow = false"
    >
      <el-form :model="formData" :rules="rules" ref="formDataRef">
        <!--textarea输入-->
        <el-form-item label="消息内容" prop="message">
          <el-input
            clearable
            placeholder="请输入消息内容"
            type="textarea"
            :rows="5"
            :maxlength="200"
            resize="none"
            show-word-limit
            v-model="formData.message"
          ></el-input>
        </el-form-item>
        <!--input输入-->
        <el-form-item label="积分" prop="integral">
          <el-input
            clearable
            placeholder="积分为空或者0不增减积分，负数为扣减，正数为增加"
            v-model="formData.integral"
          ></el-input>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>
<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
const { proxy } = getCurrentInstance();

const api = {
  sendMessage: "/user/sendMessage",
};

const formData = ref({});
const formDataRef = ref();
const rules = {
  message: [{ required: true, message: "请输入消息内容" }],
};

const dialogConfig = reactive({
  isShow: false,
  title: "发送消息",
  buttons: [
    {
      text: "确定",
      click: (e) => {
        submitForm();
      },
    },
  ],
});
const sendMessage = (data) => {
  dialogConfig.isShow = true;
  nextTick(() => {
    formDataRef.value.resetFields();
    formData.value = {
      userId: data.userId,
      nickName: data.nickName,
    };
  });
};
defineExpose({ sendMessage });

// 提交表单, 发送消息
const emit = defineEmits(["reload"]);
const submitForm = () => {
  formDataRef.value.validate((valid) => {
    if (!valid) {
      return;
    }
    let params = Object.assign({}, formData.value);
    proxy
      .request({
        url: api.sendMessage,
        params,
      })
      .then((res) => {
        if (!res || res.code !== 200) {
          return;
        }
        dialogConfig.isShow = false;
        proxy.message.success("发送成功");

        emit("reload");
      });
  });
};
</script>
<style lang="less" scoped>
</style>