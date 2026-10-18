import { http } from '@/utils/request';
import type { ProjectInfo, ProjectTableReq, ProjectTableRes } from './types';

export * from './types';

export const addProject = (data: ProjectInfo) =>
  http.post<ProjectInfo>('/project', data);

export const editProject = (data: ProjectInfo) =>
  http.put<ProjectInfo>('/project', data);

export const deleteProject = (id: string) =>
  http.delete<null>(`/project/${encodeURIComponent(id)}`);

export const getProject = (id: string) =>
  http.get<ProjectInfo>(`/project/${encodeURIComponent(id)}`);

export const getProjects = (params: ProjectTableReq) =>
  http.get<ProjectTableRes>('/projects', { params });
