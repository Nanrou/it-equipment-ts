export interface StoreUser {
  isLogin: boolean;
  name: string;
  role: number;
  department: string;
  isGlobal: boolean;
  phone: string;
}

export interface Equipment {
  eid?: string; // todo 加密转义
  category: string;
  brand: string;
  modelNumber: string;
  serialNumber: string;
  price: number;
  purchasingTime: string;
  guarantee: number;
  remark: string;
  status: number;
  user: string;
  owner: string; // todo change table
  department: string;
  edit: string;
  del_flag: boolean;
}

export interface FormOptions {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface AddEquipmentInterface {
  category: string;
  brand: string;
  modelNumber: string;
  serialNumber: string;
  price: number;
  purchasingTime: string;
  guarantee: number;
  remark: string;
  status: number;
  user: string;
  owner: string; // todo change table
  department: string;
  hardware?: any;
}

export interface Hardware {
  ip: string;
  cpu: string;
  gpu: string;
  mainBoard: string;
  memory: string;
  disk: string;
  remark: string;
}

export interface TreeNode {
  label: string;
  value: string;
  children: TreeNode[];
}

export interface UpdateDepartmentLabelInterface {
  label: string;
}

export interface AddDepartmentLabelInterface {
  label: string;
  parentId: string;
}

export interface ChangePasswordInterface {
  originPassword: string;
  newPassword: string;
}

export interface UserData {
  username: string;
  name: string;
  role: number;
  department: string;
  phone: string;
  password?: string;
  workNumber?: string;
}
