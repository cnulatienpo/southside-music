import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';

const isMac = process.platform === 'darwin';

const createWindow = () => {
  const preloadPath = path.join(__dirname, '../preload/preload.js');
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const devServer = process.env.VITE_DEV_SERVER_URL;
  if (devServer) {
    win.loadURL(devServer);
  } else {
    win.loadFile(path.join(__dirname, '../../dist/renderer/index.html'));
  }
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit();
  }
});

ipcMain.handle('open-dialog', async () => {
  const result = await dialog.showOpenDialog({ properties: ['openFile'] });
  return result.filePaths;
});
