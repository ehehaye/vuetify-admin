/// <reference path="auto-imports.d.ts" />
/// <reference path="components.d.ts" />

import 'vue-router';

export {};

declare global {
  interface ApiRes<T> {
    data: T;
    message: string;
    success: boolean;
  }

  interface TableSortItem {
    key: string;
    order?: 'asc' | 'desc';
  }

  interface TableReq {
    page: number;
    itemsPerPage: number;
    sortBy: TableSortItem[];
    [key: string]: unknown;
  }

  interface TableRes<T> {
    items: T[];
    total: number;
  }

  interface RouteConfig {
    name: string;
    path: string;
    component?: string;
    children?: RouteConfig[];
    meta?: RouteMeta;
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    title?: string;
    icon?: string;
    keepAlive?: boolean;
    hidden?: boolean;
    permission?: string | string[];
  }
}
