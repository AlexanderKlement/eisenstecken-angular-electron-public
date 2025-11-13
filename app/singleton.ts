import { AppState } from './types';

const state: AppState = {
  isQuitting: false,
  win: null,
  tray: null,
  app: null
};

export function getAppState(): AppState {
  return state;
}
