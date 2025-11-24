const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');

const isDevelopment = process.env.NODE_ENV !== 'production';
const appRoot = path.join(__dirname, '..');
const { version: appVersion } = require(path.join(appRoot, 'package.json'));

process.on('uncaughtException', (error) => {
  console.error('Unhandled exception:', error);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});

if (isDevelopment) {
  try {
    const electronBinary = path.join(
      appRoot,
      'node_modules',
      '.bin',
      process.platform === 'win32' ? 'electron.cmd' : 'electron'
    );
    // eslint-disable-next-line global-require
    require('electron-reload')(appRoot, {
      electron: electronBinary
    });
    console.log('Hot reload enabled.');
  } catch (error) {
    console.warn('Hot reload not enabled:', error);
  }
}

let mainWindow;

function initAudioEngine() {
  console.log('Initialized Audio Engine');
}

function initVisualizerEngine() {
  console.log('Initialized Visualizer Engine');
}

function initDeepSeekEngine() {
  console.log('Initialized DeepSeek Engine');
}

function initDatabase() {
  console.log('Initialized Database');
}

function initGameModes() {
  console.log('Initialized Game Modes');
}

function initEarTrainingSystem() {
  console.log('Initialized Ear Training System');
}

function initYouTubeIntegration() {
  console.log('Initialized YouTube Integration');
}

function initUI() {
  console.log('Initialized UI');
}

function runInitializers() {
  const initializers = [
    initAudioEngine,
    initVisualizerEngine,
    initDeepSeekEngine,
    initDatabase,
    initGameModes,
    initEarTrainingSystem,
    initYouTubeIntegration,
    initUI
  ];

  initializers.forEach((initializer) => {
    try {
      initializer();
    } catch (error) {
      console.warn(`Initialization failed for ${initializer.name}:`, error);
    }
  });
}

function registerIpcHandlers() {
  ipcMain.handle('app:getVersion', async () => appVersion);
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    backgroundColor: '#000000',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      sandbox: false,
      webSecurity: true
    }
  });

  Menu.setApplicationMenu(null);

  const indexPath = path.join(appRoot, 'index.html');
  mainWindow.loadFile(indexPath);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  runInitializers();
  registerIpcHandlers();
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
