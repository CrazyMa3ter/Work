# Weather API 配置文档

## API 密钥信息

| 项目 | 值 |
|------|-----|
| **API Key** | 请填写您的 API Key |
| **凭据 ID** | 请填写您的凭据 ID |
| **专用 Host** | 请填写您的专用 Host |

## 使用说明

### 基础请求 URL

```
https://YOUR_HOST/v1/current
```

### 请求示例

```bash
curl -X GET "https://YOUR_HOST/v1/current?city=Beijing&appid=YOUR_API_KEY"
```

### 代码中使用

```typescript
// src/main/modules/weather/weatherService.ts
// 请从环境变量或本地配置文件读取密钥
const WEATHER_API_KEY = process.env.WEATHER_API_KEY || '';
const CREDENTIAL_ID = process.env.WEATHER_CREDENTIAL_ID || '';
const WEATHER_API_HOST = process.env.WEATHER_API_HOST || '';

async function fetchWeatherData(city: string) {
  const response = await fetch(
    `https://${WEATHER_API_HOST}/v1/current?city=${encodeURIComponent(city)}&appid=${WEATHER_API_KEY}&credential=${CREDENTIAL_ID}`
  );
  
  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`);
  }
  
  return response.json();
}
```

## 安全注意事项

- **请勿**将 API Key、凭据 ID、专用 Host 硬编码在开源代码中
- 生产环境建议使用环境变量或加密存储
- 该 Key 仅限本项目使用，请勿分享

## 相关配置

如需修改 API 相关配置，请查看：
- `src/main/modules/weather/weatherService.ts` — 天气服务实现
- `src/shared/constants/weatherConstants.ts` — 天气相关常量
