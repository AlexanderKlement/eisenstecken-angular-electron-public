import {Component, Input, OnInit} from "@angular/core";
import {DayManager} from "./day.manager";
import {MatDialog} from "@angular/material/dialog";
import {CalendarData, CalendarEditComponent} from "./calendar-edit/calendar-edit.component";
import {first} from "rxjs/operators";
import {CalendarService} from "./calendar.service";
import dayjs from "dayjs/esm";
import {AuthService} from "../../services/auth.service";
import { DefaultLayoutDirective, DefaultLayoutAlignDirective, FlexModule, DefaultFlexDirective, DefaultLayoutGapDirective } from "ng-flex-layout";
import { MatToolbar } from "@angular/material/toolbar";
import { DefaultShowHideDirective } from "ng-flex-layout/extended";
import { MatIconButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { CalendarDayComponent } from "./calendar-day/calendar-day.component";

@Component({
    selector: 'app-calendar',
    templateUrl: './simple-calendar.component.html',
    styleUrls: ['./simple-calendar.component.scss'],
    imports: [DefaultLayoutDirective, DefaultLayoutAlignDirective, FlexModule, MatToolbar, DefaultFlexDirective, DefaultShowHideDirective, MatIconButton, MatIcon, DefaultLayoutGapDirective, CalendarDayComponent]
})
export class SimpleCalendarComponent implements OnInit {

    @Input() calendarId: number;
    @Input() public: boolean;

    createMode = false;
    dayManager: DayManager;

    amountOfDays: string;
    createAllowed = false;


    constructor(public dialog: MatDialog, private calendar: CalendarService, private authService: AuthService) {
        this.dayManager = new DayManager(0, 7, true);
        this.amountOfDays = this.dayManager.amountOfDaysString;
    }

    ngOnInit(): void {
        this.authService.currentUserHasRight("calendars:create").pipe(first()).subscribe(allowed => {
            this.createAllowed = allowed;
        });
    }

    previousWeekClicked(): void {
        this.dayManager.moveStartDayLeft();
    }

    nextWeekClicked(): void {
        this.dayManager.moveStartDayRight();
    }

    todayClicked(): void {
        this.dayManager.setStartDay(0);
    }

    amountOfDaysChanged(): void {
        this.dayManager.setAmountOfDays(parseInt(this.amountOfDays, 10));
    }

    newMeetingClicked(): void {
        const data: CalendarData = {
            calendarId: this.calendarId
        };
        const dialogRef = this.dialog.open(CalendarEditComponent, {
            width: "700px",
            data,
        });

        dialogRef.afterClosed().pipe(first()).subscribe(result => {
            if (result !== undefined) {
                const date = dayjs(result.start_time);
                const now = dayjs();
                this.calendar.refreshCalendar(parseInt(result.calendar.id, 10), date.diff(now, "days"));
            }
        });
    }

}
