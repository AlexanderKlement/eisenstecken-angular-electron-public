import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { first, tap } from "rxjs/operators";
import { Router } from "@angular/router";
import moment from "moment";
import { CalendarService } from "../calendar.service";
import { CalendarData, CalendarEditComponent } from "../calendar-edit/calendar-edit.component";
import { MatDialog } from "@angular/material/dialog";
import { DefaultService, CalendarEntry } from "../../../../../api/openapi";
import { LoadingComponent } from "../../loading/loading.component";
import { MatCard, MatCardContent } from "@angular/material/card";
import { NgClass, AsyncPipe } from "@angular/common";
import { DefaultClassDirective } from "ng-flex-layout/extended";
import { DefaultLayoutDirective, DefaultLayoutAlignDirective, DefaultFlexDirective } from "ng-flex-layout";

@Component({
    selector: 'app-calendar-day',
    templateUrl: './calendar-day.component.html',
    styleUrls: ['./calendar-day.component.scss'],
    imports: [LoadingComponent, MatCard, NgClass, DefaultClassDirective, MatCardContent, DefaultLayoutDirective, DefaultLayoutAlignDirective, DefaultFlexDirective, AsyncPipe]
})
export class CalendarDayComponent implements OnInit, OnDestroy {

  @Input() day: number;
  @Input() calendarId: number;
  @Input() public: boolean;

  calendarEntries$: Observable<CalendarEntry[]>;
  titleDayOfTheWeek: string;
  titleDay: string;

  loading = true;
  weekend = false;
  today = false;

  constructor(private api: DefaultService, private router: Router, private calendar: CalendarService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    const currentDayId = moment().add(this.day, "days").day();
    if (currentDayId === 6 || currentDayId === 0) {
      this.weekend = true;
    }
    if (this.day === 0) {
      this.today = true;
    }
    this.calendarEntries$ = this.calendar.getCalendarEntries(this.calendarId, this.day).pipe(
      tap(() => this.loading = false),
    );
    this.setTitle();
  }

  ngOnDestroy(): void {
  }

  onCalendarEntryClicked(id: number): void {
    const data: CalendarData = {
      calendarId: this.calendarId,
      calendarEntryId: id,
    };
    const dialogRef = this.dialog.open(CalendarEditComponent, {
      width: "700px",
      data,
    });
    dialogRef.afterClosed().pipe(first()).subscribe(result => {
      if (result !== undefined) {
        this.calendar.refreshCalendar(this.calendarId, this.day);
      }
    });
  }

  getCalendarStartEndTime(calendar: CalendarEntry): string {
    return moment(calendar.start_time).format("LT") + "-" + moment(calendar.end_time).format("LT");
  }

  private setTitle(): void {
    const todaysDate = moment().add(this.day, "days");
    this.titleDayOfTheWeek = todaysDate.format("dddd");
    this.titleDay = todaysDate.format("Do MMMM");
  }
}
