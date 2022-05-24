import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AccessGuard} from '../shared/services/access-guard.service';
import {ServiceComponent} from './service.component';

const routes: Routes = [{
    path: 'service',
    component: ServiceComponent,
    data: {
        requiresLogin: true
    },
    canActivate: [AccessGuard]
},];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ServiceRoutingModule {
}
