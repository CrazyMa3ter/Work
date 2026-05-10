import { useWeatherStore } from '../../stores/weather-store';
import { useMediaStore } from '../../stores/media-store';
import { useIDEStore } from '../../stores/ide-store';
import { useApprovalStore } from '../../stores/approval-store';
import { useNavigationStore } from '../../stores/navigation-store';

export function HomeModule() {
  const weather = useWeatherStore((state) => state.data);
  const media = useMediaStore((state) => state.info);
  const ides = useIDEStore((state) => state.ides);
  const pendingCount = useApprovalStore((state) => state.pendingCount);
  const { navigateTo } = useNavigationStore();

  const runningIDEs = ides.filter((ide) => ide.isRunning);

  return (
    <div className="space-y-4">
      {/* Weather Card */}
      <div
        className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
        onClick={() => navigateTo('weather')}
      >
        {weather ? (
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-light text-white">{weather.temperature}°</div>
              <div className="text-sm text-white/60">{weather.city} · {weather.condition}</div>
            </div>
            <div className="text-4xl">🌤</div>
          </div>
        ) : (
          <div className="text-white/40 text-sm">天气数据加载中...</div>
        )}
      </div>

      {/* Media Card */}
      <div
        className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
        onClick={() => navigateTo('media')}
      >
        {media ? (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl">
              🎵
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-medium truncate">{media.title}</div>
              <div className="text-white/50 text-xs truncate">{media.artist}</div>
            </div>
            <div className="text-white/60 text-xs">
              {media.isPlaying ? '▶' : '⏸'}
            </div>
          </div>
        ) : (
          <div className="text-white/40 text-sm">暂无媒体播放</div>
        )}
      </div>

      {/* IDE Card */}
      <div
        className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
        onClick={() => navigateTo('ide')}
      >
        {runningIDEs.length > 0 ? (
          <div className="space-y-2">
            {runningIDEs.slice(0, 2).map((ide) => (
              <div key={ide.processName} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-white text-sm">{ide.name}</span>
                {ide.projectName && (
                  <span className="text-white/40 text-xs truncate">· {ide.projectName}</span>
                )}
              </div>
            ))}
            {runningIDEs.length > 2 && (
              <div className="text-white/40 text-xs">+{runningIDEs.length - 2} 更多</div>
            )}
          </div>
        ) : (
          <div className="text-white/40 text-sm">未检测到运行中的 IDE</div>
        )}
      </div>

      {/* Approval Card */}
      <div
        className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
        onClick={() => navigateTo('approval')}
      >
        <div className="flex items-center justify-between">
          <div className="text-white text-sm">待审批事项</div>
          {pendingCount > 0 ? (
            <div className="flex items-center gap-2">
              <span className="text-red-400 font-bold">{pendingCount}</span>
              <span className="text-white/40 text-xs">项待处理</span>
            </div>
          ) : (
            <span className="text-white/40 text-xs">暂无待审批</span>
          )}
        </div>
      </div>
    </div>
  );
}
