import {Injectable} from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    CanDeactivate, NavigationStart,
    Router,
    RouterStateSnapshot,
    UrlTree
} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';
import {ElectronService} from '../../core/services';

export type CanDeactivateComponent = any;

@Injectable({
    providedIn: 'root'
})
export class AccessGuard implements CanActivate, CanDeactivate<any> {

    limitAccessHosts: string[] = [
        'stunden.eisenstecken.kivi.bz.it',
        'timedev.app.eisenstecken.it',
        'time.app.eisenstecken.it'
    ];

    backButtonPressed = false;

    constructor(private authService: AuthService, private router: Router, private electron: ElectronService) {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationStart) {
                if (event.navigationTrigger === 'popstate') {
                    console.log('Detected Popstate event');
                    this.backButtonPressed = true;
                }
            }
        });
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
                console.warn('Not logged in!');
                return this.router.parseUrl('login');
            }
        }
        return this.redirectWorkHours(route);
    }

    canDeactivate(component: any, currentRoute: ActivatedRouteSnapshot,
                  currentState: RouterStateSnapshot, nextState: RouterStateSnapshot) {
        // Allow navigation only if the user is not going back
        if(this.backButtonPressed) {
            console.log('Prevent navigation on Backbutton pressed');
            this.backButtonPressed = false;
            return false;
        }
        console.log('Allowing navigation');
        return true;
    }

    private redirectWorkHours(route: ActivatedRouteSnapshot): boolean | UrlTree {
        if (this.limitAccessHosts.includes(window.location.hostname)) {
            if (!AccessGuard.urlStartsWith(route, 'mobile')) {
                if (!this.electron.isElectron) {
                    return this.router.parseUrl('mobile');
                }
            }
        }
        return true;
    }

}
