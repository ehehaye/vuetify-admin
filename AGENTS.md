# vuetify-admin

后台管理系统模板（Vue 3 + Vuetify 4 + Vite + TypeScript），内置动态路由、权限校验、多页签 keep-alive、主题切换与首页仪表盘；数据由本地 mock 提供。

## Project

- 入口：`index.html` → `src/main.ts`（`createApp` → `plugins` → 按需加载 `./mock` → Tailwind CSS）。
- 包管理器 **pnpm**（`pnpm-lock.yaml`），Node `>=20.19.0`，`"type": "module"`。
- 别名 `@` → `src`（见 `vite.config.ts` 与 `tsconfig.json`）。
- 环境变量在 `.env*` 中，只用 `VITE_*`：`VITE_APP_TITLE`、`VITE_ROUTER_HISTORY`、`VITE_MD_ICON_HREF`、`VITE_USE_MOCK`、`VITE_AMAP_JS_KEY`、`VITE_GITHUB_REPO`。类型声明见 `src/env.d.ts`。
- 字体：`@fontsource/roboto`（仅 latin 子集），中文回退到系统中文字体。

## Commands

```bash
pnpm i          # 安装依赖
pnpm dev        # vite --host 开发
pnpm build      # vue-tsc --noEmit && vite build → dist
pnpm typecheck  # vue-tsc --noEmit
pnpm lint       # eslint src types
pnpm lint:fix   # eslint --fix
pnpm preview    # 预览构建产物
pnpm test       # 占位脚本，项目暂无自动化测试
```

husky pre-commit 只跑 `pnpm lint`。CI 为 `.github/workflows/` 中的 Azure Static Web Apps 部署（`main` 分支）。

## Architecture

- `src/plugins/index.ts` — 所有插件在此显式安装，顺序为 **Vuetify → Pinia → Router → amap**。安装 Router 前会按持久化账号恢复动态菜单路由；`vuetify/index.ts` 单独存放全局组件默认样式。
- `src/router/` — `index.ts` 固定注册登录、布局壳（首页 / 404 / 兜底）；`buildRoutes` 只把菜单叶子节点挂到 layout 下并跳过已静态注册的路径，`resetRouter` 移除这些动态路由，启动与登录时调用；`permission.ts` 只负责登录重定向、权限校验、标题与 NProgress；`helper.ts` 的 `lazyImport` 把 `views/**` 组件包进 `PageScroll`，包装组件名基于**路由路径**（`page-home`），与页签的 keep-alive include 稳定匹配。
- `src/config/routes.ts` — `LOGIN_ROUTE` / `NOT_FOUND_ROUTE` / `FALLBACK_ROUTE` / `DEFAULT_ROUTE_PATH`。
- `src/config/theme.ts` — 6 种主题色 × 亮/暗两套完整 MD 色彩角色（surface/outline/on-* 等）；`readStoredTheme` 兼容旧版 `color` / `dark` 键，并在创建 Vuetify 前解析主题，避免首屏闪烁。
- `src/store/modules/account.ts` — 账号/权限/菜单，`useLocalStorage` 持久化；登录后显式调用 `generateRoutes()`，不再依赖隐式 watcher。
- `src/store/modules/settings.ts` — 主题色、主题模式（light/dark/system）、导航固定/抽屉状态、页签开关；`useMediaQuery` 跟随系统暗色。
- `src/store/modules/tagsView.ts` — 页签只存最小可序列化描述（path/fullPath/title/wrapName/keepAlive/closable），首页固定不可关闭。
- `src/api/<domain>/index.ts` + `types.ts` — 业务请求函数与类型；`@/utils/request.ts` 封装 axios：`baseURL=/api`、注入 `Bearer` token、解包 `ApiRes<T>`、401 清理登录态并跳转登录。请求函数通过 `http.get<T>` 等泛型直接返回业务 `data`。
- `src/mock/` — `VITE_USE_MOCK=true`（或开发环境默认）时才动态加载；`axios-mock-adapter` 拦截请求并在主线程内直接调用处理函数，数据在 `admin.json` / `guest.json` / `projects.json`。支持列表搜索/排序/分页、项目增删改与仪表盘聚合。
- `src/components/` — 自研 Vuetify 增强组件（`DataTable`、`FormDrawer`、`Toast`、`ImgUpload`、`TagsView`、`AuthProvider`、`Spin`、`NProgress`、`ActionBtn`、`PageHeader`）。`DataTable` 基于 `VDataTableServer`，内置远程分页/排序、查询/刷新、加载/空/错误态。
- `src/layout/` — `AppPage` 为路由壳，`AppHeader` 顶栏（内嵌多页签、主题切换、设置、用户菜单），`AppNavigation` 侧栏（递归分组菜单、移动端临时抽屉），`AppContent` 负责 keep-alive 路由视图与页面容器，`AppSetting` 个性化设置抽屉，`PageScroll` 提供每页独立滚动与滚动位置保持。

## Conventions

- **自动导入**：`vue` / `vue-router` / `pinia` 的 API（`ref`、`computed`、`watch`、`defineStore`、`storeToRefs`、`useRoute` 等）由 `unplugin-auto-import` 全局注入，**不要手写这些 import**；声明文件统一生成到 `types/auto-imports.d.ts`。
- **组件自动注册仅限 `src/components/**/index.vue`**；同目录私有子组件（如 `layout/components/NavItem.vue`）必须显式 import。Vuetify 组件由 `vite-plugin-vuetify` 自动导入。
- 页面组件的 keep-alive 名称由 `src/router/helper.ts` 的包装组件统一生成（基于路由路径），页面本身无需声明组件名，也不要写 `defineOptions`。
- **Tailwind 类必须以 `tw:` 前缀书写**（`src/assets/styles/tailwind.css` 中 `prefix(tw)`，未引入 preflight），颜色令牌映射到 Vuetify 主题变量。
- 主题半透明色请写成 `rgba(var(--v-theme-primary), 0.1)`；Vuetify 主题变量是逗号分隔的 RGB 三元组，`rgb(var(--v-theme-primary) / 0.1)` 无效。
- 组件形态统一由 `src/plugins/vuetify/index.ts` 的 `defaults` 控制（卡片、按钮、输入框、列表、表格等），页面优先使用 Vuetify props 而不是手写 CSS；背景、边框、文字颜色使用主题令牌。
- 全局类型见 `types/index.d.ts`：`ApiRes`、`TableReq`、`TableRes`、`RouteConfig`，以及通过模块增强扩展的 `RouteMeta`（`title` / `icon` / `keepAlive` / `hidden` / `permission` / `wrapName`）。
- 异步数据用 `usePromiseFn`（`src/composables/index.ts`）返回 `{ loading, error, result, exec }`；失败会重新抛出，调用方需局部处理错误态。权限判断用 `usePermissions` / `hasPermissions`（`src/composables/auth.ts`）。
- 列表页统一基于 `DataTable`：传入 `headers`（`DataTableHeader<T>[]`）、`params` 与 `load-data-fn`（参数 `TableReq`，返回 `TableRes<T>`），通过 `#search` / `#actions` / `#item.*` 插槽扩展。
- 代码风格：Prettier `{ "singleQuote": true }`，2 空格，分号结尾；ESLint 由 `@vue/eslint-config-typescript` + `@vue/eslint-config-prettier` 决定，`no-console` 仅 warn。
- UI 文案与注释使用中文；图标使用 Vuetify Material Design 图标名（如 `prepend-icon="person"`）。

## Notes

- 演示账号：`admin / admin`（完整权限）、`guest / guest`（只读）。
- Mock 数据在内存中修改，刷新页面后恢复为 `projects.json` 初始值。
- 生产构建默认不启用 Mock；本地预览如需 Mock，构建时设置 `VITE_USE_MOCK=true`。
