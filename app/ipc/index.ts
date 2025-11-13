import { registerAppIpc } from './app.ipc';
import { registerShellIpc } from './shell.ipc';
import { registerMailIpc } from './mail.ipc';
import { registerTrayIpc } from './tray.ipc';


export function registerAllIpc(): void {
  registerShellIpc();
  registerMailIpc();
  registerAppIpc();
  registerTrayIpc();
}
