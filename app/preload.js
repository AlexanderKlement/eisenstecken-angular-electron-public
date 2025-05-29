let electronApi = undefined;

try {
  const { contextBridge, ipcRenderer, webFrame } = require('electron');
  const childProcess = require('child_process');
  const fs = require('fs');

  electronApi = {
    ipcRenderer,
    webFrame,
    childProcess,
    fs
  };

  contextBridge.exposeInMainWorld('electron', electronApi);
} catch (e) {
  // Nicht in Electron-Umgebung, nichts tun
}
