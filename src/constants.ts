import { User, UserEssential } from "./api/openapi";

export const SYSTEM_USER_ID = 2;

export function displayUserName<T extends User | UserEssential>(value: T): string {
  if (value.id === SYSTEM_USER_ID) {
    return "Unbekannt";
  }
  return value.fullname;
}
