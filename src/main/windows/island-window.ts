import { BrowserWindow, screen } from 'electron';
import path from 'path';

const isDev = process.env.NODE_ENV === 'development';

export function createIslandWindow(): BrowserWindow {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;

  const islandWidth = 360;
  const islandHeight = 64;
  const collapsedHeight = 64;
  const expandedHeight = 480;

  const window = new BrowserWindow({
    width: islandWidth,
    height: islandHeight,
    x: Math.round((screenWidth - islandWidth) / 2),
    y: 12,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    movable: false,
    transparent: true,
    backgroundColor: '#00000000',
    hasShadow: false,
    roundedCorners: true,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
    show: false,
  });

  window.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  window.setAlwaysOnTop(true, 'screen-saver');

  if (isDev) {
    window.loadURL('http://localhost:5173');
    window.webContents.openDevTools({ mode: 'detach' });
  } else {
    window.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  window.once('ready-to-show', () => {
    window.show();
  });

  return window;
}

export function expandWindow(window: BrowserWindow): void {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth } = primaryDisplay.workAreaSize;
  const islandWidth = 360;
  const expandedHeight = 480;

  window.setBounds({
    width: islandWidth,
    height: expandedHeight,
    x: Math.round((screenWidth - islandWidth) / 2),
    y: 12,
  });
}

export function collapseWindow(window: BrowserWindow): void {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth } = primaryDisplay.workAreaSize;
  const islandWidth = 360;
  const collapsedHeight = 64;

  window.setBounds({
    width: islandWidth,
    height: collapsedHeight,
    x: Math.round((screenWidth - islandWidth) / 2),
    y: 12,
  });
}
