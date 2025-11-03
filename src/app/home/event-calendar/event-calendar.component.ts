import {Component, NgZone, OnInit} from "@angular/core";
import moment from "moment";
import {Subject} from "rxjs";

@Component({
    selector: 'app-event-calendar',
    templateUrl: './event-calendar.component.html',
    styleUrls: ['./event-calendar.component.scss'],
    standalone: false
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
    const date = moment().year(this.selectedYear).isoWeek(week);
    return "KW " + date.isoWeek() + " " + date.year();
  }

  dayTitle(day: number): string {
    const date = moment().isoWeekday(day + 1);
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
    const date = moment().add(this.offset, "weeks");
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
