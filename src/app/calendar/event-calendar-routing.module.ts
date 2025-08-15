import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {EventCalendarComponent} from "./event-calendar.component";

const routes: Routes = [
    {
        path: "calendar",
        component: EventCalendarComponent,
        data: {
            requiresLogin: true,
            shouldDetach: true
        }
    }
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EventCalendarRoutingModule {
}
