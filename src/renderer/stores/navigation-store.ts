import { create } from 'zustand';

export type Page = 'home' | 'weather' | 'media' | 'ide' | 'approval' | 'settings';

interface NavigationState {
  currentPage: Page;
  navigateTo: (page: Page) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  currentPage: 'home',
  navigateTo: (page) => set({ currentPage: page }),
}));
