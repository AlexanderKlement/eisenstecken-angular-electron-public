import { Component, inject, Input, OnInit } from "@angular/core";
import { DayManager } from "./day.manager";
import { MatDialog } from "@angular/material/dialog";
import { CalendarData, CalendarEditComponent } from "./calendar-edit/calendar-edit.component";
import { first } from "rxjs/operators";
import { CalendarService } from "./calendar.service";
import dayjs from "dayjs/esm";
import { AuthStateService } from "../../services/auth-state.service";
import { FlexModule } from "ng-flex-layout";
import { CalendarDayComponent } from "./calendar-day/calendar-day.component";
import { CircleIconButtonComponent } from "../circle-icon-button/circle-icon-button.component";
import { ScopeEnum } from "../../../../api/openapi";

@Component({
  selector: "app-calendar",
  templateUrl: "./simple-calendar.component.html",
  styleUrls: ["./simple-calendar.component.scss"],
  imports: [
    FlexModule,
    CalendarDayComponent,
    CircleIconButtonComponent
  ]
})
export class SimpleCalendarComponent implements OnInit {
  dialog = inject(MatDialog);
  private calendar = inject(CalendarService);
  private authService = inject(AuthStateService);

  @Input() calendarId: number;
  @Input() public: boolean;

  createMode = false;
  dayManager: DayManager;

  amountOfDays: string;
  createAllowed = false;

  constructor() {
    this.dayManager = new DayManager(0, 7, true);
    this.amountOfDays = this.dayManager.amountOfDaysString;
  }

  ngOnInit(): void {
    this.authService
      .currentUserHasScope(ScopeEnum.Office)
      .pipe(first())
      .subscribe((allowed) => {
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
      data
    });

    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe((result) => {
        if (result !== undefined) {
          const date = dayjs(result.start_time);
          const now = dayjs();
          this.calendar.refreshCalendar(
            parseInt(result.calendar.id, 10),
            date.diff(now, "days")
          );
        }
      });
  }
}
