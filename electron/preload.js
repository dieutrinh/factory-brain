const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("fb", {
  getCorePort: () => ipcRenderer.invoke("core:getPort"),
  openJobJson: () => ipcRenderer.invoke("dialog:openJobJson"),
  readText: (p) => ipcRenderer.invoke("fs:readText", p),
});
