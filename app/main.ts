import { app } from "electron";
import * as path from "path";
import * as Sentry from "@sentry/electron/main";
import { createWindow, showMainWindow } from "./window";
import { getAppState } from "./singleton";
import { initTray } from "./tray";
import { registerAllIpc } from "./ipc";
import { checkForUpdatesWhenReady, configureUpdateChannel, wireUpdateEvents } from "./update";

const state = getAppState();
state.app = app;
const isBeta = app.getName().toLowerCase().includes("beta");
Sentry.init({
  dsn: "https://60ac4754e4be476a82b10b0e597dfaa6@sentry.kivi.bz.it/25",
  environment: isBeta ? "beta" : "production",
  release: "2.3.2"

});
const args = process.argv.slice(1);
const serve = args.some(val => val === "--serve");

// userData has to be set before requesting the single instance lock, the lock lives in that folder
if (isBeta) {
  const betaUserData = path.join(app.getPath("appData"), "Eisenstecken-Eibel-Beta");
  app.setPath("userData", betaUserData);
  console.info("Using beta userData folder:", betaUserData);
}

const gotTheLock: boolean = app.requestSingleInstanceLock();


try {
  if (!gotTheLock) {
    app.quit();
  } else {
    app.on("second-instance", async () => {
      console.warn("Second instance detected");
      if (!getAppState().win) {
        await createWindow(serve);
      }
      showMainWindow();
    });

    const checkForUpdateLoop = () => {
      console.info("[main] triggering update check");
      void checkForUpdatesWhenReady();
      setTimeout(checkForUpdateLoop, 300000); // 5 minutes
    };

    app.whenReady().then(async () => {
      registerAllIpc();
      configureUpdateChannel();
      wireUpdateEvents();

      // Don't wait for the renderer to finish loading before setting up the tray
      void initTray();
      await createWindow(serve);

      if (!serve) {
        setTimeout(checkForUpdateLoop, 15000); // 15 seconds after start
      }
    });

    app.on("window-all-closed", () => {
      if (process.platform !== "darwin") {
        app.quit();
      }
    });

    app.on("activate", async () => {
      if (!getAppState().win) {
        await createWindow(serve);
      } else {
        showMainWindow();
      }
    });

    app.on("before-quit", function() {
      const state = getAppState();
      state.isQuitting = true;
    });

  }
} catch (e) {
  console.error(e);
}
