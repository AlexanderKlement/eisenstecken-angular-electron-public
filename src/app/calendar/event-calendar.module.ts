import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {EventCalendarRoutingModule} from './event-calendar-routing.module';
import {EventCalendarComponent} from './event-calendar.component';
import {SharedModule} from '../shared/shared.module';


@NgModule({
    declarations: [
        EventCalendarComponent
    ],
    imports: [
        CommonModule,
        EventCalendarRoutingModule,
        SharedModule
    ]
})
export class EventCalendarModule {
}
