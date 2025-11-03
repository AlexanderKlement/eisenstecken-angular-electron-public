import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private stack: string[] = [];
  private replacing = false;

  constructor(private router: Router, private location: Location) {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        const url = e.urlAfterRedirects;

        if (!this.stack.length) {
          this.stack.push(url);
          return;
        }

        if (this.replacing) {
          // we’re replacing the top entry (skip current page)
          this.stack[this.stack.length - 1] = url;
        } else {
          const last = this.stack[this.stack.length - 1];
          if (url !== last) this.stack.push(url);
        }
      });
  }

  /** Normal forward nav that grows history */
  navigate(url: string): void {
    this.replacing = false;
    this.router.navigateByUrl(url);
  }

  /** Replace the current page with `url` (skip current in history) */
  replaceCurrentWith(url: string): void {
    this.replacing = true;

    this.router.navigateByUrl(url, { replaceUrl: true }).finally(() => {
      this.replacing = false;
    });
  }

  back(): void {
    if (this.stack.length >= 2) {
      this.stack.pop();
      const prev = this.stack[this.stack.length - 1];
      this.router.navigateByUrl(prev, { replaceUrl: true });
      return;
    }

    const navId = (history.state && (history.state as any).navigationId) || 0;
    if (navId > 1) {
      this.location.back();
    } else {
      this.router.navigateByUrl('/', { replaceUrl: true });
      this.stack = ['/'];
    }
  }

  home(): void {
    this.router.navigateByUrl('/', { replaceUrl: true });
    this.stack = ['/'];
  }

  /** Optional: drop current and go to previous */
  removeLastUrl(): void {
    if (this.stack.length >= 2) {
      this.stack.pop();
      const prev = this.stack[this.stack.length - 1];
      this.router.navigateByUrl(prev, { replaceUrl: true });
    } else {
      this.home();
    }
  }
}
