// CommonJS preload with safe, minimal bridge
const { contextBridge, ipcRenderer } = require('electron');

const sendChannels = [
  'shell-external-request',
  'send-mail-request',
  'set-mail-processor-request',
  'shell-item-request',
  'shell-file-request',
  'select-folder-request',
  'select-files-request',
  'app_version',
  'restart_app',
  'app_path',
  'app_path_sync',
  'show-tray-balloon-request',
];

const receiveChannels = [
  'shell-external-reply',
  'send-mail-reply',
  'shell-item-reply',
  'shell-file-reply',
  'select-folder-reply',
  'select-files-reply',
  'app_version',
  'app_path',
  'show-tray-balloon-replay',
  'update_available',
  'update_downloaded',
  'app-shown',
  'app-hidden',
];

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
