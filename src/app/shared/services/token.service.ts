import { Injectable } from "@angular/core";
import { AuthResponse } from "../../../api/openapi";

@Injectable({
  providedIn: "root"
})
export class TokenService {
  static accessTokenKey = "access_token";
  static refreshTokenKey = "refresh_token";

  getToken(): string | null {
    return localStorage.getItem(TokenService.accessTokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(TokenService.refreshTokenKey);
  }

  setToken(token: AuthResponse): void {
    localStorage.setItem(TokenService.accessTokenKey, token.accessToken);
    localStorage.setItem(TokenService.refreshTokenKey, token.refreshToken);
  }

  removeToken(): void {
    localStorage.removeItem(TokenService.accessTokenKey);
    localStorage.removeItem(TokenService.refreshTokenKey);
  }
}
