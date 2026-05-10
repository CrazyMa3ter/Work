import { app } from 'electron';

export function setAutoStart(enabled: boolean): void {
  if (process.platform !== 'win32') return;

  app.setLoginItemSettings({
    openAtLogin: enabled,
    openAsHidden: true,
    path: process.execPath,
  });
}

export function getAutoStart(): boolean {
  if (process.platform !== 'win32') return false;

  const settings = app.getLoginItemSettings();
  return settings.openAtLogin;
}
