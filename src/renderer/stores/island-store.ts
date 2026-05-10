import { create } from 'zustand';

interface IslandState {
  isExpanded: boolean;
  expand: () => void;
  collapse: () => void;
  toggle: () => void;
}

export const useIslandStore = create<IslandState>((set) => ({
  isExpanded: false,
  expand: () => {
    set({ isExpanded: true });
    window.electronAPI?.island.expand();
  },
  collapse: () => {
    set({ isExpanded: false });
    window.electronAPI?.island.collapse();
  },
  toggle: () => {
    set((state) => {
      const newState = !state.isExpanded;
      if (newState) {
        window.electronAPI?.island.expand();
      } else {
        window.electronAPI?.island.collapse();
      }
      return { isExpanded: newState };
    });
  },
}));
