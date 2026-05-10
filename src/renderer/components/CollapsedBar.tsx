import { useWeatherStore } from '../stores/weather-store';
import { useMediaStore } from '../stores/media-store';
import { useIDEStore } from '../stores/ide-store';
import { useApprovalStore } from '../stores/approval-store';

interface CollapsedBarProps {
  onClick: () => void;
}

export function CollapsedBar({ onClick }: CollapsedBarProps) {
  const weather = useWeatherStore((state) => state.data);
  const media = useMediaStore((state) => state.info);
  const activeIDE = useIDEStore((state) => state.activeIDE);
  const pendingCount = useApprovalStore((state) => state.pendingCount);

  return (
    <div
      className="flex items-center justify-between px-5 h-16 cursor-pointer select-none"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        {weather && (
          <div className="flex items-center gap-1.5 text-white/90">
            <span className="text-sm">{weather.temperature}°</span>
            <span className="text-xs text-white/60">{weather.city}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {activeIDE?.isRunning && (
          <div className="flex items-center gap-1.5 text-white/80">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs truncate max-w-[80px]">{activeIDE.name}</span>
          </div>
        )}

        {media && (
          <div className="flex items-center gap-1.5 text-white/80">
            {media.isPlaying ? (
              <div className="flex gap-0.5 items-end h-3">
                <div className="w-0.5 bg-white/80 animate-[music-bar_0.8s_ease-in-out_infinite]" style={{ height: '60%' }} />
                <div className="w-0.5 bg-white/80 animate-[music-bar_0.6s_ease-in-out_infinite_0.1s]" style={{ height: '100%' }} />
                <div className="w-0.5 bg-white/80 animate-[music-bar_0.7s_ease-in-out_infinite_0.2s]" style={{ height: '40%' }} />
              </div>
            ) : (
              <span className="text-xs">⏸</span>
            )}
            <span className="text-xs truncate max-w-[100px]">{media.title}</span>
          </div>
        )}

        {pendingCount > 0 && (
          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold">
            {pendingCount}
          </div>
        )}
      </div>
    </div>
  );
}
