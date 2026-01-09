import { app } from 'electron';
import * as Sentry from '@sentry/electron/main';
import { createWindow } from './window';
import { getAppState } from './singleton';
import { initTray } from './tray';
import { registerAllIpc } from './ipc';
import { checkForUpdatesWhenReady, configureUpdateChannel, wireUpdateEvents } from './update';

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
    if (app.getName().toLowerCase().includes('beta')) {
      const path = require('path');
      const os = require('os');
      const betaUserData = path.join(os.homedir(), '.eisenstecken-beta');
      app.setPath('userData', betaUserData);
    }

    if (app.getName().toLowerCase().includes('beta')) {
      const path = require('path');
      const appDataBase = app.getPath('appData'); // e.g. %APPDATA% or ~/Library/Application Support
      const betaUserData = path.join(appDataBase, 'Eisenstecken-Eibel-Beta');
      app.setPath('userData', betaUserData);
      console.info('Using beta userData folder:', betaUserData);
    }

    app.whenReady().then(async () => {
      registerAllIpc();
      configureUpdateChannel();
      wireUpdateEvents();

      await createWindow(serve);
      await initTray();

      if (!serve) {
        console.info('[main] triggering update check');
        void checkForUpdatesWhenReady();
      }
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
