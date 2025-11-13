import { ipcMain, nativeImage } from 'electron';
import { resolveIconPng } from '../paths';
import { getAppState } from '../singleton';
import * as fs from 'fs';

export function registerTrayIpc(): void {
  ipcMain.on('show-tray-balloon-request', (event, arg) => {
    console.info('Showing tray balloon');

    const state = getAppState();
    if (!state.tray) {
      console.warn('Tray is not initialized, cannot display balloon');
      event.reply('show-tray-balloon-replay', false);
      return;
    }

    const iconPath = resolveIconPng();
    let image;
    if (fs.existsSync(iconPath)) {
      image = nativeImage.createFromPath(iconPath);
    }

    state.tray.displayBalloon({
      icon: image,
      iconType: image ? 'custom' : 'none',
      title: arg[0],
      content: arg[1],
      noSound: true,
      respectQuietTime: false,
    });

    event.reply('show-tray-balloon-replay', true);
  });
}
