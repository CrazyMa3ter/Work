# Dynamic Island Desktop - 代码规范文档

## 1. TypeScript 规范

### 1.1 类型定义

```typescript
// 优先使用 interface 定义对象类型
interface UserConfig {
  city: string;
  autoStart: boolean;
  refreshInterval: number;
}

// 联合类型使用 type
type Theme = 'light' | 'dark' | 'system';
type IslandState = 'collapsed' | 'expanded' | 'transitioning';

// 函数返回值必须显式声明
function calculateDuration(start: number, end: number): number {
  return end - start;
}

// 避免使用 any，使用 unknown + 类型守卫
function processData(data: unknown): string {
  if (typeof data === 'string') {
    return data.toUpperCase();
  }
  return '';
}

// 泛型命名
function createCache<TKey, TValue>(): Map<TKey, TValue> {
  return new Map<TKey, TValue>();
}
```

### 1.2 严格模式要求

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

## 2. React 组件规范

### 2.1 函数组件

```typescript
// 使用函数声明而非箭头函数（性能与可读性）
interface WeatherPanelProps {
  data: WeatherData;
  onRefresh: () => void;
}

function WeatherPanel({ data, onRefresh }: WeatherPanelProps): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsLoading(true);
    await onRefresh();
    setIsLoading(false);
  }, [onRefresh]);

  return (
    <div className={styles.container}>
      <WeatherIcon type={data.condition} />
      <span className={styles.temperature}>{data.temperature}°C</span>
      <button onClick={handleRefresh} disabled={isLoading}>
        刷新
      </button>
    </div>
  );
}

// 纯展示组件使用 React.memo
const WeatherIcon = React.memo(function WeatherIcon({ type }: { type: string }) {
  return <img src={`/icons/weather/${type}.svg`} alt={type} />;
});
```

### 2.2 Hooks 使用规范

```typescript
// Hooks 必须在组件顶层调用
function useWeatherData(city: string) {
  const [data, setData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // useEffect 依赖项必须完整
  useEffect(() => {
    let cancelled = false;

    async function fetch() {
      try {
        const result = await window.electronAPI.weather.get(city);
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err as Error);
        }
      }
    }

    fetch();

    // 清理函数
    return () => {
      cancelled = true;
    };
  }, [city]);

  return { data, error };
}

// 自定义 Hook 命名必须以 use 开头
function useMediaStatus() {
  const [status, setStatus] = useState<MediaStatus>('stopped');
  // ...
  return status;
}
```

### 2.3 条件渲染

```typescript
// 使用三元表达式处理简单条件
function StatusBadge({ isOnline }: { isOnline: boolean }) {
  return (
    <span className={isOnline ? styles.online : styles.offline}>
      {isOnline ? '在线' : '离线'}
    </span>
  );
}

// 复杂条件提前返回
function MediaPanel() {
  const { data, isLoading, error } = useMediaData();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  if (!data) {
    return <EmptyState message="暂无播放中的媒体" />;
  }

  return (
    <div className={styles.panel}>
      {/* 正常渲染 */}
    </div>
  );
}
```

## 3. 样式规范

### 3.1 Tailwind CSS 使用

```tsx
// 基础类名 + 条件类名
function IslandContainer({ isExpanded }: { isExpanded: boolean }) {
  return (
    <div
      className={`
        fixed top-0 left-1/2 -translate-x-1/2
        bg-black/80 backdrop-blur-xl
        rounded-full transition-all duration-300
        ${isExpanded ? 'w-96 h-64 rounded-3xl' : 'w-32 h-10'}
      `}
    >
      {children}
    </div>
  );
}

// 复杂样式使用 cn() 工具函数（clsx + tailwind-merge）
import { cn } from '@shared/utils/cn';

function Button({ variant, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded-lg font-medium transition-colors',
        variant === 'primary' && 'bg-blue-500 text-white hover:bg-blue-600',
        variant === 'secondary' && 'bg-gray-200 text-gray-800 hover:bg-gray-300',
        className
      )}
      {...props}
    />
  );
}
```

### 3.2 CSS Modules

```css
/* WeatherPanel.module.css */
.container {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
}

.temperature {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

/* 使用 CSS 变量支持主题 */
@media (prefers-color-scheme: dark) {
  .temperature {
    color: var(--color-text-primary-dark);
  }
}
```

## 4. IPC 通信规范

### 4.1 通道定义

```typescript
// shared/constants/channels.ts
export const IPC_CHANNELS = {
  WEATHER: {
    GET: 'weather:get',
    REFRESH: 'weather:refresh',
  },
  MEDIA: {
    GET_STATUS: 'media:get-status',
    CONTROL: 'media:control',
  },
  IDE: {
    GET_STATUS: 'ide:get-status',
  },
  APPROVAL: {
    GET_LIST: 'approval:get-list',
    APPROVE: 'approval:approve',
    REJECT: 'approval:reject',
  },
  WINDOW: {
    SHOW: 'window:show',
    HIDE: 'window:hide',
    RESIZE: 'window:resize',
  },
} as const;
```

### 4.2 类型安全 IPC

```typescript
// preload/index.ts
import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '@shared/constants/channels';

contextBridge.exposeInMainWorld('electronAPI', {
  weather: {
    get: (city: string) => ipcRenderer.invoke(IPC_CHANNELS.WEATHER.GET, city),
    refresh: () => ipcRenderer.invoke(IPC_CHANNELS.WEATHER.REFRESH),
  },
  media: {
    getStatus: () => ipcRenderer.invoke(IPC_CHANNELS.MEDIA.GET_STATUS),
    control: (action: MediaAction) =>
      ipcRenderer.invoke(IPC_CHANNELS.MEDIA.CONTROL, action),
  },
});

// 全局类型声明
// shared/types/electronAPI.d.ts
declare global {
  interface Window {
    electronAPI: {
      weather: {
        get: (city: string) => Promise<WeatherData>;
        refresh: () => Promise<WeatherData>;
      };
      media: {
        getStatus: () => Promise<MediaStatus>;
        control: (action: MediaAction) => Promise<void>;
      };
    };
  }
}
```

## 5. 测试规范

### 5.1 单元测试

```typescript
// __tests__/weatherService.test.ts
import { describe, it, expect, vi } from 'vitest';
import { WeatherService } from '../weatherService';

describe('WeatherService', () => {
  it('should fetch weather data for valid city', async () => {
    const service = new WeatherService();
    const data = await service.fetch('Beijing');

    expect(data).toHaveProperty('temperature');
    expect(data).toHaveProperty('condition');
    expect(typeof data.temperature).toBe('number');
  });

  it('should throw error for invalid city', async () => {
    const service = new WeatherService();
    await expect(service.fetch('')).rejects.toThrow('City is required');
  });
});
```

### 5.2 组件测试

```typescript
// __tests__/WeatherPanel.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { WeatherPanel } from '../WeatherPanel';

describe('WeatherPanel', () => {
  it('renders weather data correctly', () => {
    const mockData = {
      temperature: 25,
      condition: 'sunny',
      city: 'Beijing',
    };

    render(<WeatherPanel data={mockData} onRefresh={vi.fn()} />);

    expect(screen.getByText('25°C')).toBeInTheDocument();
    expect(screen.getByAltText('sunny')).toBeInTheDocument();
  });

  it('calls onRefresh when refresh button clicked', () => {
    const onRefresh = vi.fn();
    render(<WeatherPanel data={null} onRefresh={onRefresh} />);

    fireEvent.click(screen.getByText('刷新'));
    expect(onRefresh).toHaveBeenCalledTimes(1);
  });
});
```

## 6. 文件模板

### 6.1 新组件模板

```typescript
// ComponentName.tsx
import React from 'react';
import styles from './ComponentName.module.css';

interface ComponentNameProps {
  // props 定义
}

function ComponentName({}: ComponentNameProps): JSX.Element {
  return <div className={styles.container}>{/* 实现 */}</div>;
}

export default React.memo(ComponentName);
```

### 6.2 新服务模板

```typescript
// serviceName.ts
import { Logger } from '@shared/utils/logger';

const logger = new Logger('ServiceName');

export class ServiceName {
  async initialize(): Promise<void> {
    logger.info('Service initialized');
  }

  async dispose(): Promise<void> {
    logger.info('Service disposed');
  }
}
```

## 7. ESLint 配置要点

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:react/recommended"
  ],
  "rules": {
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "no-console": ["warn", { "allow": ["error", "warn"] }]
  }
}
```
