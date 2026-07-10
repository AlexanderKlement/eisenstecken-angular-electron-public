import { Component, inject, Input, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { first, tap } from "rxjs/operators";
import dayjs from "dayjs/esm";
import { CalendarService } from "../calendar.service";
import { CalendarData, CalendarEditComponent } from "../calendar-edit/calendar-edit.component";
import { MatDialog } from "@angular/material/dialog";
import { CalendarEntry } from "../../../../../api/openapi";
import { AsyncPipe, NgClass } from "@angular/common";
import { DefaultClassDirective } from "ng-flex-layout/extended";

@Component({
  selector: "app-calendar-day",
  templateUrl: "./calendar-day.component.html",
  styleUrls: ["./calendar-day.component.scss"],
  imports: [
    NgClass,
    DefaultClassDirective,
    AsyncPipe
  ]
})
export class CalendarDayComponent implements OnInit {
  private calendar = inject(CalendarService);
  private dialog = inject(MatDialog);

  @Input() day: number;
  @Input() calendarId: number;
  @Input() public: boolean;

  calendarEntries$: Observable<CalendarEntry[]>;
  titleDayOfTheWeek: string;
  titleDay: string;

  loading = true;
  weekend = false;
  today = false;

  ngOnInit(): void {
    const currentDayId = dayjs().add(this.day, "days").day();
    if (currentDayId === 6 || currentDayId === 0) {
      this.weekend = true;
    }
    if (this.day === 0) {
      this.today = true;
    }
    this.calendarEntries$ = this.calendar
      .getCalendarEntries(this.calendarId, this.day)
      .pipe(tap(() => (this.loading = false)));
    this.setTitle();
  }

  onCalendarEntryClicked(id: number): void {
    const data: CalendarData = {
      calendarId: this.calendarId,
      calendarEntryId: id
    };
    const dialogRef = this.dialog.open(CalendarEditComponent, {
      width: "700px",
      data
    });
    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe((result) => {
        if (result !== undefined) {
          this.calendar.refreshCalendar(this.calendarId, this.day);
        }
      });
  }

  getCalendarStartEndTime(calendar: CalendarEntry): string {
    return (
      dayjs(calendar.start_time).format("LT") +
      "-" +
      dayjs(calendar.end_time).format("LT")
    );
  }

  private setTitle(): void {
    const todaysDate = dayjs().add(this.day, "days");
    this.titleDayOfTheWeek = todaysDate.format("dddd");
    this.titleDay = todaysDate.format("DD. MMMM");
  }
}
