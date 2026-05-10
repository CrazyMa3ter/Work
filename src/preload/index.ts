import { contextBridge, ipcRenderer } from 'electron';

export interface ElectronAPI {
  island: {
    expand: () => Promise<void>;
    collapse: () => Promise<void>;
    onExpand: (callback: () => void) => void;
    onCollapse: (callback: () => void) => void;
    onNavigate: (callback: (page: string) => void) => void;
  };
  store: {
    get: (key: string) => Promise<unknown>;
    set: (key: string, value: unknown) => Promise<void>;
  };
  app: {
    quit: () => Promise<void>;
    hide: () => Promise<void>;
    setAutoStart: (enabled: boolean) => Promise<void>;
    getAutoStart: () => Promise<boolean>;
  };
}

const api: ElectronAPI = {
  island: {
    expand: () => ipcRenderer.invoke('island:expand'),
    collapse: () => ipcRenderer.invoke('island:collapse'),
    onExpand: (callback: () => void) => {
      ipcRenderer.on('island:expand', () => callback());
    },
    onCollapse: (callback: () => void) => {
      ipcRenderer.on('island:collapse', () => callback());
    },
    onNavigate: (callback: (page: string) => void) => {
      ipcRenderer.on('island:navigate', (_event, page: string) => callback(page));
    },
  },
  store: {
    get: (key: string) => ipcRenderer.invoke('store:get', key),
    set: (key: string, value: unknown) => ipcRenderer.invoke('store:set', key, value),
  },
  app: {
    quit: () => ipcRenderer.invoke('app:quit'),
    hide: () => ipcRenderer.invoke('app:hide'),
    setAutoStart: (enabled: boolean) => ipcRenderer.invoke('app:setAutoStart', enabled),
    getAutoStart: () => ipcRenderer.invoke('app:getAutoStart'),
  },
};

contextBridge.exposeInMainWorld('electronAPI', api);

export type { ElectronAPI };
