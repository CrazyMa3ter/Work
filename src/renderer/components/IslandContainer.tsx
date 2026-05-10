import { ReactNode } from 'react';

interface IslandContainerProps {
  children: ReactNode;
  isExpanded: boolean;
}

export function IslandContainer({ children, isExpanded }: IslandContainerProps) {
  return (
    <div
      className={`
        relative mx-auto overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${isExpanded ? 'w-[360px] h-[480px] rounded-3xl' : 'w-[360px] h-16 rounded-full'}
        island-glass shadow-2xl shadow-black/50
      `}
    >
      {children}
    </div>
  );
}
