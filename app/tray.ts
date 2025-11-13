import { getAppState } from './singleton';
import { Menu, Tray, nativeImage } from 'electron';
import { resolveIconIco } from './paths';
import * as fs from 'fs';

export async function initTray() {
  const state = getAppState();

  await state.app.whenReady();

  try {
    const iconPath = resolveIconIco();

    if (!fs.existsSync(iconPath)) {
      console.warn('Tray icon file not found, skipping tray:', iconPath);
      return; // don’t crash, just no tray icon
    }

    const image = nativeImage.createFromPath(iconPath);
    if (image.isEmpty()) {
      console.warn('Tray icon image is empty at path, skipping tray:', iconPath);
      return;
    }

    const tray = new Tray(image);
    tray.setToolTip('Eisenstecken-Eibel');
    tray.setContextMenu(Menu.buildFromTemplate([
      {
        label: 'Öffnen',
        click: () => {
          if (state.win) {
            state.win.show();
          }
        },
      },
      {
        label: 'Schließen',
        click: () => {
          state.isQuitting = true;
          state.app.quit();
        },
      },
    ]));

    state.tray = tray;
  } catch (err) {
    console.error('Failed to init tray', err);
  }
}
