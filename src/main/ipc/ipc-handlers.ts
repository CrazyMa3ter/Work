import { ipcMain, BrowserWindow } from 'electron';
import { expandWindow, collapseWindow } from '../windows/island-window';
import { getStore, setStore } from '../store/app-store';
import { setAutoStart, getAutoStart } from '../utils/auto-start';

export function registerIpcHandlers(): void {
  ipcMain.handle('island:expand', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (window) {
      expandWindow(window);
    }
  });

  ipcMain.handle('island:collapse', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (window) {
      collapseWindow(window);
    }
  });

  ipcMain.handle('store:get', (_event, key: string) => {
    return getStore(key);
  });

  ipcMain.handle('store:set', (_event, key: string, value: unknown) => {
    setStore(key, value);
  });

  ipcMain.handle('app:quit', () => {
    const { app } = require('electron');
    app.quit();
  });

  ipcMain.handle('app:hide', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (window) {
      window.hide();
    }
  });

  ipcMain.handle('app:setAutoStart', (_event, enabled: boolean) => {
    setAutoStart(enabled);
  });

  ipcMain.handle('app:getAutoStart', () => {
    return getAutoStart();
  });
}
