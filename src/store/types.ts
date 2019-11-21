export interface StoreUser {
  isLogin: boolean;
  name: string;
  role: number;
  department: string;
  isGlobal: boolean;
  phone: string;
}

export interface Equipment {
  key: string; // todo 加密转义
  category: string;
  brand: string;
  modelNumber: string;
  serialNumber: string;
  price: number;
  purchasingTime: string;
  guarantee: string;
  remark: string;
  status: number;
  user: string;
  owner: string; // todo change table
  department: string;
  edit: string;
  del_flag: boolean;
}
