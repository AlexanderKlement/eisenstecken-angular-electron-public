import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { Location } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private stack: string[] = [];
  private replacing = false;
  private popping = false; // <-- NEW

  constructor(private router: Router, private location: Location) {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        const url = e.urlAfterRedirects;

        // debug
        console.log('Stack start');
        console.log(this.stack);
        console.log('Stack stop');

        if (!this.stack.length) {
          this.stack.push(url);
          return;
        }

        if (this.replacing) {
          // replace top (skip current)
          this.stack[this.stack.length - 1] = url;
          return;
        }

        if (this.popping) {
          // back landing: ensure top matches, don't push
          this.stack[this.stack.length - 1] = url;
          return;
        }

        const last = this.stack[this.stack.length - 1];
        if (url !== last) this.stack.push(url);
      });
  }

  navigate(url: string): void {
    this.replacing = false;
    this.popping = false;
    this.router.navigateByUrl(url);
  }

  replaceCurrentWith(url: string): void {
    this.replacing = true;
    this.popping = false;
    this.router.navigateByUrl(url, { replaceUrl: true })
      .finally(() => {
        this.replacing = false;
      });
  }

  back(): void {
    if (this.stack.length >= 2) {
      // pop current
      this.stack.pop();
      const prev = this.stack[this.stack.length - 1];
      this.popping = true;      // <-- mark as back landing
      this.replacing = false;
      this.router.navigateByUrl(prev, { replaceUrl: true })
        .finally(() => {
          this.popping = false;
        });
      return;
    }

    const navId = (history.state && (history.state as any).navigationId) || 0;
    if (navId > 1) {
      // fall back to browser back only if there is a browser-entry
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

  removeLastUrl(): void {
    if (this.stack.length >= 2) {
      this.stack.pop();
      const prev = this.stack[this.stack.length - 1];
      this.popping = true; // treat as back landing
      this.router.navigateByUrl(prev, { replaceUrl: true })
        .finally(() => {
          this.popping = false;
        });
    } else {
      this.home();
    }
  }
}
