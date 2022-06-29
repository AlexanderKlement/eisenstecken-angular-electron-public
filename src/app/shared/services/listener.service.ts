import {Injectable, Renderer2, RendererFactory2} from '@angular/core';
import {NavigationService} from './navigation.service';

@Injectable({
    providedIn: 'root'
})
export class ListenerService {

    renderer: Renderer2;

  private history: string[] = [];


  constructor(private rendererFactory2: RendererFactory2, private navigation: NavigationService) {
        this.renderer = this.rendererFactory2.createRenderer(null, null);
        this.renderer.listen('window', 'popstate', (event) => {
            console.log('popstate');
            this.navigation.back();
        });

        this.renderer.listen('document','unload',(event)=>{
          console.log(event);
        });

        this.renderer.listen('window', 'keyup', (event) => {
            console.log(event);
            if (event.code === 'Escape') {
                this.navigation.back();
            }
        });

    }


}
