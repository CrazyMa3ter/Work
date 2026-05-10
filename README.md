# Dynamic Island Desktop

一款 Windows 桌面灵动岛应用，提供天气查看、媒体控制、IDE 工作状态监控、快速审批等多功能集合，常驻屏幕顶部，轻量快捷。

## 功能特性

- 灵动岛 UI — 常驻屏幕顶部中央，悬停/点击展开，移出收起
- 天气查看 — 实时天气信息展示，支持自动刷新
- 媒体控制 — 系统媒体播放控制（播放/暂停/切歌/音量）
- IDE 状态 — 监控 VS Code、JetBrains 等 IDE 工作状态与编码时长
- 快速审批 — 待审批事项列表，一键同意/拒绝
- 系统托盘 — 右键菜单支持显示/隐藏/设置/退出
- 开机自启 — 可配置随 Windows 启动

## 技术栈

| 技术 | 用途 |
|------|------|
| Electron | 桌面应用框架 |
| React 18 | UI 渲染 |
| TypeScript | 类型安全 |
| Vite | 构建工具 |
| Zustand | 状态管理 |
| Tailwind CSS | 原子化样式 |
| electron-builder | 应用打包 |

## 项目结构

```
dynamic-island-desktop/
├── src/
│   ├── main/           # 主进程（窗口、托盘、IPC、原生模块）
│   ├── renderer/       # 渲染进程（React 组件、Hooks、状态）
│   ├── preload/        # 预加载脚本（IPC 桥梁）
│   └── shared/         # 共享代码（类型、常量、工具）
├── assets/             # 静态资源（图标、字体、图片、音效）
├── docs/               # 项目文档
├── tests/              # 测试代码
└── scripts/            # 构建脚本
```

## 开发文档

- [架构文档](docs/ARCHITECTURE.md) — 技术架构与模块设计
- [开发规划](docs/DEVELOPMENT_PLAN.md) — 里程碑与任务排期
- [项目规范](docs/PROJECT_GUIDELINES.md) — 命名、Git、错误处理等规范
- [代码规范](docs/CODE_STYLE.md) — TypeScript、React、样式、IPC 规范
- [图标指南](assets/icons/ICON_GUIDE.md) — 图标资源目录与命名规范

## 快速开始

### 环境要求

- Node.js >= 18
- Windows 10/11

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建打包

```bash
npm run build
npm run dist
```

## 图标资源

图标资源存放于 `assets/icons/` 目录，按功能分类：

- `status/` — 灵动岛状态指示图标
- `modules/` — 模块入口图标
- `weather/` — 天气状况图标
- `media/` — 媒体控制图标
- `ide/` — IDE 状态图标
- `approval/` — 审批操作图标
- `tray/` — 系统托盘图标

详见 [ICON_GUIDE.md](assets/icons/ICON_GUIDE.md)。

## 贡献指南

1. Fork 本仓库
2. 创建功能分支：`git checkout -b feature/your-feature`
3. 提交更改：`git commit -m "feat(scope): description"`
4. 推送分支：`git push origin feature/your-feature`
5. 提交 Pull Request

## 许可证

MIT
