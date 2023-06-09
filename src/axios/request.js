// @ts-nocheck
import axios from "axios";
import { ElLoading } from "element-plus";
import message from "@/common/message.js";
import router from "../router";

const contentTypeForm = "applocation/x-www-form-urlencoded;charset=UTF-8";
const contentTypeJson = "applocation/json";
const instance = axios.create({
  baseURL: "/api",
  timeout: 10 * 1000,
})

// 请求前过滤器
let loading = null;
instance.interceptors.request.use(
  (config) => {
    if (config.showLoading) {
      loading = ElLoading.service({
        lock: true,
        text: "加载中...",
        background: "rgba(0, 0, 0, 0.5)"
      })
    }
    return config;
  },
  (error) => {
    if (error.config.showLoading && loading) {
      loading.close();
    }
    message.error("请求发送失败");
    return Promise.reject("请求发送失败");
  });

// 请求后过滤器
instance.interceptors.response.use(
  (response) => {
    const { showLoading, errorCallback, showError } = response.config;
    if (showLoading && loading) {
      loading.close();
    }
    const responseData = response.data;
    if (responseData.code == 200) {
      return responseData;
    } else if (responseData.code == 901) {
      setTimeout(() => {
        router.push("/login");
      }, 2000);
      return Promise.reject({ showError: true, msg: "登陆超时" });
    } else {
      errorCallback && errorCallback(responseData);
      return Promise.reject({ showError, msg: responseData.info });
    }
  },
  (error) => {
    if (error.config.showLoading && loading) {
      loading.close();
    }
    return Promise.reject({ showError: true, msg: "网络异常" });
  }
);


const request = async (config) => {
  const { url, params, dataType, showLoading = true, showError = true, errorCallback } = config;
  let contentType = contentTypeForm;
  let formData = new FormData();
  for (let key in params) {
    formData.append(key, params[key] === undefined ? " " : params[key]);
  }
  if (dataType && dataType === "json") {
    contentType = contentTypeJson;
  }
  let headers = {
    'Content-Type': contentType,
    'X-Requested-With': 'XMLHttpRequest',
  }
  try {
    return await instance.post(url, formData, {
      headers,
      showLoading,
      errorCallback,
      showError
    });
  } catch (error) {
    if (error.showError) {
      message.error(error.msg);
    }
    return null;
  }
}

export default request;