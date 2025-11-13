import { escapeShell, resolveMailExe } from '../paths';
import { ipcMain } from 'electron';
import { LocalConfigMain } from '../LocalConfigMain';


export function registerMailIpc(): void {
  const { mail32, mail64 } = resolveMailExe();

  ipcMain.on('send-mail-request', (event, arg) => {
    console.log('Preparing mail: ' + LocalConfigMain.getInstance().getMailProcessor());
    let mailExecutablePath = mail32;
    if (LocalConfigMain.getInstance().getMailProcessor().includes('x64')) {
      mailExecutablePath = mail64;
    }

    let mailCommand = mailExecutablePath;

    for (const singleArg of arg) {
      mailCommand += ' ' + escapeShell(singleArg);
    }

    let cmd = '';
    if (process.platform === 'win32') {
      cmd += 'cmd /c chcp 65001>nul && ';
    }
    cmd += mailCommand;

    require('child_process').exec(cmd, function(err, stdout: string, _: string): void {
      if (stdout.trim().length < 5) {
        event.reply('send-mail-reply', true);
        return;
      }
      const errorString = stdout;
      const doublePoint = errorString.indexOf(': ') + 2;
      const firstAt = errorString.indexOf(' at ');
      const extractedErrorString = errorString.slice(doublePoint, firstAt);
      event.reply('send-mail-reply', extractedErrorString);
      return;
    });
    event.reply('send-mail-reply', true);
  });

  ipcMain.on('set-mail-processor-request', (event, arg) => {
    LocalConfigMain.getInstance().setMailProcessor(arg[0]);
    event.reply('set-mail-processor-replay', true);
  });

}
