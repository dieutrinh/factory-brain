const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const { spawnCore, stopCore, CORE_PORT } = require("./orchestrator");

let mainWindow;

function createWindow(){
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 780,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  mainWindow.loadFile(path.join(__dirname, "renderer", "index.html"));
}

app.whenReady().then(async () => {
  await spawnCore();
  createWindow();
});

app.on("window-all-closed", async () => {
  await stopCore();
  app.quit();
});

ipcMain.handle("core:getPort", () => CORE_PORT);

ipcMain.handle("dialog:openJobJson", async () => {
  const r = await dialog.showOpenDialog({ properties:["openFile"], filters:[{name:"Job JSON", extensions:["json"]}] });
  if (r.canceled || !r.filePaths?.[0]) return { ok:false };
  return { ok:true, path: r.filePaths[0] };
});

ipcMain.handle("fs:readText", async (evt, filePath) => {
  const fs = require("fs");
  return fs.readFileSync(filePath, "utf-8");
});
