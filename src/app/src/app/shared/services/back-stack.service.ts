import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NavigationService } from '../../../../shared/services/navigation.service';

type BackHandler = () => boolean | void;

@Injectable({ providedIn: 'root' })
export class BackStackService {
  private stack: BackHandler[] = [];
  private renderer: Renderer2;

  constructor(
    rendererFactory: RendererFactory2,
    private router: Router,
    private navigation: NavigationService,
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);

    this.renderer.listen('window', 'keyup', (e: KeyboardEvent) => {
      if (e.code === 'Escape') this.dispatchBack();
    });

    this.router.events
      .pipe(filter((e): e is NavigationStart => e instanceof NavigationStart))
      .subscribe((e: NavigationStart) => {
        if (e.navigationTrigger === 'popstate') {
          const handler = this.stack[this.stack.length - 1];
          if (!handler) return; // nothing to intercept, let Router proceed

          const consumed = handler() === true;
          if (consumed) {
            // Cancel the browser back by restoring current URL
            // Using microtask to avoid re-entrancy
            Promise.resolve().then(() => {
              this.navigation.replaceCurrentWith(this.router.url);
            });
          } // else: let Router continue the natural back
        }
      });
  }

  push(handler: BackHandler): () => void {
    this.stack.push(handler);
    return () => {
      const i = this.stack.lastIndexOf(handler);
      if (i >= 0) this.stack.splice(i, 1);
    };
  }

  dispatchBack(): void {
    const handler = this.stack[this.stack.length - 1];
    if (handler) {
      const handled = handler();
      if (handled === true) return; // consumed
    }
    this.navigation.back();
  }
}
