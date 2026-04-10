import { Injectable } from "@angular/core";
import {
  HttpBackend,
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { EMPTY, Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TokenService } from "./shared/services/token.service";
import { LocalConfigRenderer } from "./LocalConfigRenderer";

@Injectable()
export class GlobalHttpInterceptorService implements HttpInterceptor {
  private isLoggingOut = false;
  private isProbingMe = false;
  private rawHttp: HttpClient;

  constructor(
    public router: Router,
    private snackBar: MatSnackBar,
    private tokenService: TokenService,
    httpBackend: HttpBackend,
  ) {
    this.rawHttp = new HttpClient(httpBackend);
  }

  private doLogout(): void {
    this.tokenService.removeToken();
    this.isLoggingOut = true;
    void this.router.navigateByUrl("login");
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
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

        const url = error.url ?? req.url;
        const isUsersMe =
          url.endsWith("/users/me") ||
          url.endsWith("/users/me/") ||
          url.includes("/users/me?");

        if (error.status === 401) {
          console.warn("Not authorized for " + url);

          if (isUsersMe) {
            if (!this.isLoggingOut) {
              this.doLogout();
            }
            return EMPTY;
          }

          if (!this.isProbingMe && !this.isLoggingOut) {
            this.isProbingMe = true;

            const base = LocalConfigRenderer.getInstance().getApi().replace(/\/+$/, "");
            const token = this.tokenService.getToken();
            const headers = token
              ? new HttpHeaders({ Authorization: `Bearer ${token}` })
              : new HttpHeaders();

            this.rawHttp.get(`${base}/users/me`, { headers }).subscribe({
              next: () => {
                this.isProbingMe = false;
              },
              error: (meErr: unknown) => {
                this.isProbingMe = false;
                if (meErr instanceof HttpErrorResponse && meErr.status === 401 && !this.isLoggingOut) {
                  this.doLogout();
                }
              },
            });
          }
        }

        if (error.error && typeof error.error === "object" && "body" in (error.error as any)) {
          this.snackBar.open((error.error as any).body, "Ok", { duration: 10000 });
        }

        return throwError(() => error);
      }),
    );
  }
}
