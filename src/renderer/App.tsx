import { useState, useEffect } from 'react';
import { IslandContainer } from './components/IslandContainer';
import { CollapsedBar } from './components/CollapsedBar';
import { ExpandedPanel } from './components/ExpandedPanel';
import { useIslandStore } from './stores/island-store';
import { useNavigationStore } from './stores/navigation-store';

function App() {
  const { isExpanded, expand, collapse } = useIslandStore();
  const { currentPage, navigateTo } = useNavigationStore();

  useEffect(() => {
    const api = window.electronAPI;
    if (!api) return;

    api.island.onExpand(() => expand());
    api.island.onCollapse(() => collapse());
    api.island.onNavigate((page: string) => {
      navigateTo(page);
      expand();
    });

    return () => {
      // Cleanup handled by ipcRenderer.removeAllListeners in preload
    };
  }, [expand, collapse, navigateTo]);

  return (
    <IslandContainer isExpanded={isExpanded}>
      <CollapsedBar onClick={expand} />
      <ExpandedPanel currentPage={currentPage} onCollapse={collapse} />
    </IslandContainer>
  );
}

export default App;
