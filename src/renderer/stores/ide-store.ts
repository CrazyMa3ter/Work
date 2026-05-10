import { create } from 'zustand';

export interface IDEStatus {
  name: string;
  processName: string;
  isRunning: boolean;
  projectName: string | null;
  fileName: string | null;
  language: string | null;
  lastActive: number;
}

interface IDEState {
  ides: IDEStatus[];
  activeIDE: IDEStatus | null;
  setIDEs: (ides: IDEStatus[]) => void;
  setActiveIDE: (ide: IDEStatus | null) => void;
}

export const useIDEStore = create<IDEState>((set) => ({
  ides: [],
  activeIDE: null,
  setIDEs: (ides) => set({ ides }),
  setActiveIDE: (activeIDE) => set({ activeIDE }),
}));
