import {Injectable} from '@angular/core';
import {Location} from '@angular/common';
import {Router, NavigationEnd} from '@angular/router';

@Injectable({providedIn: 'root'})
export class NavigationService {
    private history: string[] = [];
    private backEventInProgress = false;

    private blockBackEvent = false;

    private nextUrlIgnored = false;

    constructor(private router: Router, private location: Location) {
        this.router.events.subscribe((event) => {
            history.pushState(null, '');
            if (event instanceof NavigationEnd) {
                console.log(event);
                console.info('Adding site to history: ' + event.urlAfterRedirects);
                console.info(this.history);
                if (this.history[this.history.length - 1] !== event.urlAfterRedirects) {
                    if (!this.nextUrlIgnored) {
                        this.history.push(event.urlAfterRedirects);
                        this.nextUrlIgnored = false;
                    }
                }

            }
        });
    }

    public ignoreNextUrl(): void {
        this.nextUrlIgnored = true;
    }


    removeCurrentFromHistory() {
        console.info('Removing current site from history');
        this.history.pop();
    }

    backEvent(): void {
        this.backEventInProgress = true;
    }

    home(): void {
        this.router.navigateByUrl('/');
    }

    back(): void {
        this.history.pop();
        if (this.history.length > 0) {
            const lastHistoryEntry = this.history[this.history.length - 1];
            console.log('History length > 0', this.history);
            console.log('Navigating to: ', lastHistoryEntry);
            this.ignoreNextUrl();
            this.router.navigateByUrl(lastHistoryEntry, {replaceUrl: true});
        } else {
            console.log('this.history.length == 0', this.history);
            this.home();
        }
    }

    setBlockBackEvent(value: boolean): void {
        console.log('Block Back Event', value);
        this.blockBackEvent = value;
    }

    getBlockBackEvent(): boolean {
        return this.blockBackEvent;
    }

}
