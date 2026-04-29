import { Injectable, PLATFORM_ID, inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { AuthStateService } from "./auth-state.service";
import { ElectronService } from "../../core/services";
import { isPlatformBrowser } from "@angular/common";

@Injectable({ providedIn: 'root' })
export class AccessGuard implements CanActivate {
  private authService = inject(AuthStateService);
  private router = inject(Router);
  private electron = inject(ElectronService);
  private platformId = inject<Object>(PLATFORM_ID);


  private readonly limitAccessHosts: string[] = [
    "stunden.eisenstecken.kivi.bz.it",
    "timedev.app.eisenstecken.it",
    "time.app.eisenstecken.it",
  ];

  canActivate(
    route: ActivatedRouteSnapshot,
    _: RouterStateSnapshot,
  ): boolean | UrlTree {
    // default: requires login unless explicitly set to false
    const requiresLogin = route.data?.requiresLogin !== false;

    if (requiresLogin && !this.authService.isLoggedIn()) {
      console.warn("Not logged in!");
      return this.router.createUrlTree(["login"]);
    }

    return this.redirectWorkHours(route);
  }

  private redirectWorkHours(route: ActivatedRouteSnapshot): boolean | UrlTree {
    // SSR-safe window access
    if (!isPlatformBrowser(this.platformId)) return true;

    const hostname = window.location.hostname;
    if (!this.limitAccessHosts.includes(hostname)) return true;

    // allow /mobile routes, or Electron app
    const firstSeg = route.url[0]?.path ?? "";
    if (firstSeg.startsWith("mobile") || this.electron.isElectron) return true;

    return this.router.createUrlTree(["mobile"]);
  }
}
