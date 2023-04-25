const description = {
  columns: [
    {
      label: "序号",
      prop: "serialNumber",
      width: 60,
      scopedSlots: "serialNumber"
    },
    {
      label: "用户信息",
      prop: "avatar",
      width: 200,
      scopedSlots: "userInfo"
    },
    {
      label: "评论内容",
      prop: "content",
      scopedSlots: "contentInfo"
    },
    {
      label: "点赞",
      width: 150,
      scopedSlots: "goodCount"
    },
    {
      label: "状态",
      prop: "status",
      width: 100,
      scopedSlots: "statusInfo"
    },
    {
      label: "发布地址",
      prop: "userIpAddress",
      width: 100,
    },
    {
      label: "发布时间",
      prop: "postTime",
      width: 180,
    },
    {
      label: "操作",
      prop: "op",
      width: 80,
      scopedSlots: "op"
    },
  ]
}
export default description;