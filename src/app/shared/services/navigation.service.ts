import {Injectable} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';

@Injectable({providedIn: 'root'})
export class NavigationService {
    private history: string[] = [];
    private backEventInProgress = false;

    private blockBackEvent = false;

    private nextUrlIgnored = false;

    constructor(private router: Router) {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                history.pushState(null, null, null);
                if (!this.nextUrlIgnored && this.history[this.history.length - 1] !== event.urlAfterRedirects) {
                    console.log('NavigationEnd, Add Url: ' + event.urlAfterRedirects);
                    this.history.push(event.urlAfterRedirects);
                } else {
                    console.log('NavigationEnd, Ignore Url: ' + event.urlAfterRedirects);
                }
                console.log('New history: ', this.history);
            }
        });
    }

    public removeLastUrl(): void {
        console.log('Removing last url');
        this.history.pop();
        console.log(this.history);
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
            this.nextUrlIgnored = true;
            setTimeout(() => {
                this.router.navigateByUrl(lastHistoryEntry, {replaceUrl: true}).then(() => {
                    this.nextUrlIgnored = false;
                });
            }, 1);
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
