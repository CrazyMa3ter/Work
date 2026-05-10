import { useState, useEffect } from 'react';

interface Settings {
  autoStart: boolean;
  weatherCity: string;
  weatherApiKey: string;
  weatherHost: string;
  theme: 'dark' | 'light' | 'auto';
  position: 'top' | 'bottom';
}

export function SettingsModule() {
  const [settings, setSettings] = useState<Settings>({
    autoStart: false,
    weatherCity: '北京',
    weatherApiKey: '',
    weatherHost: '',
    theme: 'dark',
    position: 'top',
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load settings from store
    window.electronAPI?.store.get('settings').then((data) => {
      if (data) {
        setSettings(data as Settings);
      }
    });
  }, []);

  const handleChange = (key: keyof Settings, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    await window.electronAPI?.store.set('settings', settings);
    await window.electronAPI?.app.setAutoStart(settings.autoStart);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* General Settings */}
      <div className="space-y-3">
        <div className="text-white/40 text-xs">通用设置</div>

        {/* Auto Start */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
          <div>
            <div className="text-white text-sm">开机自启</div>
            <div className="text-white/40 text-xs">系统启动时自动运行</div>
          </div>
          <button
            onClick={() => handleChange('autoStart', !settings.autoStart)}
            className={`
              w-12 h-6 rounded-full transition-colors relative
              ${settings.autoStart ? 'bg-green-500' : 'bg-white/20'}
            `}
          >
            <div className={`
              w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform
              ${settings.autoStart ? 'translate-x-6' : 'translate-x-0.5'}
            `} />
          </button>
        </div>

        {/* Position */}
        <div className="p-3 rounded-xl bg-white/5">
          <div className="text-white text-sm mb-2">位置</div>
          <div className="flex gap-2">
            {(['top', 'bottom'] as const).map((pos) => (
              <button
                key={pos}
                onClick={() => handleChange('position', pos)}
                className={`
                  flex-1 py-2 rounded-lg text-sm transition-colors
                  ${settings.position === pos ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white/60'}
                `}
              >
                {pos === 'top' ? '顶部' : '底部'}
              </button>
            ))}
          </div>
        </div>

        {/* Theme */}
        <div className="p-3 rounded-xl bg-white/5">
          <div className="text-white text-sm mb-2">主题</div>
          <div className="flex gap-2">
            {(['dark', 'light', 'auto'] as const).map((theme) => (
              <button
                key={theme}
                onClick={() => handleChange('theme', theme)}
                className={`
                  flex-1 py-2 rounded-lg text-sm transition-colors
                  ${settings.theme === theme ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white/60'}
                `}
              >
                {theme === 'dark' ? '深色' : theme === 'light' ? '浅色' : '自动'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Weather Settings */}
      <div className="space-y-3">
        <div className="text-white/40 text-xs">天气设置</div>

        <div className="p-3 rounded-xl bg-white/5 space-y-3">
          <div>
            <div className="text-white text-sm mb-1">默认城市</div>
            <input
              type="text"
              value={settings.weatherCity}
              onChange={(e) => handleChange('weatherCity', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/10 text-white text-sm outline-none focus:ring-2 focus:ring-white/20"
            />
          </div>

          <div>
            <div className="text-white text-sm mb-1">API Key</div>
            <input
              type="password"
              value={settings.weatherApiKey}
              onChange={(e) => handleChange('weatherApiKey', e.target.value)}
              placeholder="输入和风天气 API Key"
              className="w-full px-3 py-2 rounded-lg bg-white/10 text-white text-sm outline-none focus:ring-2 focus:ring-white/20 placeholder-white/30"
            />
          </div>

          <div>
            <div className="text-white text-sm mb-1">API Host</div>
            <input
              type="text"
              value={settings.weatherHost}
              onChange={(e) => handleChange('weatherHost', e.target.value)}
              placeholder="输入和风天气 API Host"
              className="w-full px-3 py-2 rounded-lg bg-white/10 text-white text-sm outline-none focus:ring-2 focus:ring-white/20 placeholder-white/30"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className={`
          w-full py-3 rounded-xl text-sm font-medium transition-colors
          ${saved ? 'bg-green-500/20 text-green-300' : 'bg-white/20 hover:bg-white/30 text-white'}
        `}
      >
        {saved ? '✓ 已保存' : '保存设置'}
      </button>

      {/* Version Info */}
      <div className="text-center text-white/20 text-xs">
        Dynamic Island Desktop v0.1.0
      </div>
    </div>
  );
}
