# Weather API 配置文档

## API 密钥信息

| 项目 | 值 |
|------|-----|
| **API Key** | `f7a47685b0034d9fac80637d9a2d88f8` |
| **凭据 ID** | `C4WMKHPFF3` |

## 使用说明

### 基础请求 URL

```
https://api.weatherprovider.com/v1/current
```

### 请求示例

```bash
curl -X GET "https://api.weatherprovider.com/v1/current?city=Beijing&appid=f7a47685b0034d9fac80637d9a2d88f8"
```

### 代码中使用

```typescript
// src/main/modules/weather/weatherService.ts
const WEATHER_API_KEY = 'f7a47685b0034d9fac80637d9a2d88f8';
const CREDENTIAL_ID = 'C4WMKHPFF3';

async function fetchWeatherData(city: string) {
  const response = await fetch(
    `https://api.weatherprovider.com/v1/current?city=${encodeURIComponent(city)}&appid=${WEATHER_API_KEY}&credential=${CREDENTIAL_ID}`
  );
  
  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`);
  }
  
  return response.json();
}
```

## 安全注意事项

- **请勿**将 API Key 硬编码在开源代码中
- 生产环境建议使用环境变量或加密存储
- 该 Key 仅限本项目使用，请勿分享

## 相关配置

如需修改 API 相关配置，请查看：
- `src/main/modules/weather/weatherService.ts` — 天气服务实现
- `src/shared/constants/weatherConstants.ts` — 天气相关常量
