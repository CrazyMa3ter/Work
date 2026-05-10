import { useEffect } from 'react';
import { useIDEStore } from '../../stores/ide-store';

export function IDEModule() {
  const { ides, activeIDE, setIDEs, setActiveIDE } = useIDEStore();

  useEffect(() => {
    // TODO: Integrate with process monitoring
    // Mock data for development
    setIDEs([
      {
        name: 'VS Code',
        processName: 'Code.exe',
        isRunning: true,
        projectName: 'dynamic-island-desktop',
        fileName: 'App.tsx',
        language: 'TypeScript',
        lastActive: Date.now(),
      },
      {
        name: 'IntelliJ IDEA',
        processName: 'idea64.exe',
        isRunning: false,
        projectName: null,
        fileName: null,
        language: null,
        lastActive: 0,
      },
      {
        name: 'PyCharm',
        processName: 'pycharm64.exe',
        isRunning: true,
        projectName: 'python-backend',
        fileName: 'main.py',
        language: 'Python',
        lastActive: Date.now() - 300000,
      },
    ]);
  }, []);

  const getLanguageIcon = (language: string | null) => {
    const icons: Record<string, string> = {
      'TypeScript': '🔷',
      'JavaScript': '🟨',
      'Python': '🐍',
      'Java': '☕',
      'Go': '🔵',
      'Rust': '🦀',
      'C++': '⚙️',
      'C#': '🔧',
    };
    return icons[language || ''] || '📄';
  };

  const formatTime = (timestamp: number) => {
    if (timestamp === 0) return '未激活';
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    const hours = Math.floor(minutes / 60);
    return `${hours}小时前`;
  };

  return (
    <div className="space-y-3">
      {ides.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-white/40">
          <div className="text-4xl mb-3">💻</div>
          <div className="text-sm">未检测到 IDE</div>
        </div>
      ) : (
        ides.map((ide) => (
          <div
            key={ide.processName}
            className={`
              p-4 rounded-2xl transition-colors cursor-pointer
              ${ide.isRunning ? 'bg-white/10' : 'bg-white/5'}
              ${activeIDE?.processName === ide.processName ? 'ring-2 ring-white/30' : ''}
            `}
            onClick={() => setActiveIDE(ide.isRunning ? ide : null)}
          >
            <div className="flex items-center gap-3">
              <div className={`
                w-3 h-3 rounded-full
                ${ide.isRunning ? 'bg-green-400' : 'bg-white/20'}
              `} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">{ide.name}</span>
                  {ide.language && (
                    <span className="text-lg">{getLanguageIcon(ide.language)}</span>
                  )}
                </div>
                {ide.isRunning && (
                  <div className="mt-1 space-y-0.5">
                    {ide.projectName && (
                      <div className="text-white/50 text-xs truncate">
                        项目: {ide.projectName}
                      </div>
                    )}
                    {ide.fileName && (
                      <div className="text-white/50 text-xs truncate">
                        文件: {ide.fileName}
                      </div>
                    )}
                    <div className="text-white/30 text-xs">
                      最后活跃: {formatTime(ide.lastActive)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      )}

      {/* Stats */}
      {ides.filter((ide) => ide.isRunning).length > 0 && (
        <div className="p-4 rounded-2xl bg-white/5">
          <div className="text-white/40 text-xs mb-2">统计</div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-white text-lg">{ides.filter((ide) => ide.isRunning).length}</div>
              <div className="text-white/40 text-xs">运行中</div>
            </div>
            <div>
              <div className="text-white text-lg">
                {new Set(ides.filter((ide) => ide.isRunning).map((ide) => ide.language)).size}
              </div>
              <div className="text-white/40 text-xs">语言种类</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
