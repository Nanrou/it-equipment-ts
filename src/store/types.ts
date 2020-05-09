export interface StoreUser {
  isLogin: boolean;
  name: string;
  role: number;
  department: string;
  isGlobal: boolean;
  phone: string;
  email: string;
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
  owner: string;
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
  hid?: string;
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
  uid?: string;
  username: string;
  name: string;
  role: number;
  department: string;
  phone: string;
  password?: string;
  workNumber?: string;
  email?: string;
}

export interface MaintenanceOrder {
  oid: string;
  orderId: string;
  status: string;
  pid: string;
  name: string;
  eid: string;
  equipment: string;
  department: string;
  content: string;
  reason: string;
  rank: number;
}

export interface MaintenanceFlowType {
  status: string;
  content: string;
}

export interface MaintenanceWorker {
  pid: string;
  name: string;
  phone: string;
  email: string;
}

export class BubbleItem {
  index: number;
  x: number;
  y: number;
  r: number;
  color: string;
  canvas: CanvasRenderingContext2D;
  constructor(
    canvas: CanvasRenderingContext2D,
    index: number,
    x: number,
    y: number
  ) {
    this.index = index;
    this.x = x;
    this.y = y;
    this.canvas = canvas;
    this.r = Math.random() * 30;
    this.color = `rgba(255, 255, 255, ${(Math.floor(Math.random() * 10) + 1) /
      10 /
      2})`;
  }
  draw() {
    this.canvas.fillStyle = this.color;
    this.canvas.shadowBlur = this.r * 2;
    this.canvas.beginPath();
    this.canvas.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
    this.canvas.closePath();
    this.canvas.fill();
  }
  move(h: number) {
    this.y -= 0.5;
    if (this.y <= -10) {
      this.y = h + 10;
    }
    this.draw();
  }
}

export interface PreviewData {
  category: string;
  brand: string;
  modelNumber: string;
  serialNumber: string;
  price: number;
  purchasingTime: string;
  user: string;
  owner: string;
  department: string;
}

export interface MaintenancePatrol {
  pid: string;
  patrolId: string;
  name: string;
}

export interface PatrolDetailType {
  department: string;
  category: string;
  check: number;
  checkTime: string;
}
