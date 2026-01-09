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
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;

  if (channel === 'beta') {
    console.warn('ATTENTION: This is a BETA Version');
    localConfig.setChannel('beta');
  }

  console.info('[updater] version:', app.getVersion(), 'channel:', channel);
  return channel;
}

export function wireUpdateEvents(): void {
  autoUpdater.on('error', err => {
    console.error('[updater] error:', err);
    const s = getAppState();
    s.win?.webContents.send('update_error', {
      message: err instanceof Error ? err.message : String(err),
    });
  });

  autoUpdater.on('checking-for-update', () => {
    console.info('[updater] checking-for-update');
  });

  autoUpdater.on('update-not-available', info => {
    console.info('[updater] update-not-available:', info?.version);
    const s = getAppState();
    s.win?.webContents.send('update_not_available', { version: info?.version });
  });

  autoUpdater.on('update-available', info => {
    console.info('[updater] update-available:', info?.version);
    const s = getAppState();
    s.win?.webContents.send('update_available', { version: info?.version });
  });

  autoUpdater.on('download-progress', p => {
    console.info(
      '[updater] download-progress:',
      `${Math.round(p.percent)}%`,
      `(${p.transferred}/${p.total})`,
    );
    const s = getAppState();
    s.win?.webContents.send('update_progress', {
      percent: p.percent,
      transferred: p.transferred,
      total: p.total,
    });
  });

  autoUpdater.on('update-downloaded', info => {
    console.info('[updater] update-downloaded:', info?.version);
    const s = getAppState();
    s.win?.webContents.send('update_downloaded', { version: info?.version });
  });
}

export async function checkForUpdatesWhenReady(): Promise<void> {
  try {
    console.info('[updater] checkForUpdates() start');
    const result = await autoUpdater.checkForUpdates();
    console.info(
      '[updater] checkForUpdates() done:',
      'updateAvailable=',
      Boolean(result?.updateInfo?.version),
      'version=',
      result?.updateInfo?.version,
    );
  } catch (e) {
    console.error('[updater] checkForUpdates() failed:', e);
    const s = getAppState();
    s.win?.webContents.send('update_error', {
      message: e instanceof Error ? e.message : String(e),
    });
  }
}
