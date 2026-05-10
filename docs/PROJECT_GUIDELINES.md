# Dynamic Island Desktop - 项目规范文档

## 1. 项目命名规范

### 1.1 文件命名

| 类型 | 规范 | 示例 |
|------|------|------|
| 组件文件 | PascalCase.tsx | `WeatherPanel.tsx`, `IslandContainer.tsx` |
| 工具/服务文件 | camelCase.ts | `weatherService.ts`, `trayManager.ts` |
| 类型定义文件 | camelCase.types.ts | `weatherTypes.ts`, `mediaTypes.ts` |
| 常量文件 | UPPER_SNAKE_CASE 或 camelCase | `channels.ts`, `appConstants.ts` |
| 样式文件 | kebab-case.module.css | `island-container.module.css` |
| 测试文件 | `*.test.ts` 或 `*.spec.ts` | `weatherService.test.ts` |
| 目录名 | kebab-case | `island-desktop`, `weather-panel` |

### 1.2 变量与函数命名

```typescript
// 常量: UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;
const IPC_CHANNEL_WEATHER = 'weather:get';

// 类: PascalCase
class WeatherService {}
class IslandWindow {}

// 接口/类型: PascalCase + 语义后缀
interface WeatherData {}
type MediaStatus = 'playing' | 'paused';

// 函数: camelCase + 动词开头
function fetchWeatherData() {}
function handleMediaPlay() {}

// 布尔值: is/has/should 前缀
const isExpanded = false;
const hasNotification = true;
const shouldAutoRefresh = true;

// 数组: 复数形式
const weatherIcons: string[] = [];
const pendingApprovals: ApprovalItem[] = [];
```

## 2. 目录组织规范

### 2.1 模块内部结构

每个功能模块应遵循统一结构：

```
modules/weather/
├── index.ts              # 模块入口，统一导出
├── weatherService.ts     # 主进程服务
├── weatherTypes.ts       # 共享类型
├── weatherConstants.ts   # 模块常量
└── __tests__/
    └── weatherService.test.ts
```

### 2.2 组件内部结构

```
components/modules/weather/
├── index.ts              # 统一导出
├── WeatherPanel.tsx      # 主组件
├── WeatherPanel.module.css # 样式
├── WeatherIcon.tsx       # 子组件
└── __tests__/
    └── WeatherPanel.test.tsx
```

## 3. 代码组织原则

### 3.1 导入顺序

```typescript
// 1. 第三方库
import React from 'react';
import { useState } from 'react';

// 2. 项目内部共享模块
import { WeatherData } from '@shared/types/weatherTypes';
import { IPC_CHANNELS } from '@shared/constants/channels';

// 3. 同级/子级模块
import { WeatherIcon } from './WeatherIcon';
import styles from './WeatherPanel.module.css';

// 4. 类型导入单独分组 (可选)
import type { SomeType } from 'some-lib';
```

### 3.2 文件长度限制

- 单个文件不超过 **300 行**
- 单个函数不超过 **50 行**
- 单个组件不超过 **200 行** (超出则拆分)

### 3.3 注释规范

```typescript
/**
 * 获取指定城市的天气数据
 * @param city - 城市名称或坐标
 * @param options - 可选配置
 * @returns 天气数据对象
 * @throws 当 API 请求失败时抛出错误
 */
async function fetchWeatherData(
  city: string,
  options?: WeatherOptions
): Promise<WeatherData> {
  // 实现...
}

// TODO: 后续需要添加缓存机制
// FIXME: 当前实现不支持多城市同时查询
// NOTE: 此 API 有每日请求次数限制
```

## 4. Git 工作流规范

### 4.1 分支策略

```
main        # 生产分支，仅接受合并请求
  │
  ├── develop   # 开发分支，功能集成
  │   │
  │   ├── feature/weather-module    # 功能分支
  │   ├── feature/media-control
  │   └── bugfix/tray-icon-missing  # 修复分支
  │
  └── hotfix/critical-bug           # 热修复分支
```

### 4.2 提交信息规范

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type 类型：**

| 类型 | 说明 |
|------|------|
| `feat` | 新功能 |
| `fix` | 修复 |
| `docs` | 文档更新 |
| `style` | 代码格式调整 |
| `refactor` | 重构 |
| `perf` | 性能优化 |
| `test` | 测试相关 |
| `chore` | 构建/工具链 |

**示例：**

```
feat(weather): 添加天气自动刷新功能

- 实现每 30 分钟自动刷新机制
- 添加手动刷新按钮
- 缓存天气数据到本地存储

Closes #123
```

## 5. 错误处理规范

### 5.1 主进程错误

```typescript
// 使用 try-catch + 日志记录
try {
  const data = await weatherAPI.fetch(city);
  return data;
} catch (error) {
  logger.error('Failed to fetch weather data', { city, error });
  // 返回降级数据或抛出业务错误
  throw new WeatherFetchError('无法获取天气数据，请检查网络连接');
}
```

### 5.2 渲染进程错误

```typescript
// 使用 Error Boundary + 用户提示
function WeatherPanel() {
  const [error, setError] = useState<Error | null>(null);

  if (error) {
    return <ErrorFallback error={error} onRetry={handleRetry} />;
  }

  // ...
}
```

## 6. 性能规范

### 6.1 渲染优化

- 使用 `React.memo` 包裹纯展示组件
- 使用 `useMemo` / `useCallback` 避免不必要的重计算
- 列表渲染必须使用 `key` 属性
- 避免在 `render` 中创建新对象/函数

### 6.2 主进程优化

- IPC 通信批量处理，减少调用次数
- 定时器使用后必须清理
- 大数据传输使用文件或流，避免内存占用

## 7. 安全规范

- **禁止**在渲染进程直接调用 Node.js API
- **禁止**在 preload 脚本中暴露敏感接口
- **必须**对 IPC 参数进行校验
- **必须**对本地存储数据进行加密（敏感配置）

## 8. 图标资源规范

### 8.1 目录结构

```
assets/icons/
├── status/           # 灵动岛状态指示图标
│   ├── online.svg
│   ├── offline.svg
│   ├── busy.svg
│   └── notification.svg
├── modules/          # 模块入口图标
│   ├── weather.svg
│   ├── media.svg
│   ├── ide.svg
│   └── approval.svg
├── weather/          # 天气状况图标
│   ├── sunny.svg
│   ├── cloudy.svg
│   ├── rainy.svg
│   └── snowy.svg
├── media/            # 媒体控制图标
│   ├── play.svg
│   ├── pause.svg
│   ├── next.svg
│   └── volume.svg
├── ide/              # IDE 状态图标
│   ├── vscode.svg
│   ├── intellij.svg
│   └── coding.svg
├── approval/         # 审批操作图标
│   ├── approve.svg
│   ├── reject.svg
│   └── pending.svg
└── tray/             # 系统托盘图标
    ├── tray-icon.png
    └── tray-icon-dark.png
```

### 8.2 图标规范

| 属性 | 规范 |
|------|------|
| 格式 | SVG (优先), PNG (托盘图标) |
| 尺寸 | 24x24px (UI), 16x16px (托盘) |
| 颜色 | 支持 currentColor 以便主题切换 |
| 命名 | kebab-case，语义化 |

### 8.3 代码中引用

```typescript
// 使用统一的路径常量
import { ICON_PATHS } from '@shared/constants/paths';

// 动态加载
const iconPath = `${ICON_PATHS.weather}/${weatherType}.svg`;
```
