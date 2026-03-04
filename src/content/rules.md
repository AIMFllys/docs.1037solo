# NextJS 前端项目规则与约束 (AGENT Code)

面向 AI Agent 的前端工程规范，涵盖架构约束、编码约定与 UI/UX 实现准则。

## 项目架构规则

> *本章定义目录结构、命名规范与核心编码约定，所有代码变更必须遵守。约束级别：必须 = 强制执行，应该 = 推荐遵循，永不 = 严格禁止*

### 目录结构与命名规范

#### 顶层目录

```text
├── app/                  # Next.js App Router 路由
├── components/           # React 组件
├── services/             # 服务层 (业务逻辑)
├── types/                # TypeScript 类型定义
├── hooks/                # 自定义 React Hooks
├── lib/                  # 纯工具函数 (无业务语义、无外部依赖)
├── utils/                # 第三方 SDK 封装 (Supabase 等)
├── stores/               # 状态管理 (Zustand, 按需创建)
├── docs/                 # 项目文档
├── font/                 # 字体资源
├── public/               # 静态资源
├── proxy.ts              # Next.js 16 请求代理 (auth token 刷新)
├── AGENTS.md             # UI/UX 规则
└── .cursor/rules/        # Cursor AI 规则
```

#### 路由 — `app/`

遵循 Next.js 16 App Router 约定式路由：
- **必须**：路由级组件统一使用 `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`。
- **必须**：路由文件夹全小写，多单词使用中划线（例：`user-profile`），动态路由使用方括号（例：`[id]`）。

#### 组件 — `components/`

- **必须**：组件文件与所在目录使用 PascalCase（例：`Button.tsx`, `UserProfile/index.tsx`）。
- **必须**：每个组件应有专门的目录如果组件含有独立的样式、类型或测试文件。

#### 服务层 — `services/`

- **应该**：所有的外部 API 调用应封装在此目录，文件名使用 camelCase（例：`authService.ts`）。
- **必须**：返回值必须添加 TypeScript 类型定义。

#### 状态管理 — `stores/`

- **应该**：按需创建 Zustand store，使用切片（slice）模式管理复杂状态。

---

## 业务实现约定

### 数据库操作 (CRUD)
- **必须**：所有的直接数据层操作必须收拢在服务端（如 Server Actions）或通过专门的 BFF 层（如 `proxy.ts`）。

### 交互与体验规则 (UI/UX)
- **必须**：所有可点击元素必须有 `hover`、`active` 和 `focus` 状态的视觉反馈。
- **应该**：保持界面的核心主色调（参考品牌设计系统），限制使用过多的高饱和度色彩以维持极简体验。
- **永不**：不使用原生的繁琐弹窗（alert/confirm），一律使用全局 Toast 或自定义 Dialog 组件。
