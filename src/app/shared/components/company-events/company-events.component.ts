import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {
    CalendarEvent,
    CalendarEventAction,
    CalendarEventTimesChangedEvent,
    CalendarView,
} from 'angular-calendar';
import {Subject} from 'rxjs';
import {CompanyEvent, DefaultService} from 'eisenstecken-openapi-angular-library';
import {first} from 'rxjs/operators';
import * as moment from 'moment';
import {colors} from './company-event-colors';
import {MatDialog} from '@angular/material/dialog';
import {CompanyEventEditDialogComponent} from './company-event-edit-dialog/company-event-edit-dialog.component';


@Component({
    selector: 'app-company-events',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './company-events.component.html',
    styleUrls: ['./company-events.component.scss']
})
export class CompanyEventsComponent implements OnInit, OnDestroy {

    view: CalendarView = CalendarView.Month;

    calendarView = CalendarView;

    viewDate: Date = new Date();

    refresh = new Subject<void>();

    activeDayIsOpen = true;

    currentYear: number;

    //TODO: dont forget to update events if current year changes

    refreshTimeout: NodeJS.Timeout;
    refreshIntervalSeconds = 10;
    events: CalendarEvent[] = [];
    actions: CalendarEventAction[] = [
        {
            label: '<i class="fas fa-fw fa-pencil-alt"></i>',
            a11yLabel: 'Edit',
            onClick: ({event}: { event: CalendarEvent }): void => {
                this.handleEvent('Edited', event);
            },
        },
        {
            label: '<i class="fas fa-fw fa-trash-alt"></i>',
            a11yLabel: 'Delete',
            onClick: ({event}: { event: CalendarEvent }): void => {
                this.events = this.events.filter((iEvent) => iEvent !== event);
                this.handleEvent('Deleted', event);
            },
        },
    ];

    constructor(private api: DefaultService, public dialog: MatDialog) {

    }

    ngOnInit() {
        this.currentYear = this.viewDate.getFullYear();
        this.loadCalendarEvents();
        this.refreshTimeout = setInterval(() => {
            this.loadCalendarEvents();
        }, this.refreshIntervalSeconds * 1000);
    }

    ngOnDestroy() {
        clearInterval(this.refreshTimeout);
    }

    public loadCalendarEvents(): void {
        this.api.readCompanyEventsByYearCompanyEventYearYearGet(this.currentYear)
            .pipe(first()).subscribe((companyEvents) => {
            this.events = this.transformCompanyEventsToCalendarEvents(companyEvents);
            this.refresh.next();
        });
    }

    dayClicked({date, events}: { date: Date; events: CalendarEvent[] }): void {
        if (moment(date).isSame(this.viewDate, 'month')) {
            this.activeDayIsOpen = !((moment(this.viewDate).isSame(date, 'day') && this.activeDayIsOpen === true) ||
                events.length === 0);
            this.viewDate = date;
        }
    }

    eventTimesChanged({event, newStart, newEnd,}: CalendarEventTimesChangedEvent): void {
        console.log('EventTimesChanged', event, newStart, newEnd);
    }

    handleEvent(action: string, event: CalendarEvent): void {
        console.log('HandlingEvent', action, event);
        let dialog;
        if (action === 'Edit') {
            dialog = this.dialog.open(CompanyEventEditDialogComponent, {
                width: '400px',
                data: {id: event.id}
            });
        } else if (action === 'Delete') {
            this.deleteEvent(event);
        } else if (action === 'Create') {
            dialog = this.dialog.open(CompanyEventEditDialogComponent, {
                width: '400px',
                data: {id: -1}
            });
        } else {
            console.warn('Wrong action', action);
            return;
        }
        if (typeof dialog !== 'undefined') {
            dialog.afterClosed().subscribe((result) => {
                console.log(result);
                if (typeof result !== 'undefined' && result.hasOwnProperty('action')) {
                    switch (result.action) {
                        case 'refresh':
                            this.loadCalendarEvents();
                            break;
                        case'delete':
                            this.deleteEventById(result.id);
                    }
                }
            });

        }


    }


    deleteEvent(eventToDelete: CalendarEvent) {
        if (typeof eventToDelete.id === 'number') {
            this.deleteEventById(eventToDelete.id);
        }
    }

    deleteEventById(id: number) {
        this.api.deleteCompanyEventCompanyEventCompanyEventIdDelete(id)
            .pipe(first()).subscribe((success) => {
            if (success) {
                this.loadCalendarEvents();
            }
        });
    }

    setView(view: CalendarView) {
        this.view = view;
    }

    closeOpenMonthViewDay() {
        this.activeDayIsOpen = false;
    }

    private transformCompanyEventsToCalendarEvents(companyEvents: CompanyEvent[]) {
        const newCompanyEvents: CalendarEvent[] = [];
        for (const companyEvent of companyEvents) {
            newCompanyEvents.push({
                id: companyEvent.id,
                start: new Date(companyEvent.start_time),
                end: new Date(companyEvent.end_time),
                title: companyEvent.title,
                color: colors[companyEvent.color],
                actions: this.actions,
                allDay: companyEvent.all_day
            });
        }
        return newCompanyEvents;
    }
}
