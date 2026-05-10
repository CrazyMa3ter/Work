# Icon 资源指南

## 目录结构

```
assets/icons/
├── status/           # 灵动岛状态指示图标
│   ├── online.svg    # 在线状态
│   ├── offline.svg   # 离线状态
│   ├── busy.svg      # 忙碌状态
│   └── notification.svg  # 新通知状态
├── modules/          # 模块入口图标（灵动岛收缩态展示）
│   ├── weather.svg   # 天气模块入口
│   ├── media.svg     # 媒体模块入口
│   ├── ide.svg       # IDE 模块入口
│   └── approval.svg  # 审批模块入口
├── weather/          # 天气状况图标（和风天气图标库）
│   ├── 100.svg       # 晴
│   ├── 101.svg       # 多云
│   ├── 102.svg       # 少云
│   ├── 103.svg       # 晴间多云
│   ├── 104.svg       # 阴
│   ├── 150.svg       # 晴（夜间）
│   ├── 300.svg       # 阵雨
│   ├── 301.svg       # 强阵雨
│   ├── 302.svg       # 雷阵雨
│   ├── 305.svg       # 小雨
│   ├── 306.svg       # 中雨
│   ├── 307.svg       # 大雨
│   ├── 310.svg       # 暴雨
│   ├── 400.svg       # 小雪
│   ├── 401.svg       # 中雪
│   ├── 402.svg       # 大雪
│   ├── 403.svg       # 暴雪
│   ├── 500.svg       # 薄雾
│   ├── 501.svg       # 雾
│   ├── 502.svg       # 霾
│   └── 999.svg       # 未知
├── media/            # 媒体控制图标
│   ├── play.svg      # 播放
│   ├── pause.svg     # 暂停
│   ├── next.svg      # 下一首
│   ├── previous.svg  # 上一首
│   ├── volume-high.svg   # 音量高
│   ├── volume-low.svg    # 音量低
│   ├── volume-mute.svg   # 静音
│   └── playlist.svg      # 播放列表
├── ide/              # IDE 状态图标
│   ├── vscode.svg        # VS Code
│   ├── intellij.svg      # IntelliJ IDEA
│   ├── webstorm.svg      # WebStorm
│   ├── pycharm.svg       # PyCharm
│   ├── coding.svg        # 编码中
│   └── idle.svg          # 空闲
├── approval/         # 审批操作图标
│   ├── approve.svg       # 同意
│   ├── reject.svg        # 拒绝
│   ├── pending.svg       # 待审批
│   ├── approved.svg      # 已同意
│   └── rejected.svg      # 已拒绝
└── tray/             # 系统托盘图标
    ├── tray-icon.png     # 托盘图标 (16x16)
    └── tray-icon-dark.png # 深色模式托盘图标 (16x16)
```

## 图标规范

| 属性 | 规范 |
|------|------|
| **格式** | SVG (优先，支持缩放与主题色), PNG (仅限托盘图标) |
| **尺寸** | 24x24px (UI 图标), 16x16px (托盘图标) |
| **颜色** | SVG 使用 `currentColor` 填充，支持通过 CSS 变量切换主题色 |
| **命名** | kebab-case，语义化英文命名 |
| **ViewBox** | SVG 必须设置 `viewBox="0 0 24 24"` |

## 天气图标说明

天气图标使用和风天气开源图标库（https://github.com/qwd/Icons），通过 npm 包引入：

```bash
npm install qweather-icons
```

图标命名与和风天气 API 的 `icon` 字段直接对应：
- API 返回 `icon: "100"` → 使用 `100.svg`
- API 返回 `icon: "101"` → 使用 `101.svg`

支持两种风格：
- **线框版**：无后缀（如 `100.svg`），适用于浅色背景
- **填充版**：`-fill` 后缀（如 `100-fill.svg`），适用于深色背景/夜间

## 代码中引用方式

### 自定义图标（本地 assets）

```typescript
// 使用统一的路径常量
import { ICON_PATHS } from '@shared/constants/paths';

// 状态图标
const statusIcon = `${ICON_PATHS.status}/online.svg`;

// 模块图标
const moduleIcon = `${ICON_PATHS.modules}/weather.svg`;

// 媒体控制图标
const playIcon = `${ICON_PATHS.media}/play.svg`;

// IDE 图标
const ideIcon = `${ICON_PATHS.ide}/vscode.svg`;

// 审批图标
const approveIcon = `${ICON_PATHS.approval}/approve.svg`;

// 托盘图标（主进程）
const trayIconPath = path.join(__dirname, ICON_PATHS.tray, 'tray-icon.png');
```

### 和风天气图标（npm 包）

```typescript
// 方式一：静态导入
import { ReactComponent as SunnyIcon } from 'qweather-icons/icons/100.svg';

// 方式二：动态导入（推荐）
const loadWeatherIcon = async (iconCode: string, isNight = false) => {
  const suffix = isNight ? '-fill' : '';
  const module = await import(`qweather-icons/icons/${iconCode}${suffix}.svg?react`);
  return module.default;
};

// 使用
const WeatherIcon = await loadWeatherIcon('100', false);
```

## 占位文件说明

当前目录下的 `.gitkeep` 文件用于保持空目录在 Git 中的追踪。实际图标资源请按上述规范补充。

天气图标无需手动放置到 `assets/icons/weather/`，通过 npm 包 `qweather-icons` 引入即可。
