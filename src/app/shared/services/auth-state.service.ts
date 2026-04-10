import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, ReplaySubject } from "rxjs";
import { first, map } from "rxjs/operators";
import {
  AuthService,
  DefaultService,
  ScopeEnum,
  User,
  Configuration
} from "../../../api/openapi";

@Injectable({
  providedIn: "root"
})
export class AuthStateService {
  static accessTokenKey = "access_token";
  private user?: ReplaySubject<User>;

  constructor(
    private router: Router,
    private authService: AuthService,
    private defaultService: DefaultService,
    private configuration: Configuration
  ) {}

  getToken(): string | null {
    return localStorage.getItem(AuthStateService.accessTokenKey);
  }

  setToken(token: string): void {
    localStorage.setItem(AuthStateService.accessTokenKey, token);
    this.configuration.credentials.OAuth2PasswordBearer = token;
  }

  removeToken(): void {
    localStorage.removeItem(AuthStateService.accessTokenKey);
    this.configuration.credentials.OAuth2PasswordBearer = null;
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
            this.setToken(token.accessToken);
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
      map(user => (user.scopes ?? []).includes(scope))
    );
  }
}
