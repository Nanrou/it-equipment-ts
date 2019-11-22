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
}
