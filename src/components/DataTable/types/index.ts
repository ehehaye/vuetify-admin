/* eslint-disable @typescript-eslint/no-explicit-any */
export type Res = TableRes<any>;

export interface Props {
  loadDataFn: (req: TableReq) => Promise<Res>;
  headers: any[];
  multiSort?: boolean;
}

export const getDefaultRes = (): Res => ({ items: [], total: 0 });
