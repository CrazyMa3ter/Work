import { app, BrowserWindow, Tray } from 'electron';
import { createIslandWindow } from './windows/island-window';
import { createTray } from './tray/tray-manager';
import { registerIpcHandlers } from './ipc/ipc-handlers';
import { initializeStore, getStore } from './store/app-store';
import { setAutoStart } from './utils/auto-start';

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;

const isDev = process.env.NODE_ENV === 'development';

async function initializeApp() {
  await app.whenReady();

  initializeStore();
  registerIpcHandlers();

  // Apply auto-start setting
  try {
    const settings = getStore('settings');
    if (settings?.autoStart) {
      setAutoStart(true);
    }
  } catch {
    // Settings not initialized yet
  }

  mainWindow = createIslandWindow();
  tray = createTray(mainWindow);

  app.on('activate', () => {
    if (mainWindow === null) {
      mainWindow = createIslandWindow();
    }
    mainWindow.show();
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('before-quit', () => {
    if (tray) {
      tray.destroy();
      tray = null;
    }
  });
}

initializeApp().catch(console.error);
