import { Injectable, Injector } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, ReplaySubject } from "rxjs";
import { first, map } from "rxjs/operators";
import {
  AuthResponse,
  AuthService,
  DefaultService,
  ScopeEnum,
  User
} from "../../../api/openapi";
import { TokenService } from "./token.service";

@Injectable({
  providedIn: "root"
})
export class AuthStateService {
  static accessTokenKey = "access_token";
  static refreshTokenKey = "refresh_token";
  private user?: ReplaySubject<User>;

  constructor(
    private injector: Injector,
    private router: Router,
    private tokenService: TokenService,
    private authService: AuthService,
    private defaultService: DefaultService
  ) {
  }


  getToken(): string | null {
    return this.tokenService.getToken();
  }

  setToken(token: AuthResponse): void {
    localStorage.setItem(AuthStateService.accessTokenKey, token.accessToken);
    localStorage.setItem(AuthStateService.refreshTokenKey, token.refreshToken);
  }

  removeToken(): void {
    localStorage.removeItem(AuthStateService.accessTokenKey);
    localStorage.removeItem(AuthStateService.refreshTokenKey);
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  doLogout(): void {
    this.removeToken();
    this.user = undefined;
    void this.router.navigateByUrl("login");
  }

  async login(username: string, password: string): Promise<boolean> {
    const credentials = { email: username, password };

    return new Promise<boolean>((resolve) => {
      this.authService.login(credentials).subscribe({
        next: (token) => {
          if (token.accessToken?.length > 0) {
            this.setToken(token);
            this.user = undefined;
            resolve(true);
          } else {
            resolve(false);
          }
        },
        error: (error) => {
          console.error("Unable to login", error);
          resolve(false);
        }
      });
    });
  }

  getCurrentUser(): ReplaySubject<User> {
    if (!this.user) {
      this.user = new ReplaySubject<User>(1);
      this.defaultService.readUsersMeUsersMeGet().pipe(first()).subscribe(this.user);
    }
    return this.user;
  }

  currentUserHasScope(scope: ScopeEnum): Observable<boolean> {
    return this.getCurrentUser().pipe(
      map(user => (user.scopes ?? []).includes(scope) || (user.scopes ?? []).includes(ScopeEnum.Admin))
    );
  }
}
