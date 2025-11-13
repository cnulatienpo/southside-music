import { app, BrowserWindow } from "electron";
import * as path from "path";

const createWindow = () => {
  const window = new BrowserWindow({
    width: 1280,
    height: 800,
    backgroundColor: "#000000",
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js")
    }
  });

  if (app.isPackaged) {
    window.loadFile(path.join(__dirname, "../build/index.html"));
  } else {
    window.loadURL("http://localhost:3000");
    window.webContents.openDevTools({ mode: "detach" });
  }
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
