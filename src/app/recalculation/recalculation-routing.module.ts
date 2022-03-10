import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RecalculationComponent} from './recalculation.component';
import {RecalculationDetailComponent} from './recalculation-detail/recalculation-detail.component';
import {RecalculationEditComponent} from './recalculation-edit/recalculation-edit.component';
import {PaintTemplateComponent} from './paint-template/paint-template.component';

const routes: Routes = [
    {
        path: 'recalculation',
        component: RecalculationComponent,
        data: {
            requiresLogin: true,
            shouldDetach: true
        }
    },
    {
        path: 'recalculation/:id',
        component: RecalculationDetailComponent,
        data: {
            requiresLogin: true,
            shouldDetach: true
        }
    },
    {
        path: 'recalculation/edit/:id/:job_id',
        component: RecalculationEditComponent,
        data: {requiresLogin: true}
    },
    {
        path: 'paint-template',
        component: PaintTemplateComponent,
        data: {requiresLogin: true}
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RecalculationRoutingModule {
}
