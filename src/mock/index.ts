import { HttpStatusCode } from 'axios';
import Adaptor from 'axios-mock-adapter';
import request from '@/utils/request';
import type { AccountInfo, LoginReq } from '@/api/account';
import type { ProjectCategory, ProjectInfo, ProjectType } from '@/api/project';
import type { DashboardData } from '@/api/dashboard';
import admin from './admin.json';
import guest from './guest.json';
import rawProjects from './projects.json';

type MockResponse = [number, ApiRes<unknown>];
type ProjectListQuery = Partial<TableReq> & { name?: string };

const accounts: Record<string, { password: string; account: AccountInfo }> = {
  admin: { password: 'admin', account: admin as AccountInfo },
  guest: { password: 'guest', account: guest as AccountInfo },
};

const projects: ProjectInfo[] = rawProjects.map((project) => ({
  ...project,
  type: project.type as ProjectType,
  category: project.category as ProjectCategory,
  time: Number(project.time),
  price: Number(project.price),
  percent: Number(project.percent),
  lastModifyTime: Number(project.lastModifyTime),
}));

const ok = <T>(data: T, message = ''): MockResponse => [
  HttpStatusCode.Ok,
  { data, message, success: true },
];

const fail = (status: number, message: string): MockResponse => [
  status,
  { data: null, message, success: false },
];

const compareValues = (left: unknown, right: unknown) => {
  if (typeof left === 'number' && typeof right === 'number') {
    return left - right;
  }
  return String(left).localeCompare(String(right), 'zh-CN');
};

const findProject = (id: string) => projects.find((item) => item.id === id);

const login = ({ username, password }: LoginReq): MockResponse => {
  const entry = accounts[username.trim().toLowerCase()];

  if (!entry || entry.password !== password) {
    return fail(HttpStatusCode.Unauthorized, '用户名或密码错误');
  }

  return ok(entry.account, '登录成功');
};

const getProjects = ({
  name = '',
  page = 1,
  itemsPerPage = 10,
  sortBy = [],
}: ProjectListQuery): MockResponse => {
  const keyword = name.trim().toLowerCase();

  const items = keyword
    ? projects.filter((project) => project.name.toLowerCase().includes(keyword))
    : [...projects];

  if (sortBy.length) {
    const [{ key, order }] = sortBy;
    items.sort((left, right) => {
      const result = compareValues(
        left[key as keyof ProjectInfo],
        right[key as keyof ProjectInfo],
      );
      return order === 'desc' ? -result : result;
    });
  }

  const total = items.length;
  const pagedItems =
    itemsPerPage === -1
      ? items
      : items.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return ok({ items: pagedItems, total });
};

const getProject = (id: string): MockResponse => {
  const project = findProject(id);
  return project ? ok(project) : fail(HttpStatusCode.NotFound, '项目不存在');
};

const addProject = (payload: ProjectInfo): MockResponse => {
  const project: ProjectInfo = {
    ...payload,
    id: crypto.randomUUID(),
    lastModifyTime: Date.now(),
  };

  projects.unshift(project);
  return ok(project, '新增项目成功');
};

const updateProject = (payload: ProjectInfo): MockResponse => {
  const index = projects.findIndex((item) => item.id === payload.id);

  if (index === -1) {
    return fail(HttpStatusCode.NotFound, '项目不存在');
  }

  const project: ProjectInfo = {
    ...projects[index],
    ...payload,
    lastModifyTime: Date.now(),
  };

  projects[index] = project;
  return ok(project, '编辑项目成功');
};

const deleteProject = (id: string): MockResponse => {
  const index = projects.findIndex((item) => item.id === id);

  if (index === -1) {
    return fail(HttpStatusCode.NotFound, '项目不存在');
  }

  projects.splice(index, 1);
  return ok(null, '删除项目成功');
};

const monthKey = (timestamp: number) => {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${date.getMonth()}`;
};

const getDashboard = (): MockResponse => {
  const total = projects.length || 1;
  const sum = (pick: (project: ProjectInfo) => number) =>
    projects.reduce((acc, project) => acc + pick(project), 0);

  const occupied = projects.filter((project) => project.occupy).length;

  const maxTime =
    projects.reduce(
      (latest, project) => Math.max(latest, project.lastModifyTime ?? 0),
      0,
    ) || Date.now();
  const end = new Date(maxTime);
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(end.getFullYear(), end.getMonth() - (5 - index), 1);
    return {
      key: `${date.getFullYear()}-${date.getMonth()}`,
      label: `${date.getMonth() + 1}月`,
    };
  });

  const trend = months.map(({ key, label }) => ({
    label,
    value: projects.filter(
      (project) =>
        project.lastModifyTime && monthKey(project.lastModifyTime) === key,
    ).length,
  }));

  const counts = new Map<ProjectType, number>();
  projects.forEach((project) => {
    counts.set(project.type, (counts.get(project.type) ?? 0) + 1);
  });
  const types = [...counts.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((left, right) => right.value - left.value);

  const data: DashboardData = {
    stats: {
      total: projects.length,
      avgPrice: Math.round(sum((project) => project.price) / total),
      avgPercent: Math.round(sum((project) => project.percent) / total),
      occupyRate: Math.round((occupied / total) * 100),
    },
    trend,
    types,
  };

  return ok(data);
};

const idFromUrl = (url?: string) => {
  const segments = (url ?? '').split('/');
  return decodeURIComponent(segments[segments.length - 1] ?? '');
};

const adaptor = new Adaptor(request, { delayResponse: 350 });

adaptor
  .onPost('/api/login')
  .reply((config) => login(JSON.parse(config.data) as LoginReq));

adaptor.onGet('/api/dashboard').reply(() => getDashboard());

adaptor
  .onGet('/api/projects')
  .reply((config) => getProjects(config.params ?? {}));

adaptor
  .onPost('/api/project')
  .reply((config) => addProject(JSON.parse(config.data) as ProjectInfo));

adaptor
  .onPut('/api/project')
  .reply((config) => updateProject(JSON.parse(config.data) as ProjectInfo));

adaptor
  .onGet(/\/api\/project\/[^/]+$/)
  .reply((config) => getProject(idFromUrl(config.url)));

adaptor
  .onDelete(/\/api\/project\/[^/]+$/)
  .reply((config) => deleteProject(idFromUrl(config.url)));
