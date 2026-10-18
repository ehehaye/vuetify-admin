# vuetify-admin

基于 Vue 3 + Vuetify 4 + Vite + TypeScript 的后台管理系统模板，内置动态路由、权限校验、多页签 keep-alive、主题切换与首页仪表盘；数据由本地 Mock 提供。

## 在线尝试

[Live Demo](https://vuetify.3mo.me)

## 功能

- 动态路由与登录守卫，菜单由后端接口驱动
- 基于权限码的操作级权限控制
- 多页签 + keep-alive，页签状态可持久化
- Material Design 色彩角色，支持亮色 / 深色 / 跟随系统与 6 种主题色
- 首页仪表盘、项目列表（服务端分页 / 排序 / 搜索）、表单抽屉、图片上传
- 函数式 Toast、加载遮罩、空状态与错误状态
- 本地 Mock API（`axios-mock-adapter`），按环境启用

## 技术栈

Vue 3.5 · Vuetify 4 · Pinia · Vue Router · TypeScript · Vite 7 · Tailwind CSS 4（`tw:` 前缀）

## 开发

```bash
pnpm i
pnpm dev
```

演示账号：`admin / admin`（完整权限）、`guest / guest`（只读）。

## 脚本

```bash
pnpm dev        # 启动开发服务器
pnpm build      # 类型检查 + 生产构建
pnpm typecheck  # vue-tsc --noEmit
pnpm lint       # ESLint
pnpm preview    # 预览构建产物
```

## Mock

开发环境默认启用本地 Mock（`.env.development` 中 `VITE_USE_MOCK=true`），生产构建默认关闭。若需在生产预览 Mock，可在构建时设置 `VITE_USE_MOCK=true`。
