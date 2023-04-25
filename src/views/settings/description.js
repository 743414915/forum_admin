const description = {
  rules(proxy) {
    return {
      registerWelcomInfo: [{ required: true, message: "请输入欢迎消息" }],
      emailTitle: [{ required: true, message: "请输入邮件标题" }],
      emailContent: [{ required: true, message: "请输入邮件内容" }],
      postAudit: [{ required: true, message: "请选择帖子是否需要审核" }],
      commentAudit: [{ required: true, message: "请选择评论是否需要审核" }],
      postIntegral: [
        { required: true, message: "请输入发帖积分" },
        {
          validator: proxy.Verify.number,
          message: "请输入正确的数字",
        },
      ],
      postDayCountThreshold: [
        { required: true, message: "请输入每天可发帖数量" },
        {
          validator: proxy.Verify.number,
          message: "请输入正确的数字",
        },
      ],
      dayImageUploadCount: [
        { required: true, message: "请输入每天可上传图片数量" },
        {
          validator: proxy.Verify.number,
          message: "请输入正确的数字",
        },
      ],
      attachmentSize: [
        { required: true, message: "请输入附件允许最大大小" },
        {
          validator: proxy.Verify.number,
          message: "请输入正确的数字",
        },
      ],
      commentOpen: [{ required: true, message: "请选择是否开启评论" }],
      commentIntegral: [
        { required: true, message: "请输入评论可以获得的积分" },
        {
          validator: proxy.Verify.number,
          message: "请输入正确的数字",
        },
      ],
      commentDayCountThreshold: [
        { required: true, message: "请输入每天可发评论数量" },
        {
          validator: proxy.Verify.number,
          message: "请输入正确的数字",
        },
      ],
      lekeDayCountThreshold: [
        { required: true, message: "请输入每天可点赞数量" },
        {
          validator: proxy.Verify.number,
          message: "请输入正确的数字",
        },
      ],
    };
  }
}
export default description;