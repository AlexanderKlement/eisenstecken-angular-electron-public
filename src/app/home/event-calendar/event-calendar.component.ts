import {Component, OnInit} from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-event-calendar',
  templateUrl: './event-calendar.component.html',
  styleUrls: ['./event-calendar.component.scss']
})
export class EventCalendarComponent implements OnInit {

  selectedCalendarWeek: number;
  selectedYear: number;
  offset = 0;
  amountWeeks = 4;
  weeks: number[] = Array(this.amountWeeks).fill(0).map((x, i) => i);

  constructor() {
  }

  ngOnInit(): void {
    this.changeWeek(0);
  }

  changeWeek(weeksToAddSubtract: number): void {
    this.offset += weeksToAddSubtract;
    const date = moment().add(this.offset, 'weeks');
    this.selectedCalendarWeek = date.isoWeek();
    this.selectedYear = date.year();
  }
}
