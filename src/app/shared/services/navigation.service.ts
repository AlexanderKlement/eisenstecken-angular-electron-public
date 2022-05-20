import {Injectable} from '@angular/core';
import {Location} from '@angular/common';
import {Router, NavigationEnd, RoutesRecognized} from '@angular/router';
import {filter, pairwise} from 'rxjs';

@Injectable({providedIn: 'root'})
export class NavigationService {
    private history: string[];
    private backEventInProgress = false;
    private ignoreNextRoute = false;

    constructor(private router: Router) {
        console.log('NavigationService initialized');
        this.history = [];
        this.router.events
            .pipe(filter((evt: any) => evt instanceof RoutesRecognized), pairwise())
            .subscribe((events: RoutesRecognized[]) => {
                this.history.push(events[0].urlAfterRedirects);
                console.log(this.history);
            });

        /*
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                if (!this.ignoreNextRoute) {
                    console.log('Adding site to history: ' + event.urlAfterRedirects);
                    this.history.push(event.urlAfterRedirects);
                    console.log(this.history);
                }
                this.ignoreNextRoute = false;
            }
        });

         */
    }

    back(): void {
        console.log('Navigation back called');
        this.dontAddNextRouteToHistory();
        if (this.history.length > 0) {
            console.log('Going back to ', this.history);
            this.router.navigateByUrl(this.history.pop(), {replaceUrl: true});
        } else {
            console.log('Going back to home');
            this.router.navigateByUrl('/', {replaceUrl: true});
        }

    }

    dontAddNextRouteToHistory(): void {
        this.ignoreNextRoute = true;
    }

    backEvent(): void {
        this.backEventInProgress = true;
    }

    home(): void {
        this.history = [];
        this.router.navigateByUrl('/');
    }

}
