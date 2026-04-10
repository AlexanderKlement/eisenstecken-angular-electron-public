import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class TokenService {
  static accessTokenKey = "access_token";

  getToken(): string | null {
    return localStorage.getItem(TokenService.accessTokenKey);
  }

  setToken(token: string): void {
    localStorage.setItem(TokenService.accessTokenKey, token);
  }

  removeToken(): void {
    localStorage.removeItem(TokenService.accessTokenKey);
  }
}
