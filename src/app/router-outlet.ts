import {ComponentRef, Directive} from "@angular/core";
import {ActivatedRoute, RouterOutlet} from "@angular/router";

@Directive({ selector: 'app-router-outlet' })
export class AppRouterOutletDirective extends RouterOutlet {

    detach(): ComponentRef<any> {
        const instance: any = this.component;
        if (instance && typeof instance.onDetach === "function") {
            instance.onDetach();
        }
        return super.detach();
    }

    attach(ref: ComponentRef<any>, activatedRoute: ActivatedRoute): void {
        super.attach(ref, activatedRoute);
        //console.log('Check to attach');
        //console.log(ref, activatedRoute);
        if (ref.instance && typeof ref.instance.onAttach === "function") {
            ref.instance.onAttach(ref, activatedRoute);
        }
    }
}
