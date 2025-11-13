import { app, dialog, ipcMain } from 'electron';
import { getAppState } from '../singleton';
import { autoUpdater } from 'electron-updater';


export function registerAppIpc(): void {
  ipcMain.on('app_version', (event) => {
    event.sender.send('app_version', { version: app.getVersion() });
  });

  ipcMain.on('restart_app', () => {
    getAppState().isQuitting = true;
    try {
      autoUpdater.quitAndInstall();
      setTimeout(() => {
        app.relaunch();
        app.exit(0);
      }, 6000);
    } catch (e) {
      dialog.showErrorBox('Error', 'Failed to install updates');
    }

  });

  ipcMain.on('app_path', (event) => {
    event.sender.send('app_path', { path: app.getPath('appData') });
  });
  ipcMain.on('app_path_sync', (event) => {
    event.returnValue = { path: app.getPath('appData') };
  });

}
