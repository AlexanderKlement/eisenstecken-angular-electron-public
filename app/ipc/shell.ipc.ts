import { ipcMain, shell } from 'electron';


export function registerShellIpc(): void {

  ipcMain.on('shell-external-request', (event, arg) => {
    shell.openExternal(arg).then(() => {
      event.reply('shell-external-reply', true);
    }, (reason) => {
      console.error('Main: Shell external: FAIL');
      console.error(reason);
      event.reply('shell-external-reply', false);
    });
  });


  ipcMain.on('shell-item-request', (event, arg) => {
    shell.openPath(arg).then((response) => {
      event.reply('shell-item-reply', response);
    }, (reason) => {
      console.error('Main: Shell item: FAIL');
      console.error(reason);
      event.reply('shell-item-reply', reason.toString());
    });
  });
  ipcMain.on('shell-file-request', (event, arg) => {
    try {
      shell.showItemInFolder(arg);
      event.reply('shell-file-reply', true);
    } catch (e) {
      console.error('Main: Shell file: FAIL');
      console.error(e);
      event.reply('shell-file-reply', false);
    }
  });

  ipcMain.on('select-folder-request', (event, _) => {
    try {
      const { dialog } = require('electron');
      const pathPromise = dialog.showOpenDialog({
        properties: ['openDirectory'],
      });
      pathPromise.then((path) => {
        if (path.canceled)
          event.reply('select-folder-reply', '');
        else
          event.reply('select-folder-reply', path.filePaths[0]);
      });
    } catch (e) {
      console.error('Main: Select Folder FAIL');
      console.error(e);
      event.reply('select-folder-reply', '');
    }
  });

  /*
  Arg0: multi: [true, false]
  Arg1: filtername: str,
  Arg2: filters separated by ";"
   */
  ipcMain.on('select-files-request', (event, arg) => {

    try {
      const properties: Array<'openFile' | 'openDirectory' | 'multiSelections' | 'showHiddenFiles' |
        'createDirectory' | 'promptToCreate' | 'noResolveAliases' | 'treatPackageAsDirectory' |
        'dontAddToRecent'> = [
        'openFile',
      ];
      if (arg[0]) {
        properties.push('multiSelections');
      }
      const { dialog } = require('electron');
      const pathPromise = dialog.showOpenDialog({
        properties: properties,
        filters: [
          {
            name: arg[1],
            extensions: arg[2].split(';'),
          },
        ],
      });
      pathPromise.then((path) => {
        if (path.canceled)
          event.reply('select-files-reply', []);
        else {
          event.reply('select-files-reply', path.filePaths);
        }

      });
    } catch (e) {
      console.error('Main: Select Files FAIL');
      console.error(e);
      event.reply('select-files-reply', []);
    }
  });
}
