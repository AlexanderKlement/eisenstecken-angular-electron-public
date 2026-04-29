import { Injectable, inject } from "@angular/core";
import {
  HttpBackend,
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest
} from "@angular/common/http";
import { EMPTY, Observable, Subject, throwError } from "rxjs";
import { catchError, filter, switchMap, take } from "rxjs/operators";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TokenService } from "./shared/services/token.service";
import { LocalConfigRenderer } from "./LocalConfigRenderer";
import { AuthResponse } from "../api/openapi";

@Injectable()
export class GlobalHttpInterceptorService implements HttpInterceptor {
  router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private tokenService = inject(TokenService);

  private isLoggingOut = false;
  private isProbingMe = false;
  private isDoingRefresh = false;
  private rawHttp: HttpClient;
  private refreshTokenSubject = new Subject<string | null>();

  constructor() {
    const httpBackend = inject(HttpBackend);

    this.rawHttp = new HttpClient(httpBackend);
  }

  private doLogout(): void {
    this.tokenService.removeToken();
    this.isLoggingOut = true;
    void this.router.navigateByUrl("login");
  }

  private addAuthHeader(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  private handleTokenRefresh(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // If a refresh is already in flight, queue this request until it resolves
    if (this.isDoingRefresh) {
      return this.refreshTokenSubject.pipe(
        filter((token): token is string => token !== null),
        take(1),
        switchMap((token: string) => next.handle(this.addAuthHeader(req, token)))
      );
    }

    this.isDoingRefresh = true;
    // Emit null to block any queued requests while refreshing
    this.refreshTokenSubject.next(null);

    const base = LocalConfigRenderer.getInstance().getApi().replace(/\/+$/, "");
    const refreshToken = this.tokenService.getRefreshToken();
    const headers = refreshToken
      ? new HttpHeaders({ Authorization: `Bearer ${refreshToken}` })
      : new HttpHeaders();

    return this.rawHttp.post<AuthResponse>(`${base}/auth/refresh`, {}, { headers }).pipe(
      switchMap((response: AuthResponse) => {
        this.isDoingRefresh = false;
        this.tokenService.setToken(response);
        this.refreshTokenSubject.next(response.accessToken);
        // Retry the original request with the new token
        return next.handle(this.addAuthHeader(req, response.accessToken));
      }),
      catchError((refreshError: unknown) => {
        this.isDoingRefresh = false;
        this.refreshTokenSubject.next(null);
        if (!this.isLoggingOut) {
          this.doLogout();
        }
        return EMPTY;
      })
    );
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const lowerUrl = req.url.toLowerCase();
    if (lowerUrl.includes("/auth")) {
      // It's an auth request, don't get a token
      return next.handle(req.clone());
    }
    return next.handle(req).pipe(
      catchError((error: unknown) => {
        console.error("Intercepting error");
        console.error(error);

        if (!(error instanceof HttpErrorResponse)) {
          return throwError(() => error);
        }

        if (error.status === 404) {
          console.warn("Not sending error message");
          return EMPTY;
        }
        const base = LocalConfigRenderer.getInstance().getApi().replace(/\/+$/, "");

        const doRefresh = () => {
          this.isDoingRefresh = true;
          const refreshToken = this.tokenService.getRefreshToken();
          const headers = refreshToken
            ? new HttpHeaders({ Authorization: `Bearer ${refreshToken}` })
            : new HttpHeaders();
          this.rawHttp.post(`${base}/auth/refresh`, undefined, { headers }).subscribe({
            next: (data: AuthResponse) => {
              this.isDoingRefresh = false;
              if (data.accessToken?.length > 0) {
                this.tokenService.setToken(data);
              } else {
                this.doLogout();
              }
            },
            error: (refreshErr: unknown) => {
              this.isDoingRefresh = false;
              if (refreshErr instanceof HttpErrorResponse && refreshErr.status === 401 && !this.isLoggingOut) {
                this.doLogout();

              }
            }
          });
        };

        const isUsersMe =
          lowerUrl.endsWith("/users/me") ||
          lowerUrl.endsWith("/users/me/") ||
          lowerUrl.includes("/users/me?");
        const isRefreshEndpoint = lowerUrl.includes("/auth/refresh");

        if (error.status === 401) {
          console.warn("Not authorized for " + lowerUrl);

          if (isRefreshEndpoint || this.isLoggingOut || isUsersMe) {
            if (!this.isLoggingOut) {
              this.doLogout();
            }
            return EMPTY;
          }

          return this.handleTokenRefresh(req, next);
        }

        if (error.error && typeof error.error === "object" && "body" in (error.error as any)) {
          this.snackBar.open((error.error as any).body, "Ok", { duration: 10000 });
        }

        return throwError(() => error);
      })
    );
  }
}
