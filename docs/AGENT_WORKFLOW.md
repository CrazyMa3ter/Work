# Agent 自动化开发工作流

## 概述

本文档定义了 AI Agent 可以自动化执行的开发步骤，每个步骤都是原子化、可验证的任务，Agent 可以按顺序或并行执行。

## 工作流架构

```
┌─────────────────────────────────────────────────────────────┐
│                    Agent 开发工作流                          │
├─────────────────────────────────────────────────────────────┤
│  Phase 1: 环境准备 (可并行)                                  │
│    ├── Task 1.1: 初始化项目依赖                              │
│    ├── Task 1.2: 配置开发环境                                │
│    └── Task 1.3: 验证环境                                    │
│                                                              │
│  Phase 2: 核心框架 (顺序依赖)                                │
│    ├── Task 2.1: 创建主进程入口                              │
│    ├── Task 2.2: 创建预加载脚本                              │
│    ├── Task 2.3: 创建渲染进程入口                            │
│    └── Task 2.4: 配置 IPC 通信                               │
│                                                              │
│  Phase 3: 灵动岛 UI (顺序依赖)                               │
│    ├── Task 3.1: 创建无边框窗口                              │
│    ├── Task 3.2: 实现展开/收起动画                           │
│    ├── Task 3.3: 实现模块导航                                │
│    └── Task 3.4: 集成系统托盘                                │
│                                                              │
│  Phase 4: 功能模块 (可并行)                                  │
│    ├── Task 4.1: 天气模块                                    │
│    ├── Task 4.2: 媒体控制模块                                │
│    ├── Task 4.3: IDE 状态模块                                │
│    └── Task 4.4: 审批模块                                    │
│                                                              │
│  Phase 5: 系统功能 (顺序依赖)                                │
│    ├── Task 5.1: 设置页面                                    │
│    ├── Task 5.2: 配置持久化                                  │
│    └── Task 5.3: 开机自启                                    │
│                                                              │
│  Phase 6: 构建与测试 (顺序依赖)                              │
│    ├── Task 6.1: 单元测试                                    │
│    ├── Task 6.2: E2E 测试                                    │
│    └── Task 6.3: 打包构建                                    │
└─────────────────────────────────────────────────────────────┘
```

## 原子任务定义

每个任务包含以下属性：
- **ID**: 唯一标识
- **Phase**: 所属阶段
- **Dependencies**: 依赖任务（Agent 需等待依赖完成）
- **Inputs**: 输入文件/配置
- **Outputs**: 输出文件/产物
- **Validation**: 验证方式
- **Rollback**: 回滚策略

---

## Phase 1: 环境准备

### Task 1.1: 初始化项目依赖

```yaml
id: init-dependencies
phase: 1
dependencies: []
inputs:
  - package.json 模板
  - tsconfig.json 模板
outputs:
  - node_modules/
  - package.json
  - package-lock.json
steps:
  1. 执行 npm init -y
  2. 安装核心依赖:
     - electron
     - react
     - react-dom
     - zustand
     - qweather-icons
  3. 安装开发依赖:
     - typescript
     - vite
     - @vitejs/plugin-react
     - vite-plugin-electron
     - vite-plugin-svgr
     - tailwindcss
     - postcss
     - autoprefixer
     - @types/react
     - @types/react-dom
     - @types/node
     - eslint
     - @typescript-eslint/parser
     - @typescript-eslint/eslint-plugin
     - eslint-plugin-react
     - eslint-plugin-react-hooks
     - prettier
     - vitest
     - @testing-library/react
validation:
  - node_modules 目录存在
  - 所有依赖包可正常导入
  - npm list 无错误
rollback:
  - 删除 node_modules 和 package-lock.json
  - 重新执行 npm install
```

### Task 1.2: 配置开发环境

```yaml
id: config-dev-env
phase: 1
dependencies: [init-dependencies]
inputs:
  - 项目规范文档
outputs:
  - tsconfig.json (主进程)
  - tsconfig.json (渲染进程)
  - tsconfig.json (共享代码)
  - vite.main.config.ts
  - vite.renderer.config.ts
  - tailwind.config.js
  - postcss.config.js
  - .eslintrc.js
  - .prettierrc
steps:
  1. 创建 TypeScript 配置文件
  2. 创建 Vite 构建配置
  3. 配置 Tailwind CSS
  4. 配置 ESLint + Prettier
  5. 创建 .gitignore
validation:
  - tsc --noEmit 无类型错误
  - vite build 命令可执行
  - eslint . 无致命错误
rollback:
  - 删除配置文件，重新生成
```

### Task 1.3: 验证环境

```yaml
id: verify-env
phase: 1
dependencies: [config-dev-env]
inputs: []
outputs:
  - 环境验证报告
steps:
  1. 检查 Node.js 版本 >= 18
  2. 检查 npm 版本 >= 9
  3. 验证所有依赖安装成功
  4. 验证 TypeScript 编译
  5. 验证 Vite 配置
validation:
  - 所有检查通过
rollback:
  - 根据错误日志修复对应配置
```

---

## Phase 2: 核心框架

### Task 2.1: 创建主进程入口

```yaml
id: create-main-process
phase: 2
dependencies: [verify-env]
inputs:
  - src/main/ 目录结构
outputs:
  - src/main/index.ts
  - src/main/windows/islandWindow.ts
  - src/main/windows/settingsWindow.ts
steps:
  1. 创建主进程入口文件
  2. 实现应用生命周期管理
  3. 创建灵动岛窗口管理器
  4. 创建设置窗口管理器
  5. 实现窗口间通信
validation:
  - npm run dev 可启动 Electron
  - 主进程无报错
  - 窗口可正常创建
rollback:
  - 回退到上一个可运行的提交
```

### Task 2.2: 创建预加载脚本

```yaml
id: create-preload
phase: 2
dependencies: [create-main-process]
inputs:
  - IPC 通道定义
outputs:
  - src/preload/index.ts
  - src/shared/constants/channels.ts
  - src/shared/types/electronAPI.d.ts
steps:
  1. 定义 IPC 通道常量
  2. 创建类型安全的 IPC 接口
  3. 实现预加载脚本
  4. 暴露安全的 API 到渲染进程
validation:
  - 渲染进程可访问 window.electronAPI
  - TypeScript 类型提示正常
  - 无安全警告
rollback:
  - 移除预加载脚本，重新实现
```

### Task 2.3: 创建渲染进程入口

```yaml
id: create-renderer
phase: 2
dependencies: [create-preload]
inputs:
  - src/renderer/ 目录结构
outputs:
  - src/renderer/index.html
  - src/renderer/main.tsx
  - src/renderer/App.tsx
  - src/renderer/styles/index.css
steps:
  1. 创建 HTML 入口
  2. 创建 React 根组件
  3. 配置全局样式
  4. 集成 Tailwind CSS
validation:
  - 渲染进程可正常加载
  - React 组件可渲染
  - 样式生效
rollback:
  - 回退到基础 HTML
```

### Task 2.4: 配置 IPC 通信

```yaml
id: config-ipc
phase: 2
dependencies: [create-renderer]
inputs:
  - 功能模块接口定义
outputs:
  - src/main/ipc/channels.ts
  - src/main/ipc/handlers/ 目录
steps:
  1. 定义所有 IPC 通道
  2. 创建处理器基类
  3. 实现各模块处理器
  4. 注册 IPC 处理器
validation:
  - 主从进程通信正常
  - 类型安全无错误
rollback:
  - 移除处理器，重新注册
```

---

## Phase 3: 灵动岛 UI

### Task 3.1: 创建无边框窗口

```yaml
id: create-frameless-window
phase: 3
dependencies: [config-ipc]
inputs:
  - 窗口配置参数
outputs:
  - 更新后的 islandWindow.ts
steps:
  1. 配置无边框窗口
  2. 设置窗口置顶
  3. 配置点击穿透
  4. 实现屏幕顶部中央定位
  5. 处理多显示器适配
validation:
  - 窗口显示在屏幕顶部中央
  - 无边框效果正常
  - 点击穿透生效
rollback:
  - 恢复默认窗口配置
```

### Task 3.2: 实现展开/收起动画

```yaml
id: implement-animation
phase: 3
dependencies: [create-frameless-window]
inputs:
  - 动画设计规范
outputs:
  - src/renderer/components/island/IslandContainer.tsx
  - src/renderer/components/island/island.module.css
steps:
  1. 创建灵动岛容器组件
  2. 实现 CSS 过渡动画
  3. 实现鼠标悬停检测
  4. 实现点击展开逻辑
  5. 实现移出/失焦收起逻辑
validation:
  - 动画流畅无卡顿
  - 交互响应及时
  - 状态切换正确
rollback:
  - 移除动画，使用简单显示/隐藏
```

### Task 3.3: 实现模块导航

```yaml
id: implement-navigation
phase: 3
dependencies: [implement-animation]
inputs:
  - 模块列表定义
outputs:
  - src/renderer/components/island/ModuleTabs.tsx
  - src/renderer/components/island/ModulePanel.tsx
steps:
  1. 创建模块标签组件
  2. 创建模块面板容器
  3. 实现标签切换逻辑
  4. 集成各模块占位组件
validation:
  - 标签可正常切换
  - 面板内容正确显示
  - 切换动画流畅
rollback:
  - 使用简单按钮替代标签
```

### Task 3.4: 集成系统托盘

```yaml
id: integrate-tray
phase: 3
dependencies: [implement-navigation]
inputs:
  - 托盘图标资源
outputs:
  - src/main/tray/trayManager.ts
steps:
  1. 创建托盘图标
  2. 实现右键菜单
  3. 实现显示/隐藏功能
  4. 实现退出功能
validation:
  - 托盘图标显示正常
  - 菜单功能可用
rollback:
  - 移除托盘功能
```

---

## Phase 4: 功能模块 (可并行)

### Task 4.1: 天气模块

```yaml
id: weather-module
phase: 4
dependencies: [implement-navigation]
inputs:
  - WeatherApi.md 配置
  - 和风天气图标库
outputs:
  - src/main/modules/weather/weatherService.ts
  - src/renderer/components/modules/weather/WeatherPanel.tsx
  - src/renderer/components/modules/weather/WeatherIcon.tsx
steps:
  1. 实现天气数据获取服务
  2. 实现数据缓存机制
  3. 创建天气面板组件
  4. 集成和风天气图标
  5. 实现自动刷新
validation:
  - 可获取天气数据
  - 图标正确显示
  - 刷新功能正常
rollback:
  - 使用模拟数据
```

### Task 4.2: 媒体控制模块

```yaml
id: media-module
phase: 4
dependencies: [implement-navigation]
inputs:
  - Windows Media Control API 文档
outputs:
  - src/main/modules/media/mediaController.ts
  - src/renderer/components/modules/media/MediaPanel.tsx
steps:
  1. 调研媒体控制方案
  2. 实现媒体信息获取
  3. 实现播放控制功能
  4. 创建媒体面板 UI
validation:
  - 可检测播放中的媒体
  - 控制按钮功能正常
rollback:
  - 使用模拟媒体信息
```

### Task 4.3: IDE 状态模块

```yaml
id: ide-module
phase: 4
dependencies: [implement-navigation]
inputs:
  - IDE 进程检测方案
outputs:
  - src/main/modules/ide/ideMonitor.ts
  - src/renderer/components/modules/ide/IdePanel.tsx
steps:
  1. 实现进程检测逻辑
  2. 实现窗口标题解析
  3. 实现编码时长统计
  4. 创建 IDE 面板 UI
validation:
  - 可检测 IDE 进程
  - 信息解析正确
rollback:
  - 使用模拟 IDE 状态
```

### Task 4.4: 审批模块

```yaml
id: approval-module
phase: 4
dependencies: [implement-navigation]
inputs:
  - 审批数据模型
outputs:
  - src/main/modules/approval/approvalService.ts
  - src/renderer/components/modules/approval/ApprovalPanel.tsx
steps:
  1. 定义审批数据模型
  2. 实现审批列表获取
  3. 实现同意/拒绝操作
  4. 创建审批面板 UI
validation:
  - 列表可正常显示
  - 操作可正常执行
rollback:
  - 使用模拟审批数据
```

---

## Phase 5: 系统功能

### Task 5.1: 设置页面

```yaml
id: settings-page
phase: 5
dependencies: [weather-module, media-module, ide-module, approval-module]
inputs:
  - 设置项定义
outputs:
  - src/renderer/components/settings/SettingsPanel.tsx
  - src/main/windows/settingsWindow.ts
steps:
  1. 创建设置窗口
  2. 实现设置表单
  3. 实现设置项保存
validation:
  - 设置项可正常修改
  - 修改后生效
rollback:
  - 使用默认配置
```

### Task 5.2: 配置持久化

```yaml
id: config-persistence
phase: 5
dependencies: [settings-page]
inputs:
  - electron-store 配置
outputs:
  - src/main/utils/store.ts
steps:
  1. 集成 electron-store
  2. 实现配置读写
  3. 实现默认值处理
validation:
  - 配置可持久化
  - 重启后配置不丢失
rollback:
  - 使用内存存储
```

### Task 5.3: 开机自启

```yaml
id: auto-start
phase: 5
dependencies: [config-persistence]
inputs:
  - Windows 启动项配置
outputs:
  - src/main/utils/autoLaunch.ts
steps:
  1. 实现开机自启设置
  2. 实现注册表操作
  3. 实现启动项管理
validation:
  - 设置可正常切换
  - 重启后生效
rollback:
  - 移除自启功能
```

---

## Phase 6: 构建与测试

### Task 6.1: 单元测试

```yaml
id: unit-tests
phase: 6
dependencies: [auto-start]
inputs:
  - 测试用例定义
outputs:
  - tests/unit/ 目录
steps:
  1. 配置 Vitest
  2. 编写服务层测试
  3. 编写组件测试
  4. 运行测试并修复问题
validation:
  - 测试通过率 > 80%
rollback:
  - 标记测试为待修复
```

### Task 6.2: E2E 测试

```yaml
id: e2e-tests
phase: 6
dependencies: [unit-tests]
inputs:
  - E2E 测试场景
outputs:
  - tests/e2e/ 目录
steps:
  1. 配置 Playwright
  2. 编写关键流程测试
  3. 运行 E2E 测试
validation:
  - 核心流程测试通过
rollback:
  - 标记测试为待修复
```

### Task 6.3: 打包构建

```yaml
id: build-package
phase: 6
dependencies: [e2e-tests]
inputs:
  - electron-builder 配置
outputs:
  - dist/ 目录
  - .exe 安装程序
steps:
  1. 配置 electron-builder
  2. 执行构建
  3. 验证安装程序
  4. 测试安装流程
validation:
  - 安装程序可正常生成
  - 安装后应用可正常运行
rollback:
  - 检查构建日志修复问题
```

---

## Agent 执行策略

### 并行执行规则

```
Phase 1: 所有任务可并行
  ├── Task 1.1
  ├── Task 1.2
  └── Task 1.3

Phase 2: 顺序执行
  Task 2.1 → Task 2.2 → Task 2.3 → Task 2.4

Phase 3: 顺序执行
  Task 3.1 → Task 3.2 → Task 3.3 → Task 3.4

Phase 4: 可并行
  ├── Task 4.1 (天气)
  ├── Task 4.2 (媒体)
  ├── Task 4.3 (IDE)
  └── Task 4.4 (审批)

Phase 5: 顺序执行
  Task 5.1 → Task 5.2 → Task 5.3

Phase 6: 顺序执行
  Task 6.1 → Task 6.2 → Task 6.3
```

### 跨 Phase 依赖

```
Phase 2 依赖 Phase 1 全部完成
Phase 3 依赖 Phase 2 全部完成
Phase 4 依赖 Phase 3 的 Task 3.3 完成
Phase 5 依赖 Phase 4 全部完成
Phase 6 依赖 Phase 5 全部完成
```

### 错误处理

1. **任务失败**: 记录错误日志，尝试回滚，通知用户
2. **验证失败**: 修复问题后重新验证
3. **依赖失败**: 等待依赖修复后再继续

### 状态追踪

每个任务执行后更新状态：
- `pending`: 等待执行
- `running`: 执行中
- `completed`: 已完成
- `failed`: 失败
- `rolled_back`: 已回滚
