import { app } from 'electron';
import * as Sentry from '@sentry/electron/main';
import { createWindow } from './window';
import { getAppState } from './singleton';
import { initTray } from './tray';
import { registerAllIpc } from './ipc';
import { configureUpdateChannel, wireUpdateEvents } from './update';

const state = getAppState();
state.app = app;

Sentry.init({ dsn: 'https://60ac4754e4be476a82b10b0e597dfaa6@sentry.kivi.bz.it/25' });

const args = process.argv.slice(1);
const serve = args.some(val => val === '--serve');
const gotTheLock: boolean = app.requestSingleInstanceLock();


try {
  if (!gotTheLock) {
    app.quit();
  } else {
    app.on('second-instance', () => {
      console.warn('Second instance detected');
      const state = getAppState();
      state.win.show();
      if (state.win) {
        if (state.win.isMinimized()) {
          state.win.restore();
        }
        state.win.focus();
      }
    });
    app.whenReady().then(async () => {
      registerAllIpc();
      configureUpdateChannel();
      wireUpdateEvents();

      await createWindow(serve);
      await initTray();
    });

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    app.on('activate', async () => {
      const state = getAppState();
      if (!state.win) {
        await createWindow(serve);
      } else {
        state.win.show();
      }
    });

    app.on('before-quit', function() {
      const state = getAppState();
      state.isQuitting = true;
    });


  }
} catch (e) {
  console.error(e);
}
