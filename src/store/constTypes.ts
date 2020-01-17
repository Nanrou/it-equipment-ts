// localStorage的字段
export const LOCAL_TOKEN = "it-token"; // 本地token的存储名称
export const LOCAL_REMEMBER = "it-remember"; // 本地用户信息的存储名称
export const LOCAL_SETTINGS = "it-settings"; // 关于页面习惯的本地存储
export const LOCAL_DEPARTMENT_STRUCTURE = "it-department-structure";
export const LOCAL_EQUIPMENTS = "it-equipments";
export const LOCAL_MAINTENANCE = "it-maintenance";

// export const USER_NAMESPACE = "user";
const USER_NAMESPACE = "user";
export const SET_LOGIN = `${USER_NAMESPACE}/setLogin`;
export const SET_LOGOUT = `${USER_NAMESPACE}/setLogout`;
// export const SET_LOGOUT = `setLogout`;

// Some options
export const CategoryOptions = [
  "笔记本电脑",
  "台式电脑",
  "手机",
  "手持平板",
  "抄表器",
  "一体打印机",
  "数码复合机",
  "传真机",
  "卫星电话",
  "其他设备"
];

export const RemoteHandleMethodOptions = ["电话解决", "远程操作", "其他"];

export const MaintenanceStatusOptions = [
  { label: "待接单", value: "R" },
  { label: "已指派", value: "D" },
  { label: "处理中", value: "H" },
  { label: "待评价", value: "E" },
  { label: "已完结", value: "F" },
  { label: "已取消", value: "C" }
];

export const EquipmentStatusOptions = [
  { label: "正常", value: 0 },
  { label: "维修", value: 1 },
  { label: "备用", value: 2 },
  { label: "报废", value: 3 }
];

export const RoleOptions = [
  { label: "普通写", value: 0b000001 },
  { label: "高级写", value: 0b000010 },
  { label: "维修", value: 0b000100 },
  { label: "高级维修", value: 0b001000 },
  { label: "super", value: 0b010000 }
];

export const ConfigMapper = {
  sendSms: "发送短信",
  sendEmail: "发送邮件"
};
