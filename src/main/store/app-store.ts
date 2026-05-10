import Store from 'electron-store';

interface StoreSchema {
  settings: {
    autoStart: boolean;
    weatherCity: string;
    weatherApiKey: string;
    weatherHost: string;
    theme: 'dark' | 'light' | 'auto';
    position: 'top' | 'bottom';
  };
  weather: {
    lastUpdate: number;
    data: unknown;
  };
  ide: {
    monitoredEditors: string[];
  };
}

const store = new Store<StoreSchema>({
  defaults: {
    settings: {
      autoStart: false,
      weatherCity: '北京',
      weatherApiKey: '',
      weatherHost: '',
      theme: 'dark',
      position: 'top',
    },
    weather: {
      lastUpdate: 0,
      data: null,
    },
    ide: {
      monitoredEditors: ['code', 'idea64', 'pycharm64', 'webstorm64'],
    },
  },
});

export function getStore<K extends keyof StoreSchema>(key: K): StoreSchema[K] {
  return store.get(key);
}

export function setStore<K extends keyof StoreSchema>(key: K, value: StoreSchema[K]): void {
  store.set(key, value);
}

export function initializeStore(): void {
  console.log('Store initialized at:', store.path);
}
