# 1037Solo-Docs

> **1037SOLO 官方文档站** — 你的高校生活 AI 领航员

本仓库是 [1037SOLO](https://1037solo.com) 平台的**配套文档前端项目**，使用 React + Vite + TypeScript 构建，提供产品使用指南、更新日志、常见问题等内容的在线阅读体验。

---

## ✨ 功能概览

| 页面       | 路由              | 说明                             |
| ---------- | ----------------- | -------------------------------- |
| 首页       | `/`               | 项目入口，导航至文档             |
| 常见问题   | `/docs/faq`       | 解答使用场景中的高频问题         |
| 项目攻略   | `/docs/guide`     | 详细功能使用教程                 |
| 核心功能   | `/docs/features`  | 平台核心能力一览                 |
| 更新日志   | `/docs/changelog` | 版本历史与迭代记录               |
| 重要公告   | `/docs/announcements` | 平台公告与维护通知           |
| 反馈途径   | `/docs/feedback`  | Bug 反馈与功能建议提交渠道       |

---

## 🛠 技术栈

- **框架**：[React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **构建工具**：[Vite 5](https://vitejs.dev/)
- **路由**：[React Router v6](https://reactrouter.com/)
- **样式**：[Tailwind CSS v3](https://tailwindcss.com/) + [@tailwindcss/typography](https://tailwindcss.com/docs/typography-plugin)
- **动画**：[Framer Motion](https://www.framer.com/motion/)
- **Markdown 渲染**：[react-markdown](https://github.com/remarkjs/react-markdown) + remark-gfm + rehype-katex（支持数学公式）
- **图标**：[Lucide React](https://lucide.dev/)

---

## 📁 项目结构

```
1037docs/
├── src/
│   ├── App.tsx              # 路由配置入口
│   ├── main.tsx             # React 挂载点
│   ├── index.css            # 全局样式
│   ├── pages/
│   │   ├── Home.tsx         # 首页
│   │   └── DocPage.tsx      # 文档内容页（动态渲染 Markdown）
│   ├── components/
│   │   ├── layout/          # 文档布局与侧边导航
│   │   ├── markdown/        # Markdown 渲染组件
│   │   ├── ui/              # 通用 UI 组件
│   │   ├── mode-toggle.tsx  # 明暗主题切换
│   │   └── theme-provider.tsx
│   ├── content/             # 文档内容（Markdown 文件）
│   │   ├── faq.md
│   │   ├── guide.md
│   │   ├── features.md
│   │   ├── changelog.md
│   │   ├── announcements.md
│   │   └── feedback.md
│   ├── config/
│   │   └── nav.ts           # 侧边栏导航配置
│   └── lib/                 # 工具函数
├── docs/                    # 静态资源文档（PDF 等）
├── dist/                    # 构建产物（部署使用）
├── nginx.conf.example       # Nginx 部署参考配置
├── vite.config.ts
├── tailwind.config.js
└── package.json
```

---

## 🚀 本地开发

### 前置要求

- Node.js `>= 18.x`
- npm `>= 9.x`

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

浏览器访问 [http://localhost:5173](http://localhost:5173) 即可预览。

### 构建生产版本

```bash
npm run build
```

构建产物输出至 `dist/` 目录。

### 预览构建结果

```bash
npm run preview
```

---

## 📦 部署

本项目为纯静态 SPA（Single Page Application），可部署至任意支持静态文件托管的平台。

### Nginx 部署

参考 `nginx.conf.example` 配置文件，关键点是配置 SPA 路由重写：

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

> **注意**：`vite.config.ts` 中已将 `base` 设置为 `'./'`，适用于非根路径部署场景。

---

## ✏️ 内容维护

所有文档内容集中在 `src/content/` 目录下，均为标准 **Markdown** 格式，可直接编辑：

- 支持 **GFM**（表格、任务列表、代码块等）
- 支持 **LaTeX 数学公式**（行内 `$...$`，块级 `$$...$$`）

新增文档页步骤：

1. 在 `src/content/` 下新建 `<slug>.md` 文件并撰写内容。
2. 在 `src/config/nav.ts` 中添加对应的导航条目。
3. 路由会通过 `/docs/:slug` 自动匹配，无需额外配置。

---

## ⚠️ 免责声明

本项目由 **1037Solo 团队**（武汉市洪山区知汇淘沙信息系统集成服务工作室）独立开发与运营，**并非华中科技大学（HUST）官方项目**。平台内聚合的校内资源仅为方便同学使用的快捷导航，所有数据均跳转至学校官方网站，我们不存储任何用户的校内账号信息。

---

© 2026 1037Solo Team. Designed with ❤️.