import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from "@angular/common/http";
import { EMPTY, Observable, throwError } from "rxjs";
import { catchError, } from "rxjs/operators";
import { Router } from "@angular/router";
import { MatLegacySnackBar as MatSnackBar } from "@angular/material/legacy-snack-bar";
import { AuthService } from "./shared/services/auth.service";

@Injectable()
export class GlobalHttpInterceptorService implements HttpInterceptor {

  constructor(public router: Router, private snackBar: MatSnackBar, private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(
      catchError((error) => {
        console.error("Intercepting error");
        console.error(error);
        if (error.status === 404) {
          console.warn("Not sending error message");
          return EMPTY;
        }


        if (error.status === 401) {
          console.warn("Not authorized for " + error.url);
          if (error.endsWith("/users/me")) {
            this.authService.doLogout();
          }
        }

        if ("error" in error && "body" in error.error) {
          this.snackBar.open(error.error.body, "Ok", {
            duration: 10000
          });
        }
        return throwError(error.message);
      })
    );
  }
}
