<template>
  <div class="article-comment">
    <Dialog
      :isShow="dialogConfig.isShow"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      width="700px"
      :isShowCancel="false"
      @close="dialogConfig.isShow = false"
    >
      <div class="comment-list">
        <div
          class="comment-item"
          v-for="(item, index) in commentList"
          :key="(item, index)"
        >
          <div class="p-comment-item">
            <avatar :userId="item.userId" :width="40"></avatar>
            <div class="content-info">
              <a
                :href="`${proxy.globalInfo.webDomain}/user/${item.userId}`"
                target="_blank"
                class="a-link"
                >{{ item.nickName }}</a
              >
              <div class="comment-content" v-html="item.content"></div>
              <div v-if="item.imgPath">
                <commentImage
                  :src="proxy.globalInfo.imageUrl + item.imgPath.replace('.', '_.')"
                  :imgList="[proxy.globalInfo.imageUrl + item.imgPath]"
                ></commentImage>
              </div>
              <div class="post-info">
                发布：{{ item.postTime }}&nbsp;·&nbsp;{{
                  item.userIpAddress
                }}&nbsp;·&nbsp;赞：{{ item.goodCount }}
              </div>
              <div v-if="item.children">
                <div
                  class="s-comment-item"
                  v-for="(sub, index) in item.children"
                  :key="sub + index"
                >
                  <avatar :userId="sub.userId" :width="40"></avatar>
                  <div class="content-info">
                    <a
                      :href="`${proxy.globalInfo.webDomain}/user/${sub.userId}`"
                      target="_blank"
                      class="a-link"
                      >{{ sub.nickName }}</a
                    >
                    <span v-if="sub.repayUserId">
                      回复<a
                        :href="`${proxy.globalInfo.webDomain}/user/${sub.repayUserId}`"
                        target="_blank"
                        class="a-link"
                        >{{ sub.repayUserId }}</a
                      >
                    </span>
                    <div class="comment-content" v-html="sub.content"></div>
                    <div class="post-info">
                      发布：{{ sub.postTime }}&nbsp;·&nbsp;{{
                        sub.userIpAddress
                      }}&nbsp;·&nbsp;赞：{{ sub.goodCount }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>
<script setup>
import commentImage from "@/components/commentImage/commentImage.vue";
import { ref, reactive, getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();

const api = {
  loadComment: "/forum/loadComment4Article",
};

const dialogConfig = reactive({
  isShow: false,
  title: "查看评论",
  buttons: [
    {
      text: "关闭",
      click: (e) => {
        dialogConfig.isShow = false;
      },
    },
  ],
});

const commentList = ref([]);
const show = (articleId) => {
  dialogConfig.isShow = true;
  proxy
    .request({
      url: api.loadComment,
      params: {
        articleId,
      },
    })
    .then((res) => {
      if (!res || res.code !== 200) {
        return;
      }
      commentList.value = res.data;
    });
};
defineExpose({ show });
</script>
<style lang="less" scoped>
.article-comment {
  .comment-list {
    .comment-item {
      margin-top: 10px;
      border-bottom: 1px solid #ddd;
      padding: 10px 0;
      .p-comment-item {
        display: flex;
      }
      .content-info {
        margin-left: 5px;
      }
      .comment-content {
        margin: 5px 0;
      }
      .post-info {
        font-size: 12px;
        color: reg(135, 130, 130);
      }
      .s-comment-item {
        display: flex;
        margin-top: 10px;
      }
    }
  }
}
</style>