export interface AppState {
  isQuitting: boolean;
  win: Electron.BrowserWindow | null;
  tray: Electron.Tray | null;
  app: Electron.App | null;
}
