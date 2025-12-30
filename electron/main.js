const { app, BrowserWindow, dialog } = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: true,              // 🔑 luôn show
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  const indexHtml = path.join(__dirname, "renderer", "index.html");

  mainWindow.loadFile(indexHtml).catch(err => {
    dialog.showErrorBox(
      "FactoryBrain v2 – Load Error",
      err.message || String(err)
    );
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
