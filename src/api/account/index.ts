import { http } from '@/utils/request';
import type { AccountInfo, LoginReq } from './types';

export * from './types';

export const login = (data: LoginReq) => http.post<AccountInfo>('/login', data);
