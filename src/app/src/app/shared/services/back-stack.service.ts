import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Location } from '@angular/common';

type BackHandler = () => boolean | void; // return true if you handled the back

@Injectable({ providedIn: 'root' })
export class BackStackService {
  private stack: BackHandler[] = [];
  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2, private location: Location) {
    this.renderer = rendererFactory.createRenderer(null, null);

    // Browser/Android back: give the top handler a chance to consume it
    this.location.subscribe(() => this.dispatchBack());

    // Optional: treat ESC as "back"
    this.renderer.listen('window', 'keyup', (e: KeyboardEvent) => {
      if (e.code === 'Escape') this.dispatchBack();
    });
  }

  /** Register a handler; returns a disposer to remove it */
  push(handler: BackHandler): () => void {
    this.stack.push(handler);
    return () => {
      const i = this.stack.lastIndexOf(handler);
      if (i >= 0) this.stack.splice(i, 1);
    };
  }

  /** Manually trigger a back (e.g., from a button) */
  dispatchBack(): void {
    const handler = this.stack[this.stack.length - 1];
    if (handler) {
      const handled = handler();
      if (handled === true) return; // consumed by top-of-stack
    }
    // Not handled: let normal app back happen
    this.location.back();
  }
}
