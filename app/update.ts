import { app } from 'electron';
import { autoUpdater } from 'electron-updater';
import { LocalConfigMain } from './LocalConfigMain';
import { getAppState } from './singleton';

export type UpdateChannel = 'latest' | 'beta';

export function configureUpdateChannel(): UpdateChannel {
  const localConfig = LocalConfigMain.getInstance();
  const isBeta = app.getVersion().includes('beta');
  const channel: UpdateChannel = (isBeta ? 'beta' : (localConfig.getChannel() as UpdateChannel)) || 'latest';
  autoUpdater.channel = channel;
  autoUpdater.allowDowngrade = false;
  if (channel === 'beta') {
    console.warn('ATTENTION: This is a BETA Version');
    localConfig.setChannel('beta');
  }
  return channel;
}

export function wireUpdateEvents(): void {
  autoUpdater.on('update-available', () => {
    const s = getAppState();
    s.win?.webContents.send('update_available');
  });
  autoUpdater.on('update-downloaded', () => {
    const s = getAppState();
    s.win?.webContents.send('update_downloaded');
  });
}

export function checkForUpdatesWhenReady(): void {
  autoUpdater.checkForUpdatesAndNotify().then(r => console.log('Update available: ' + r.isUpdateAvailable + ' Version: ' + r.updateInfo.version));
}
