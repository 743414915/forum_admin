const description = {
  columns: [
    {
      label: "封面",
      prop: "cover",
      width: 80,
      scopedSlots: "cover"
    },
    {
      label: "板块信息",
      prop: "boardName",
      width: 210,
      scopedSlots: "boardInfo"
    },
    {
      label: "简介",
      prop: "boardDesc",
    },
    {
      label: "操作",
      prop: "op",
      width: 190,
      scopedSlots: "op"
    },
  ],
  postTypeMap: {
    0: "只允许管理员发帖",
    1: "任何人可以发帖",
  }
}
export default description;