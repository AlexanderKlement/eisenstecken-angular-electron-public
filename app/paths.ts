import * as path from 'path';
import { getAppState } from './singleton';

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
  return resolveAssetPath('icons', 'favicon.ico');
}

export function resolveIconPng(): string {
  return resolveAssetPath('icons', 'favicon.png');
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
