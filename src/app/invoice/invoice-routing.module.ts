import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {InvoiceComponent} from './invoice.component';
import {AccessGuard} from '../shared/services/access-guard.service';
import {IngoingDetailComponent} from './ingoing/ingoing-detail/ingoing-detail.component';

const routes: Routes = [
    {
        path: 'invoice',
        component: InvoiceComponent,
        data: {
            requiresLogin: true,
            shouldDetach: true
        }
    },
    {
        path: 'invoice/ingoing/:id',
        component: IngoingDetailComponent,
        data: {
            requiresLogin: true,
            shouldDetach: true
        },
        canActivate: [AccessGuard],
        canDeactivate: [AccessGuard]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InvoiceRoutingModule {
}
