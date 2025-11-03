import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { filter } from 'rxjs/operators';
import { BackStackService } from '../../src/app/shared/services/back-stack.service';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private previousUrl: string | null = null;
  private currentUrl: string | null = null;

  constructor(
    private router: Router,
    private location: Location,
    private backStack: BackStackService
  ) {
    // Track current & previous URL without touching browser history
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        this.previousUrl = this.currentUrl;
        this.currentUrl = e.urlAfterRedirects;
      });
  }

  /** Go back: give BackStack handlers first chance; otherwise Location.back() */
  back(): void {
    // This will call the top handler if present; if not handled, Location.back()
    this.backStack.dispatchBack();
  }

  /** Go home */
  home(): void {
    this.router.navigateByUrl('/');
  }

  /**
   * Remove the current URL (drop it) and go to the previous URL with replaceUrl.
   * If there's no previous URL, go home.
   */
  removeLastUrl(): void {
    if (this.previousUrl) {
      this.router.navigateByUrl(this.previousUrl, { replaceUrl: true });
      // After replacing, make bookkeeping consistent
      this.currentUrl = this.previousUrl;
      this.previousUrl = null; // optional: or keep a ring buffer if you need deeper drops
    } else {
      this.home();
    }
  }
}
