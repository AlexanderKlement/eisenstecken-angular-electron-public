import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';
import {ElectronService} from '../../core/services';

@Injectable({
    providedIn: 'root'
})
export class AccessGuard implements CanActivate {

    limitAccessHosts: string[] = [
        'stunden.eisenstecken.kivi.bz.it',
        'timedev.app.eisenstecken.it',
        'time.app.eisenstecken.it'
    ];

    constructor(private authService: AuthService, private router: Router, private electron: ElectronService) {
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const requiresLogin = route.data.requiresLogin || true;
        if (requiresLogin) {
            if (!this.authService.isLoggedIn()) {
                this.router.navigate(['login']);
            }
        }
        this.redirectWorkHours();
        return true;
    }

    private redirectWorkHours(): void {
        console.log('Host is: ' + window.location.hostname);
        if (this.limitAccessHosts.includes(window.location.hostname)) {
            // eslint-disable-next-line no-console
            console.info('LIMITED ACCESS HOST');
            if (!this.router.url.startsWith('/mobile') || !this.router.url.startsWith('/login')) {
                console.log('URL starts not  with mobile or login', this.router.url);
                if (!this.electron.isElectron) {
                    console.log('Not electron: navigating!');
                    //this.router.navigateByUrl('mobile', {replaceUrl: true}); //before introducing this again, s
                } else {
                    console.log(this.electron);
                }
            }
        } else {
            console.log('Internal Route');
        }
    }

}
