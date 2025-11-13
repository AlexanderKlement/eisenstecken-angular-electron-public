import {Component,  OnInit} from "@angular/core";
import dayjs from "dayjs/esm";
import {Subject} from "rxjs";
import { DefaultLayoutDirective, DefaultLayoutAlignDirective, FlexModule, DefaultFlexDirective } from "ng-flex-layout";
import { MatToolbar } from "@angular/material/toolbar";
import { DefaultShowHideDirective } from "ng-flex-layout/extended";
import { MatIconButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from "@angular/material/table";
import { EventCalendarDayComponent } from "./event-calendar-day/event-calendar-day.component";

@Component({
    selector: 'app-event-calendar',
    templateUrl: './event-calendar.component.html',
    styleUrls: ['./event-calendar.component.scss'],
    imports: [DefaultLayoutDirective, DefaultLayoutAlignDirective, FlexModule, MatToolbar, DefaultFlexDirective, DefaultShowHideDirective, MatIconButton, MatIcon, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, EventCalendarDayComponent, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow]
})


export class EventCalendarComponent implements OnInit {

  selectedCalendarWeek: number;
  selectedYear: number;
  offset = 0;
  amountWeeks = 4;
  weeks: number[] = Array(this.amountWeeks).fill(0).map((x, i) => i);
  days: number[] = Array(6).fill(0).map((x, i) => i);
  dataSource = [];
  displayedColumns: string[] = [];

  updateSubject = new Subject<void>();

  constructor() {
  }

  weekTitle(weekIdx: string): string {
    const week = parseInt(weekIdx.replace("week", ""), 10);
    if (week === -1) {
      return "";
    }
    const date = dayjs().year(this.selectedYear).isoWeek(week);
    return "KW " + date.isoWeek() + " " + date.year();
  }

  dayTitle(day: number): string {
    const date = dayjs().isoWeekday(day + 1);
    return date.format("dddd");
  }

  ngOnInit(): void {
    this.changeWeek(0);
    setInterval(() => {
      this.updateDate();
    }, 900000); // 900000 milliseconds = 15 minutes
  }

  updateDate(): void {
    this.updateSubject.next();
  }



  changeWeek(weeksToAddSubtract: number): void {
    this.offset += weeksToAddSubtract;
    const date = dayjs().add(this.offset, "weeks");
    this.selectedCalendarWeek = date.isoWeek();
    this.selectedYear = date.year();
    this.displayedColumns = ["week-1"].concat(this.weeks.map((week) => `week${this.selectedCalendarWeek + week + this.offset}`));
    this.dataSource = this.days.map(day => {
      const row: Record<string, any> = {"week-1": this.dayTitle(day)};
      this.weeks.forEach((i) => {
        const week = this.selectedCalendarWeek + i + this.offset;
        row[`week${week}`] = {week, day};
      });
      return row;
    });
  }
}
