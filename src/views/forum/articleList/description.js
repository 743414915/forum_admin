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
      label: "封面",
      prop: "cover",
      width: 100,
      scopedSlots: "cover"
    },
    {
      label: "标题",
      scopedSlots: "titleInfo"
    },
    {
      label: "板块",
      width: 200,
      scopedSlots: "boardInfo"
    },
    {
      label: "互动信息",
      width: 200,
      scopedSlots: "interactionInfo"
    },
    {
      label: "是否有附件",
      prop: "attachment",
      width: 100,
      scopedSlots: "attachmentInfo"
    },
    {
      label: "状态信息",
      prop: "status",
      width: 100,
      scopedSlots: "statusInfo"
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