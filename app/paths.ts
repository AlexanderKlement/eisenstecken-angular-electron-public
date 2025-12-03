import * as path from 'path';
import { getAppState } from './singleton';

export function getPreloadPath(): string {
  // preload.js liegt neben main.js (dev & prod)
  return path.join(__dirname, 'preload.js');
}

export function getRendererDistFolder(): string {
  const state = getAppState();

  // Wenn per electron-builder gepackt:
  if (state.app && state.app.isPackaged) {
    // Hier musst du ggf. anpassen, je nachdem wohin du dist kopierst.
    // Häufig: resources/app/dist
    return path.join(process.resourcesPath, 'app');
  }

  // Dev: `ng build` im Projektordner
  // Wenn angular.json -> "outputPath": "dist"
  return path.join(__dirname, 'dist');
}

export function getDistFolder() {
  // With angular.json -> "outputPath": "dist"
  return path.join(__dirname);
}

function isPackaged() {
  const state = getAppState();
  return state.app.isPackaged;
}

function resolveAssetPath(...segments: string[]) {
  if (isPackaged()) {
    // electron-builder usually puts your build into resources/app
    // and process.resourcesPath points to /resources
    return path.join(process.resourcesPath, 'app', 'assets', ...segments);
  }

  // DEV: run from project, compiled JS lives in /app
  // adjust this to where Angular's assets actually are in dev
  return path.join(__dirname, '..', 'assets', ...segments);
}

export function escapeShell(cmd: string): string {
  const replaced = '"' + cmd.replace(/(["'$`\\])/g, '\\$1') + '"';
  return replaced.replace(/\n/g, '<br>');
}


export function resolveIconIco(): string {
  return resolveAssetPath(getIconFolder(), 'favicon.ico');
}

export function resolveIconPng(): string {
  return resolveAssetPath(getIconFolder(), 'favicon.png');
}


export function resolveMailExe(): { mail32: string; mail64: string } {
  const state = getAppState();
  const appPath = state.app.isPackaged
    ? process.resourcesPath // e.g. .../resources
    : path.join(__dirname, '..'); // dev: project/app root

  return {
    mail32: path.join(appPath, 'mail32', 'mail.exe'),
    mail64: path.join(appPath, 'mail64', 'mail.exe'),
  };
}

function getIconFolder(): string {
  const state = getAppState();
  const appName = state.app?.getName?.() || '';
  const lower = appName.toLowerCase();
  return lower.includes('beta') ? 'icons-beta' : 'icons';
}
