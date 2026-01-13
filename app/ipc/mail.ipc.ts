import { escapeShell, resolveMailExe } from '../paths';
import { ipcMain } from 'electron';
import { LocalConfigMain } from '../LocalConfigMain';


export function registerMailIpc(): void {
  console.log('[mail.ipc] registerMailIpc() called'); // <-- add this

  const { mail32, mail64 } = resolveMailExe();
  console.log('[mail.ipc] resolved mail exe:', { mail32, mail64 }); // <-- add this

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

    console.log('[mail.ipc] exec cmd:', cmd);

    const childProcess = require('child_process');
    const child = childProcess.exec(cmd, (err: unknown, stdout: string, stderr: string): void => {
      const out = (stdout ?? '').trim();
      const errOut = (stderr ?? '').trim();

      if (err) {
        console.error('[mail.ipc] exec error:', err);
      }
      if (errOut.length > 0) {
        console.error('[mail.ipc] stderr:', errOut);
      }
      if (out.length > 0) {
        console.log('[mail.ipc] stdout:', out);
      }

      // Decide success/failure based on actual process results
      if (!err && errOut.length === 0 && out.length < 5) {
        event.reply('send-mail-reply', true);
        return;
      }

      // Preserve your existing parsing, but fall back to raw output
      const errorString = out.length > 0 ? out : errOut;
      const doublePoint = errorString.indexOf(': ') + 2;
      const firstAt = errorString.indexOf(' at ');

      const extractedErrorString =
        doublePoint >= 2 && firstAt > doublePoint
          ? errorString.slice(doublePoint, firstAt)
          : errorString;

      event.reply('send-mail-reply', extractedErrorString);
    });

    child.on('error', (e: unknown) => {
      console.error('[mail.ipc] child process error event:', e);
      event.reply('send-mail-reply', 'Mail process failed to start.');
    });
  });

  ipcMain.on('set-mail-processor-request', (event, arg) => {
    LocalConfigMain.getInstance().setMailProcessor(arg[0]);
    event.reply('set-mail-processor-replay', true);
  });
}
