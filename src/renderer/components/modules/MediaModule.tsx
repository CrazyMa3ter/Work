import { useState, useEffect } from 'react';
import { useMediaStore } from '../../stores/media-store';

export function MediaModule() {
  const { info, isPlaying, volume, setMediaInfo, setPlaying, setVolume } = useMediaStore();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // TODO: Integrate with Windows Media Control API
    // Mock data for development
    setMediaInfo({
      title: '示例歌曲',
      artist: '示例艺术家',
      album: '示例专辑',
      cover: null,
      isPlaying: false,
      duration: 240,
      position: 0,
    });
  }, []);

  useEffect(() => {
    if (info) {
      setProgress((info.position / info.duration) * 100);
    }
  }, [info]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setPlaying(!isPlaying);
    // TODO: Call Windows Media Control API
  };

  const handlePrevious = () => {
    // TODO: Call Windows Media Control API
  };

  const handleNext = () => {
    // TODO: Call Windows Media Control API
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value, 10);
    setVolume(newVolume);
    // TODO: Call Windows Media Control API
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseInt(e.target.value, 10);
    setProgress(newProgress);
    if (info) {
      // TODO: Seek to position
    }
  };

  if (!info) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white/40">
        <div className="text-4xl mb-3">🎵</div>
        <div className="text-sm">暂无媒体播放</div>
        <div className="text-xs mt-2">请使用系统媒体播放器播放音乐</div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Cover Art */}
      <div className="flex justify-center">
        <div className="w-40 h-40 rounded-2xl bg-white/10 flex items-center justify-center text-6xl">
          {info.cover ? (
            <img src={info.cover} alt="Cover" className="w-full h-full rounded-2xl object-cover" />
          ) : (
            '🎵'
          )}
        </div>
      </div>

      {/* Track Info */}
      <div className="text-center">
        <div className="text-white text-lg font-medium truncate">{info.title}</div>
        <div className="text-white/50 text-sm truncate">{info.artist}</div>
        <div className="text-white/30 text-xs truncate">{info.album}</div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleProgressChange}
          className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
        />
        <div className="flex justify-between text-white/40 text-xs">
          <span>{formatTime(info.position)}</span>
          <span>{formatTime(info.duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6">
        <button
          onClick={handlePrevious}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-lg transition-colors"
        >
          ⏮
        </button>
        <button
          onClick={handlePlayPause}
          className="w-14 h-14 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white text-2xl transition-colors"
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button
          onClick={handleNext}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-lg transition-colors"
        >
          ⏭
        </button>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-3">
        <span className="text-white/40 text-sm">🔊</span>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
          className="flex-1 h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
        />
        <span className="text-white/40 text-sm w-8 text-right">{volume}%</span>
      </div>
    </div>
  );
}
