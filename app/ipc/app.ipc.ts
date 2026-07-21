import { app, dialog, ipcMain } from "electron";
import { getAppState } from "../singleton";
import { getRendererDistFolder } from "../paths";
import { autoUpdater } from "electron-updater";
import * as fs from "node:fs";
import * as path from "path";


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

  ipcMain.on("reload_window", () => {
    const state = getAppState();
    if (!state.win) {
      return;
    }
    if (state.win.webContents.getURL().startsWith("http")) {
      state.win.webContents.reload();
      return;
    }
    // file:// build: the Angular router rewrites the URL via pushState, so
    // reloading the current URL would request a path that is not a real file.
    // Load the actual entry file instead.
    void state.win.loadFile(path.join(getRendererDistFolder(), "index.html"));
  });

  ipcMain.on("app_path", (event) => {
    event.sender.send("app_path", { path: app.getPath("appData") });
  });
  ipcMain.on("app_path_sync", (event) => {
    event.returnValue = { path: app.getPath("appData") };
  });
  ipcMain.on("save_file", async (event, { content, title, filters }) => {
    const { filePath, canceled } = await dialog.showSaveDialog({
      defaultPath: title,
      filters
    });
    if (canceled || !filePath) {
      return;
    }
    try {
      fs.writeFileSync(filePath, content, { encoding: "latin1" });
      event.returnValue = { success: true };
    } catch (e) {
      dialog.showErrorBox("Error", "Fehler beim speichern");
      event.returnValue = { success: false, error: e };
    }
  });
}
