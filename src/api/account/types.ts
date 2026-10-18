export interface AccountInfo {
  username: string;
  token: string;
  roles: string[];
  permissions: string[];
  menus: RouteConfig[];
}

export interface LoginReq {
  username: string;
  password: string;
}
