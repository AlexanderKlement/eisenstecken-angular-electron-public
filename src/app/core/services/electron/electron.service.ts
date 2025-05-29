import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';

@Injectable({
  providedIn: 'root',
})
export class ElectronService {
  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  childProcess: typeof childProcess;
  fs: typeof fs;

  constructor() {
    // Conditional imports
    if (this.isElectron) {
      // Zugriff auf die vom Preload-Skript bereitgestellte API
      this.ipcRenderer = (window as any).electron?.ipcRenderer;
      this.webFrame = (window as any).electron?.webFrame;
      this.childProcess = (window as any).electron?.childProcess;
      this.fs = (window as any).electron?.fs;
    }
  }

  public get isElectron(): boolean {
    return !!(
      window &&
      (window as any).electron &&
      (window as any).electron.ipcRenderer
    );
  }
}


