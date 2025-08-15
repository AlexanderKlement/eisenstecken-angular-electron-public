import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {AccessGuard} from "../shared/services/access-guard.service";
import {MobileAppComponent} from "./mobile-app.component";
import {HoursComponent} from "./hours/hours.component";
import {RedirectComponent} from "./hours/redirect/redirect.component";

const routes: Routes = [
    {
        path: "mobile",
        component: MobileAppComponent,
        data: {
            requiresLogin: true
        },
        canActivate: [AccessGuard]
    },
    {
        path: "mobile/hours",
        component: HoursComponent,
        data: {
            requiresLogin: true
        },
        canActivate: [AccessGuard]
    },
    {
        path: "mobile/hours/redirect",
        component: RedirectComponent,
        data: {
            requiresLogin: true
        },
        canActivate: [AccessGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MobileAppRoutingModule {
}
