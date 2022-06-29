import {Injectable, Renderer2, RendererFactory2} from '@angular/core';
import {NavigationService} from './navigation.service';
import {Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ListenerService {

    renderer: Renderer2;
    navigationBackAllowed = true;

    backNotifySubject$: Subject<void>;


    constructor(private rendererFactory2: RendererFactory2, private navigation: NavigationService) {
        this.backNotifySubject$ = new Subject<void>();
        this.renderer = this.rendererFactory2.createRenderer(null, null);
        this.renderer.listen('window', 'popstate', (event) => {
            this.goBack();
        });

        this.renderer.listen('window', 'keyup', (event) => {
            if (event.code === 'Escape') {
                this.goBack();
            }
        });
    }

    public blockAndNotifyBack(): Subject<void> {
        this.navigationBackAllowed = false;
        return this.backNotifySubject$;
    }

    private goBack(): void {
        if (this.navigationBackAllowed) {
            this.navigation.back();
        } else {
            this.backNotifySubject$.next();
        }
    }


}
