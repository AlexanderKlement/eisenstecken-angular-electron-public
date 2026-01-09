import { BrowserWindow } from 'electron';
import * as path from 'path';
import { getDistFolder, getPreloadPath, getRendererDistFolder } from './paths';
import * as fs from 'node:fs';
import { getAppState } from './singleton';
import { checkForUpdatesWhenReady } from './update';

export function appShown(win: BrowserWindow): void {
  //win.maximize(); // This should be removed if it does not improve the situation
  win.webContents.send('app-shown');
}

export function appHidden(win: BrowserWindow): void {
  win.webContents.send('app-hidden');
}

export async function createWindow(serve: boolean) {
  // Create the browser window.
  const state = getAppState();

  state.win = new BrowserWindow({
    width: 1280,
    height: 900,
    show: false,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      preload: getPreloadPath()
    },
  });

  console.log('Creating window');
  console.log('Dist Folder: ' + getDistFolder());
  console.log('Preload Path: ' + path.join(getDistFolder(), 'preload.js'));

  if (serve) {
    console.log('Running in development mode');
    await state.win.loadURL('http://localhost:4200');
    state.win.webContents.openDevTools();
  } else {
    console.log('Running in production mode');

    const distFolder = getRendererDistFolder();
    const indexFile = path.join(distFolder, 'index.html');

    console.log('Dist Folder:', distFolder);
    console.log('Index File:', indexFile, 'exists:', fs.existsSync(indexFile));

    if (!fs.existsSync(indexFile)) {
      console.error('DIST NOT FOUND:', indexFile);
      // Optional: Hier früh abbrechen, damit du es sofort siehst
      // return;
    }

    await state.win.loadFile(indexFile);
  }
  state.win.on('closed', () => {
    const state = getAppState();
    state.win = null;
  });

  state.win.on('hide', () => {
    const state = getAppState();
    appHidden(state.win);
  });

  state.win.on('show', () => {
    const state = getAppState();
    appShown(state.win);
  });

  state.win.on('minimize', () => {
    const state = getAppState();
    state.win.hide();
  });

  state.win.on('close', async e => {
    const state = getAppState();
    if (!state.isQuitting) {
      e.preventDefault();
      state.win.hide();
      return;
    }
  });

  state.win.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error('did-fail-load', { errorCode, errorDescription, validatedURL });
  });

  state.win.webContents.session.webRequest.onErrorOccurred(details => {
    console.error('webRequest error', {
      url: details.url,
      error: details.error,
    });
    console.error(details);
  });


  state.win.once('ready-to-show', () => {
    console.log('Window ready to show');
    state.win.show();
  });

  state.win.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log('RENDERER CONSOLE:', { level, message, line, sourceId });
  });

  state.win.webContents.on('did-finish-load', () => {
    console.log('did-finish-load', state.win.webContents.getURL());
  });
}
