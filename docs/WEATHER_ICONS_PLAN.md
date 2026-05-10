# 和风天气图标使用方案

## 图标库信息

- **仓库**: https://github.com/qwd/Icons.git
- **官网**: https://icons.qweather.com/
- **安装**: `npm i qweather-icons`
- **许可证**: MIT (代码) / CC BY 4.0 (图标)

## 图标结构

和风天气图标库提供两种风格：

| 风格 | 命名后缀 | 适用场景 |
|------|---------|---------|
| **线框版** | 无后缀 | 浅色背景、白天场景 |
| **填充版** | `-fill` | 深色背景、夜间场景 |

图标通过 `icon_code` 与和风天气 API 的 `icon` 字段直接对应，例如：
- API 返回 `icon: "100"` → 使用 `100.svg` (晴)
- API 返回 `icon: "101"` → 使用 `101.svg` (多云)

## 方案对比

### 方案一：npm 包引入（推荐）

**实现方式**：
```bash
npm install qweather-icons
```

```typescript
// 在组件中直接引用 SVG
import SunnyIcon from 'qweather-icons/icons/100.svg?react';

function WeatherIcon({ iconCode }: { iconCode: string }) {
  // 动态导入对应图标
  const IconComponent = require(`qweather-icons/icons/${iconCode}.svg?react`);
  return <IconComponent />;
}
```

**优点**：
- 版本可控，跟随官方更新
- 构建时自动处理 SVG
- 支持 Tree Shaking，只打包使用的图标
- 代码简洁，无需手动管理文件

**缺点**：
- 需要配置 Vite/SVG 加载器
- 部分未使用的图标也会被打包（可配置）

---

### 方案二：SVG 内联组件

**实现方式**：
```typescript
// src/renderer/components/common/WeatherIcon.tsx
import { ReactComponent as Sunny } from 'qweather-icons/icons/100.svg';
import { ReactComponent as Cloudy } from 'qweather-icons/icons/101.svg';
// ... 按需导入

const iconMap: Record<string, React.FC> = {
  '100': Sunny,
  '101': Cloudy,
  // ...
};

function WeatherIcon({ iconCode }: { iconCode: string }) {
  const Icon = iconMap[iconCode] || iconMap['999']; // 默认未知
  return <Icon className="weather-icon" />;
}
```

**优点**：
- SVG 直接嵌入 DOM，可 CSS 控制颜色
- 无额外网络请求
- 支持动画和交互

**缺点**：
- 需要手动维护 iconCode 映射
- 导入语句较多

---

### 方案三：SVG Sprite（雪碧图）

**实现方式**：
```bash
# 使用 svg-sprite-loader 或手动合并
# 将所有 SVG 合并为一个 sprite 文件
```

```typescript
// 使用 symbol 引用
function WeatherIcon({ iconCode }: { iconCode: string }) {
  return (
    <svg className="weather-icon">
      <use href={`/weather-sprite.svg#${iconCode}`} />
    </svg>
  );
}
```

**优点**：
- 单个 HTTP 请求加载所有图标
- 可缓存

**缺点**：
- 初始加载较大
- 配置复杂

---

### 方案四：动态加载 SVG 文件

**实现方式**：
```typescript
function WeatherIcon({ iconCode, isNight }: { iconCode: string; isNight?: boolean }) {
  const [svgContent, setSvgContent] = useState('');
  
  useEffect(() => {
    const suffix = isNight ? '-fill' : '';
    fetch(`/assets/icons/weather/${iconCode}${suffix}.svg`)
      .then(res => res.text())
      .then(setSvgContent);
  }, [iconCode, isNight]);

  return <div dangerouslySetInnerHTML={{ __html: svgContent }} />;
}
```

**优点**：
- 按需加载，首屏快
- 灵活控制

**缺点**：
- 需要运行时请求
- 需要处理 CORS

## 推荐方案

**主推荐：方案一（npm 包 + Vite SVG 插件）**

理由：
1. 和风天气图标库本身提供 npm 包，官方维护
2. Electron + Vite 环境下配置简单
3. 支持 `?react` 或 `?component` 后缀将 SVG 转为 React 组件
4. 构建时优化，生产环境体积小

**配置步骤**：

```bash
npm install qweather-icons
npm install -D vite-plugin-svgr
```

```typescript
// vite.renderer.config.ts
import svgr from 'vite-plugin-svgr';

export default {
  plugins: [
    svgr({
      include: '**/*.svg',
    }),
  ],
};
```

```typescript
// 使用方式
import { ReactComponent as SunnyIcon } from 'qweather-icons/icons/100.svg';

// 或动态导入
const loadIcon = async (code: string) => {
  const module = await import(`qweather-icons/icons/${code}.svg?react`);
  return module.default;
};
```

## 图标映射表（常用）

| iconCode | 名称 | 描述 |
|----------|------|------|
| 100 | sunny | 晴 |
| 101 | cloudy | 多云 |
| 102 | few-clouds | 少云 |
| 103 | partly-cloudy | 晴间多云 |
| 104 | overcast | 阴 |
| 150 | clear-night | 晴（夜间） |
| 300 | shower-rain | 阵雨 |
| 301 | heavy-shower-rain | 强阵雨 |
| 302 | thundershower | 雷阵雨 |
| 305 | light-rain | 小雨 |
| 306 | moderate-rain | 中雨 |
| 307 | heavy-rain | 大雨 |
| 310 | storm | 暴雨 |
| 400 | light-snow | 小雪 |
| 401 | moderate-snow | 中雪 |
| 402 | heavy-snow | 大雪 |
| 403 | snowstorm | 暴雪 |
| 500 | mist | 薄雾 |
| 501 | foggy | 雾 |
| 502 | haze | 霾 |
| 999 | unknown | 未知 |

## 实现建议

1. **创建图标映射工具**：将 API 返回的 `icon` 字段映射到组件
2. **支持日夜间切换**：根据时间自动选择普通版或 `-fill` 版
3. **兜底处理**：API 返回未知 code 时显示默认图标
4. **颜色控制**：通过 CSS `currentColor` 或 `fill` 控制图标颜色

## 代码示例

```typescript
// src/renderer/components/common/QWeatherIcon.tsx
import React, { lazy, Suspense } from 'react';

interface QWeatherIconProps {
  iconCode: string;
  isNight?: boolean;
  className?: string;
}

// 动态加载图标组件
const loadIconComponent = (code: string, isNight: boolean) => {
  const suffix = isNight ? '-fill' : '';
  const fullCode = `${code}${suffix}`;
  
  // 兜底：如果 fill 版本不存在，使用普通版
  try {
    return lazy(() => import(`qweather-icons/icons/${fullCode}.svg?react`));
  } catch {
    return lazy(() => import(`qweather-icons/icons/${code}.svg?react`));
  }
};

function QWeatherIcon({ iconCode, isNight = false, className }: QWeatherIconProps) {
  const IconComponent = loadIconComponent(iconCode, isNight);
  
  return (
    <Suspense fallback={<div className="icon-placeholder" />}>
      <IconComponent className={className} />
    </Suspense>
  );
}

export default React.memo(QWeatherIcon);
```
