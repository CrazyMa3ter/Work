import { useIslandStore } from '../stores/island-store';
import { useNavigationStore, type Page } from '../stores/navigation-store';
import { WeatherModule } from './modules/WeatherModule';
import { MediaModule } from './modules/MediaModule';
import { IDEModule } from './modules/IDEModule';
import { ApprovalModule } from './modules/ApprovalModule';
import { SettingsModule } from './modules/SettingsModule';
import { HomeModule } from './modules/HomeModule';

interface ExpandedPanelProps {
  currentPage: Page;
  onCollapse: () => void;
}

const pageComponents: Record<Page, React.ComponentType> = {
  home: HomeModule,
  weather: WeatherModule,
  media: MediaModule,
  ide: IDEModule,
  approval: ApprovalModule,
  settings: SettingsModule,
};

const pageTitles: Record<Page, string> = {
  home: '首页',
  weather: '天气',
  media: '媒体',
  ide: 'IDE',
  approval: '审批',
  settings: '设置',
};

export function ExpandedPanel({ currentPage, onCollapse }: ExpandedPanelProps) {
  const { isExpanded } = useIslandStore();
  const { navigateTo } = useNavigationStore();

  const CurrentModule = pageComponents[currentPage];

  const navItems: { page: Page; icon: string }[] = [
    { page: 'home', icon: '🏠' },
    { page: 'weather', icon: '🌤' },
    { page: 'media', icon: '🎵' },
    { page: 'ide', icon: '💻' },
    { page: 'approval', icon: '✅' },
    { page: 'settings', icon: '⚙️' },
  ];

  return (
    <div
      className={`
        absolute inset-0 pt-16 flex flex-col transition-opacity duration-300
        ${isExpanded ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `}
    >
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
        <h2 className="text-white text-lg font-semibold">{pageTitles[currentPage]}</h2>
        <button
          onClick={onCollapse}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <CurrentModule />
      </div>

      <div className="flex items-center justify-around px-4 py-3 border-t border-white/10">
        {navItems.map((item) => (
          <button
            key={item.page}
            onClick={() => navigateTo(item.page)}
            className={`
              w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all
              ${currentPage === item.page ? 'bg-white/20 scale-110' : 'hover:bg-white/10'}
            `}
          >
            {item.icon}
          </button>
        ))}
      </div>
    </div>
  );
}
