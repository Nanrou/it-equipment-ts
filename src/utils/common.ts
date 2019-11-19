import user from "../store/modules/user";

export function auth(permission: number): boolean {
  return Boolean(permission & user.state.role);
}

export interface RouteMeta {
  icon: string;
  title: string;
  permission?: number;
  hideInMenu?: boolean;
  hideChildrenInMenu?: boolean;
}
