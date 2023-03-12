import {Injectable, OnDestroy} from '@angular/core';
import {CalendarEntry, DefaultService} from 'eisenstecken-openapi-angular-library';
import {Observable, Subscriber} from 'rxjs';
import {first} from 'rxjs/operators';
import {TrayService} from '../../services/tray.service';

export interface CalendarDayListElement {
    day: number;
    observer?: Observable<CalendarEntry[]>;
    subscriber?: Subscriber<CalendarEntry[]>;
    interval?: NodeJS.Timeout;
}

export interface CalendarListElement {
    id: number;
    days: CalendarDayListElement[];
}

@Injectable({
    providedIn: 'root'
})
export class CalendarService implements OnDestroy {

    minutesBetweenUpdate = 10;
    randomMaxSeconds = 100;

    private calendarList: CalendarListElement[] = [];

    private notificationInterval: NodeJS.Timeout;
    private notificationIntervalMinutes = 1;
    private notificationIntervalDistanceMinutes = 15;
    private calendarEntriesAlreadyNotified: number[] = [];

    constructor(private api: DefaultService, private tray: TrayService) {
        this.notificationInterval = setInterval(() => {
            this.api.readNextCalendarEntriesInCalendarNextTimeMinutesGet(this.notificationIntervalDistanceMinutes)
                .pipe(first()).subscribe((calendarEntries) => {
                for (const calendarEntry of calendarEntries) {
                    if (this.calendarEntriesAlreadyNotified.includes(calendarEntry.id)) {
                        continue;
                    }
                    //this.tray.showBalloon('Termin in Kürze:', calendarEntry.title);
                    this.calendarEntriesAlreadyNotified.push(calendarEntry.id);
                }
            });
        }, this.notificationIntervalMinutes * 1000 * 60);
    }

    ngOnDestroy(): void {
        clearInterval(this.notificationInterval);
    }

    public getCalendarEntries(calendarId: number, day: number): Observable<CalendarEntry[]> {
        const calendarDayListElement = this.findCalendarAndDay(calendarId, day);
        if (calendarDayListElement !== undefined) {
            return calendarDayListElement.observer;
        }
        return this.addObservable(calendarId, day);
    }

    public refreshCalendar(calendarId: number, day: number): void {
        const calendarDayListElement = this.findCalendarAndDay(calendarId, day);
        if (calendarDayListElement === undefined || calendarDayListElement.subscriber === undefined) {
            console.warn('Unable to refresh calendar day');
            console.warn(calendarDayListElement);
            return;
        }
        const subscriber = calendarDayListElement.subscriber;
        if (subscriber === undefined) {
            throw new Error('Subscriber is not defined yet');
        }
        this.api.readCalendarEntriesByDayCalendarCalendarsCalendarIdGet(calendarId, day)
            .pipe(first()).subscribe(calendarEntries => {
            subscriber.next(calendarEntries);
        });
    }

    private addObservable(calendarId: number, day: number): Observable<CalendarEntry[]> {
        let calendarListElement: CalendarListElement;
        for (const calendarListElementIterator of this.calendarList) {
            if (calendarListElementIterator.id === calendarId) {
                calendarListElement = calendarListElementIterator;
            }
        }
        if (calendarListElement === undefined) {
            calendarListElement = {
                id: calendarId,
                days: [],
            };
            this.calendarList.push(calendarListElement);
        }
        for (const calendarDayListElementIterator of calendarListElement.days) {
            if (calendarDayListElementIterator.day === day) {
                throw new Error('Could not add Observable, already present');
            }
        }
        const calendarDayListElement: CalendarDayListElement = {
            day
        };

        calendarListElement.days.push(calendarDayListElement);
        const observable = new Observable<CalendarEntry[]>((subscriber) => {
            calendarDayListElement.subscriber = subscriber;
            this.refreshCalendar(calendarId, day);
        });
        this.findCalendarAndDay(calendarId, day).interval = setInterval(() => {
            this.refreshCalendar(calendarId, day); // TODO: check if there a subscribers, else cancel timeout and delete stuff
        }, this.calculateIntervalMilliSeconds());
        calendarDayListElement.observer = observable;
        return observable;
    }

    private calculateIntervalMilliSeconds(): number {
        return Math.floor(this.minutesBetweenUpdate * 60 * 1000 + Math.random() * this.randomMaxSeconds);
    }

    private findCalendarAndDay(calendarId: number, day: number): CalendarDayListElement | undefined {
        for (const calendarListElement of this.calendarList) {
            if (calendarListElement.id === calendarId) {
                for (const calendarDayListElement of calendarListElement.days) {
                    if (calendarDayListElement.day === day) {
                        return calendarDayListElement;
                    }
                }
            }
        }
        return undefined;
    }
}
