import { useState, useEffect } from 'react';
import { useWeatherStore } from '../../stores/weather-store';

export function WeatherModule() {
  const { data, loading, error, setWeather, setLoading, setError } = useWeatherStore();
  const [city, setCity] = useState('北京');

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual QWeather API call
      // Using mock data for now
      await new Promise((resolve) => setTimeout(resolve, 500));
      setWeather({
        city: city,
        temperature: 22,
        condition: '多云',
        icon: '101',
        humidity: 65,
        windSpeed: 12,
        windDir: '东南风',
        pressure: 1013,
        visibility: 10,
        feelsLike: 21,
        updateTime: new Date().toLocaleString('zh-CN'),
      });
    } catch (err) {
      setError('获取天气数据失败');
    }
  };

  const weatherIcons: Record<string, string> = {
    '100': '☀️', '101': '🌤', '102': '⛅', '103': '☁️',
    '104': '☁️', '200': '🌬', '201': '🌬', '202': '🌬',
    '203': '🌬', '204': '🌬', '205': '🌬', '206': '🌬',
    '207': '🌬', '208': '🌬', '209': '🌪', '210': '🌪',
    '211': '🌪', '212': '🌪', '213': '🌪', '300': '🌦',
    '301': '🌧', '302': '⛈', '303': '⛈', '304': '⛈',
    '305': '🌦', '306': '🌧', '307': '🌧', '308': '🌧',
    '309': '🌦', '310': '🌧', '311': '🌧', '312': '🌧',
    '313': '🌧', '314': '🌧', '315': '🌧', '316': '🌧',
    '317': '🌧', '318': '🌧', '399': '🌧', '400': '🌨',
    '401': '❄️', '402': '❄️', '403': '❄️', '404': '🌨',
    '405': '🌨', '406': '🌨', '407': '🌨', '408': '🌨',
    '409': '🌨', '410': '❄️', '499': '🌨', '500': '🌫',
    '501': '🌫', '502': '🌫', '503': '🌫', '504': '🌫',
    '507': '🌪', '508': '🌪', '509': '🌫', '510': '🌫',
    '511': '🌫', '512': '🌫', '513': '🌫', '514': '🌫',
    '515': '🌫', '900': '🔥', '901': '⛈', '999': '❓',
  };

  return (
    <div className="space-y-4">
      {/* City Search */}
      <div className="flex gap-2">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="输入城市名称"
          className="flex-1 px-3 py-2 rounded-xl bg-white/10 text-white placeholder-white/40 text-sm outline-none focus:ring-2 focus:ring-white/20"
        />
        <button
          onClick={fetchWeather}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-sm transition-colors disabled:opacity-50"
        >
          {loading ? '...' : '查询'}
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-500/20 text-red-300 text-sm">{error}</div>
      )}

      {data && (
        <>
          {/* Main Weather */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5">
            <div>
              <div className="text-5xl font-light text-white">{data.temperature}°</div>
              <div className="text-white/60 text-sm mt-1">{data.condition}</div>
            </div>
            <div className="text-6xl">{weatherIcons[data.icon] || '🌤'}</div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-white/5">
              <div className="text-white/40 text-xs">体感温度</div>
              <div className="text-white text-lg">{data.feelsLike}°</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5">
              <div className="text-white/40 text-xs">湿度</div>
              <div className="text-white text-lg">{data.humidity}%</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5">
              <div className="text-white/40 text-xs">风向风速</div>
              <div className="text-white text-lg">{data.windDir} {data.windSpeed}km/h</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5">
              <div className="text-white/40 text-xs">气压</div>
              <div className="text-white text-lg">{data.pressure}hPa</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5">
              <div className="text-white/40 text-xs">能见度</div>
              <div className="text-white text-lg">{data.visibility}km</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5">
              <div className="text-white/40 text-xs">更新时间</div>
              <div className="text-white text-sm">{data.updateTime}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
