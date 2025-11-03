import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { NavigationService } from '../../../../shared/services/navigation.service';

type BackHandler = () => boolean | void; // return true if handled

@Injectable({ providedIn: 'root' })
export class BackStackService {
  private stack: BackHandler[] = [];
  private renderer: Renderer2;

  constructor(
    rendererFactory: RendererFactory2,
    private navigation: NavigationService, // <-- use this instead of Location.back()
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);

    // Browser/Android back
    window.addEventListener('popstate', () => this.dispatchBack());

    // ESC as back
    this.renderer.listen('window', 'keyup', (e: KeyboardEvent) => {
      if (e.code === 'Escape') this.dispatchBack();
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
    // Not handled -> use your NavigationService logic
    this.navigation.back(); // <-- important change
  }
}
