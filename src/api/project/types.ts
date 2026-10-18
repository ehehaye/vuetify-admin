export type ProjectType = '拔罐' | '推拿' | '足疗';
export type ProjectCategory = '常规' | '会员';

export interface ProjectInfo {
  id?: string;
  name: string;
  type: ProjectType;
  category: ProjectCategory;
  tags: string;
  percent: number;
  price: number;
  time: number;
  occupy: boolean;
  image?: string;
  lastModifyTime?: number;
}

export interface ProjectTableReq extends TableReq {
  name?: string;
}

export type ProjectTableRes = TableRes<ProjectInfo>;
