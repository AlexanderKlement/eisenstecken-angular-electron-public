import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Observable} from "rxjs";
import {AuthService} from "./auth.service";
import {ElectronService} from "../../core/services";

@Injectable({
    providedIn: 'root'
})
export class AccessGuard implements CanActivate {

    limitAccessHosts: string[] = [
        "stunden.eisenstecken.kivi.bz.it",
        "timedev.app.eisenstecken.it",
        "time.app.eisenstecken.it"
    ];

    constructor(private authService: AuthService, private router: Router, private electron: ElectronService) {
    }

    public static urlStartsWith(route: ActivatedRouteSnapshot, url: string): boolean {
        if (route.url.length > 0) {
            return route.url[0].path.startsWith(url);
        }
        return false;
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const requiresLogin = route.data.requiresLogin || true;
        if (requiresLogin) {
            if (!this.authService.isLoggedIn()) {
                console.warn("Not logged in!");
                return this.router.parseUrl("login");
            }
        }
        return this.redirectWorkHours(route);
    }

    private redirectWorkHours(route: ActivatedRouteSnapshot): boolean | UrlTree {
        if (this.limitAccessHosts.includes(window.location.hostname)) {
            if (!AccessGuard.urlStartsWith(route, "mobile")) {
                if (!this.electron.isElectron) {
                    return this.router.parseUrl("mobile");
                }
            }
        }
        return true;
    }

}
