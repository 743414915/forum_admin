const description = {
  columns: [
    {
      label: "序号",
      prop: "serialNumber",
      width: 60,
      scopedSlots: "serialNumber"
    },
    {
      label: "头像",
      prop: "avatar",
      width: 80,
      scopedSlots: "avatar"
    },
    {
      label: "昵称",
      prop: "nickName",
      width: 150,
      scopedSlots: "nickName"
    },
    {
      label: "邮箱",
      prop: "email",
      width: 180,
    },
    {
      label: "个人描述",
      prop: "personDescription",
    },
    {
      label: "加入时间",
      prop: "joinTime",
      width: 180,
    },
    {
      label: "登录信息",
      prop: "lastLoginTime",
      width: 260,
      scopedSlots: "loginInfo"
    },
    {
      label: "积分",
      prop: "totalIntegral",
      width: 150,
      scopedSlots: "integral"
    },
    {
      label: "状态",
      prop: "status",
      width: 60,
      scopedSlots: "status"
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