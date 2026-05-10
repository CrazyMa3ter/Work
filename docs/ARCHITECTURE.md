# Dynamic Island Desktop - 项目架构文档

## 1. 项目概述

Dynamic Island Desktop 是一款基于 Electron + React + TypeScript 的 Windows 桌面灵动岛应用，采用主从进程分离架构，实现高性能、可扩展的多功能信息聚合平台。

## 2. 技术栈

| 层级 | 技术选型 | 说明 |
|------|---------|------|
| 桌面框架 | Electron | 跨平台桌面应用壳 |
| 前端框架 | React 18 | UI 组件化开发 |
| 构建工具 | Vite | 极速开发与构建 |
| 类型系统 | TypeScript | 全链路类型安全 |
| 状态管理 | Zustand | 轻量级全局状态 |
| 样式方案 | Tailwind CSS + CSS Modules | 原子化 + 模块化样式 |
| 进程通信 | Electron IPC | 主从进程安全通信 |
| 打包分发 | electron-builder | Windows 安装包生成 |

## 3. 目录结构

```
dynamic-island-desktop/
├── src/
│   ├── main/                    # 主进程 (Node.js 环境)
│   │   ├── windows/             # 窗口管理
│   │   │   ├── islandWindow.ts  # 灵动岛主窗口
│   │   │   └── settingsWindow.ts# 设置窗口
│   │   ├── tray/                # 系统托盘
│   │   │   └── trayManager.ts   # 托盘图标与菜单管理
│   │   ├── ipc/                 # IPC 通信处理
│   │   │   ├── handlers/        # IPC 处理器
│   │   │   └── channels.ts      # IPC 通道定义
│   │   └── modules/             # 主进程功能模块
│   │       ├── weather/         # 天气服务
│   │       ├── media/           # 媒体控制
│   │       ├── ide/             # IDE 状态收集
│   │       └── approval/        # 审批服务
│   ├── renderer/                # 渲染进程 (浏览器环境)
│   │   ├── components/          # React 组件
│   │   │   ├── island/          # 灵动岛核心组件
│   │   │   ├── modules/         # 功能模块组件
│   │   │   │   ├── weather/     # 天气模块 UI
│   │   │   │   ├── media/       # 媒体模块 UI
│   │   │   │   ├── ide/         # IDE 模块 UI
│   │   │   │   └── approval/    # 审批模块 UI
│   │   │   └── common/          # 通用组件
│   │   ├── hooks/               # 自定义 React Hooks
│   │   ├── stores/              # Zustand 状态仓库
│   │   ├── styles/              # 全局样式与主题
│   │   └── utils/               # 渲染进程工具函数
│   ├── preload/                 # 预加载脚本 (桥梁层)
│   │   └── index.ts             # 暴露安全 API 到渲染进程
│   └── shared/                  # 共享代码 (主/渲染进程共用)
│       ├── types/               # 全局类型定义
│       ├── constants/           # 常量定义
│       └── utils/               # 共享工具函数
├── assets/                      # 静态资源
│   ├── icons/                   # 图标资源
│   │   ├── status/              # 状态指示图标
│   │   ├── modules/             # 模块入口图标
│   │   ├── weather/             # 天气图标
│   │   ├── media/               # 媒体控制图标
│   │   ├── ide/                 # IDE 状态图标
│   │   ├── approval/            # 审批操作图标
│   │   └── tray/                # 系统托盘图标
│   ├── fonts/                   # 字体文件
│   ├── images/                  # 图片资源
│   └── sounds/                  # 音效资源
├── docs/                        # 项目文档
├── scripts/                     # 构建与工具脚本
├── build/                       # 构建输出
├── tests/                       # 测试代码
│   ├── unit/                    # 单元测试
│   └── e2e/                     # 端到端测试
└── .github/workflows/           # CI/CD 工作流
```

## 4. 架构分层

### 4.1 主进程层 (Main Process)

负责系统级操作、窗口管理、原生 API 调用。

```
┌─────────────────────────────────────────┐
│           Main Process                  │
│  ┌─────────┐ ┌─────────┐ ┌──────────┐  │
│  │ Window  │ │  Tray   │ │  IPC     │  │
│  │ Manager │ │ Manager │ │ Handlers │  │
│  └────┬────┘ └────┬────┘ └────┬─────┘  │
│       └────────────┴───────────┘        │
│                   │                     │
│  ┌────────────────┼────────────────┐   │
│  │      Native Modules            │   │
│  │  ┌────────┐ ┌────────┐        │   │
│  │  │Windows │ │ System │        │   │
│  │  │ Media  │ │ Process│        │   │
│  │  │ Control│ │ Monitor│        │   │
│  │  └────────┘ └────────┘        │   │
│  └────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### 4.2 渲染进程层 (Renderer Process)

负责 UI 渲染、用户交互、状态管理。

```
┌─────────────────────────────────────────┐
│         Renderer Process                │
│  ┌─────────────────────────────────┐   │
│  │        Island Container         │   │
│  │  ┌─────┐ ┌─────┐ ┌─────┐      │   │
│  │  │Weather│ │Media│ │ IDE │      │   │
│  │  │ Panel │ │Panel│ │Panel│      │   │
│  │  └─────┘ └─────┘ └─────┘      │   │
│  └─────────────────────────────────┘   │
│         │                               │
│  ┌──────┴──────┐ ┌──────────┐         │
│  │  Zustand    │ │  Custom  │         │
│  │   Stores    │ │  Hooks   │         │
│  └─────────────┘ └──────────┘         │
└─────────────────────────────────────────┘
```

### 4.3 通信层 (IPC Bridge)

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Main      │◄────►│   Preload   │◄────►│  Renderer   │
│  Process    │  IPC │   Script    │ API  │  Process    │
└─────────────┘      └─────────────┘      └─────────────┘
```

## 5. 模块架构

### 5.1 天气模块

```
weather/
├── weatherService.ts      # 主进程：API 调用与数据缓存
├── weatherTypes.ts        # 共享：类型定义
└── WeatherPanel.tsx       # 渲染进程：UI 组件
```

### 5.2 媒体控制模块

```
media/
├── mediaController.ts     # 主进程：Windows Media Control
├── mediaTypes.ts          # 共享：类型定义
└── MediaPanel.tsx         # 渲染进程：UI 组件
```

### 5.3 IDE 状态模块

```
ide/
├── ideMonitor.ts          # 主进程：进程监控与数据采集
├── ideTypes.ts            # 共享：类型定义
└── IdePanel.tsx           # 渲染进程：UI 组件
```

### 5.4 审批模块

```
approval/
├── approvalService.ts     # 主进程：审批 API 对接
├── approvalTypes.ts       # 共享：类型定义
└── ApprovalPanel.tsx      # 渲染进程：UI 组件
```

## 6. 数据流

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  External   │     │    Main     │     │  Renderer   │
│    APIs     │────►│   Process   │◄───►│  Process    │
│  / System   │     │  (Services) │ IPC │   (UI)      │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                    ┌──────┴──────┐
                    │  electron-  │
                    │    store    │
                    │ (Persist)   │
                    └─────────────┘
```

## 7. 扩展性设计

- **模块注册机制**：新模块只需在 `modules/` 下创建文件夹，实现标准接口即可自动注册
- **IPC 自动发现**：`ipc/channels.ts` 集中管理通道，支持类型安全的自动补全
- **主题系统**：CSS 变量 + Tailwind 配置，支持明暗主题切换
- **插件预留**：预加载脚本暴露标准 API，后期可扩展插件系统
