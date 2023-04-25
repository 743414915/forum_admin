<template>
  <div class="login-body">
    <div class="login-panel">
      <div class="login-title">管理员登陆</div>
      <el-form :model="formData" :rules="rules" ref="formDataRef">
        <!--input输入-->
        <el-form-item
          :prop="item.key"
          v-for="(item, index) in description.loginDes"
          :key="item + index"
        >
          <div class="form-item-panel">
            <el-input
              clearable
              :placeholder="item.message"
              v-model.trim="formData[item.key]"
              size="large"
              :type="item.type"
              class="input-panel"
              @keyup.enter="login"
            >
              <template #prefix>
                <span :class="['iconfont', item.icon]"></span>
              </template>
            </el-input>
            <img
              :src="checkcodeUrl"
              alt=""
              class="check-code"
              @click="changeCheckCode"
              v-if="item.key === 'checkCode'"
            />
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :style="{ width: '100%' }" @click="login"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script setup>
import description from "./description.js";
import md5 from "js-md5";

import { ref, reactive, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
const { proxy } = getCurrentInstance();
const router = useRouter();
const api = {
  checkCode: "api/account/checkCode",
  login: "account/login",
};

const checkcodeUrl = ref(api.checkCode);
const changeCheckCode = () => {
  checkcodeUrl.value = api.checkCode + "?" + new Date().getTime();
};

const formData = ref({});
const formDataRef = ref();
const rules = {
  account: [{ required: true, message: "请输入账号" }],
  password: [{ required: true, message: "请输入密码" }],
  checkcode: [{ required: true, message: "请输入验证码" }],
};

const login = () => {
  formDataRef.value.validate((valid) => {
    if (!valid) {
      return;
    }
    let params = Object.assign({}, formData.value);
    params.password = md5(params.password);
    proxy
      .request({
        url: api.login,
        params,
        errorCallback: () => {
          changeCheckCode();
        },
      })
      .then((res) => {
        if (!res || res.code !== 200) {
          return;
        }
        proxy.message.success("登陆成功", () => {
          router.push("/");
        });
        proxy.VueCookies.set("userInfo", res.data, 0);
      });
  });
};
</script>
<style lang="less" scoped>
.login-body {
  width: 100%;
  height: 100vh;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url("@/assets/img/login.png");
  .login-panel {
    margin-top: 150px;
    width: 350px;
    float: right;
    margin-right: 100px;
    padding: 20px;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 5px;
    box-shadow: 2px 2px 10px #ddd;
    .login-title {
      font-size: 25px;
      text-align: center;
      margin-bottom: 10px;
      color: rgb(251, 185, 223);
    }
    .form-item-panel {
      width: 100%;
      display: flex;
      align-items: center;
      .input-panel {
        flex: 1;
      }
      .check-code {
        margin-left: 5px;
        cursor: pointer;
      }
    }
  }
}
</style>