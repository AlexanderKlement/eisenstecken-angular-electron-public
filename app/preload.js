// ... existing code ...
const { contextBridge, ipcRenderer } = require('electron');

const sendChannels = [
  'shell-external-request',
// ... existing code ...
  'app-shown',
  'app-hidden',
];

// contextBridge is NOT allowed when contextIsolation: false.
// We simply attach to window because nodeIntegration is true.
window.electron = {
  send: (channel, ...args) => {
    if (sendChannels.includes(channel)) ipcRenderer.send(channel, ...args);
  },
  invoke: (channel, ...args) => {
    if (sendChannels.includes(channel) && ipcRenderer.invoke) {
      return ipcRenderer.invoke(channel, ...args);
    }
    return Promise.reject(new Error('Channel not allowed: ' + channel));
  },
  on: (channel, listener) => {
    if (receiveChannels.includes(channel)) ipcRenderer.on(channel, listener);
  },
  once: (channel, listener) => {
    if (receiveChannels.includes(channel)) ipcRenderer.once(channel, listener);
  },
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
};

/*
contextBridge.exposeInMainWorld('electron', {
  send: (channel, ...args) => {
    if (sendChannels.includes(channel)) ipcRenderer.send(channel, ...args);
  },
  invoke: (channel, ...args) => {
    if (sendChannels.includes(channel) && ipcRenderer.invoke) {
      return ipcRenderer.invoke(channel, ...args);
    }
    return Promise.reject(new Error('Channel not allowed: ' + channel));
  },
  on: (channel, listener) => {
    if (receiveChannels.includes(channel)) ipcRenderer.on(channel, listener);
  },
  once: (channel, listener) => {
    if (receiveChannels.includes(channel)) ipcRenderer.once(channel, listener);
  },
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
});
*/
