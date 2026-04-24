import { app, dialog, ipcMain } from "electron";
import { getAppState } from "../singleton";
import { autoUpdater } from "electron-updater";
import * as fs from "node:fs";


export function registerAppIpc(): void {
  ipcMain.on("app_version", (event) => {
    event.sender.send("app_version", { version: app.getVersion() });
  });

  ipcMain.on("restart_app", () => {
    getAppState().isQuitting = true;
    try {
      autoUpdater.quitAndInstall();
      setTimeout(() => {
        app.relaunch();
        app.exit(0);
      }, 6000);
    } catch (e) {
      dialog.showErrorBox("Error", "Failed to install updates");
    }

  });

  ipcMain.on("app_path", (event) => {
    event.sender.send("app_path", { path: app.getPath("appData") });
  });
  ipcMain.on("app_path_sync", (event) => {
    event.returnValue = { path: app.getPath("appData") };
  });
  ipcMain.on("save_file", async (_, { content, title, filters }) => {
    const { filePath, canceled } = await dialog.showSaveDialog({
      defaultPath: title,
      filters
    });
    if (canceled || !filePath) {
      return;
    }
    fs.writeFileSync(filePath, content, { encoding: "latin1" });
  });
}
