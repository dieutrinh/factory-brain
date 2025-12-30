const { app, BrowserWindow, dialog } = require("electron");
const path = require("path");
const fs = require("fs");
const { ensureRuntime } = require("./runtime-init");

let mainWindow = null;
let logFile = null;

function log(...args) {
  try {
    const msg = args.map(a =>
      typeof a === "string" ? a : JSON.stringify(a)
    ).join(" ");
    if (logFile) {
      fs.appendFileSync(
        logFile,
        `[${new Date().toISOString()}] ${msg}\n`
      );
    }
  } catch {}
}

// ===== BẮT LỖI SỚM – KHÔNG TREO IM LẶNG =====
process.on("uncaughtException", (err) => {
  log("uncaughtException:", err?.stack || err?.message || String(err));
});

process.on("unhandledRejection", (reason) => {
  log(
    "unhandledRejection:",
    reason?.stack || reason?.message || String(reason)
  );
});

// ===== TẠO WINDOW – LUÔN SHOW =====
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  const indexHtml = path.join(__dirname, "renderer", "index.html");

  mainWindow.loadFile(indexHtml).catch(err => {
    dialog.showErrorBox(
      "FactoryBrain v2 – Load Error",
      err?.message || String(err)
    );
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// ===== APP READY =====
app.whenReady().then(() => {
  const runtimeBase = ensureRuntime();
  logFile = path.join(runtimeBase, "logs", "electron.log");
  log("app ready");

  createWindow();

  // 🚫 orchestrator chạy nền, KHÔNG await
  try {
    const { start } = require("./orchestrator");
    Promise.resolve(start()).catch(err =>
      log("orchestrator start failed:", err?.stack || err)
    );
  } catch (e) {
    log("no orchestrator:", e?.message || e);
  }
});

// ===== ĐÓNG APP = THOÁT HẲN =====
app.on("before-quit", async () => {
  try {
    const { stop } = require("./orchestrator");
    await Promise.resolve(stop());
  } catch {}
});

app.on("window-all-closed", () => {
  app.quit(); // 🔥 Windows: không chạy nền
});
