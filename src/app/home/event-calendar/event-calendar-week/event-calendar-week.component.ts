import {Component, Input, OnChanges, OnInit} from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-event-calendar-week',
  templateUrl: './event-calendar-week.component.html',
  styleUrls: ['./event-calendar-week.component.scss']
})
export class EventCalendarWeekComponent implements OnInit {

  @Input() week: number;
  @Input() year: number;
  days: number[] = Array(7).fill(0).map((x, i) => i);

  constructor() {
  }

  weekTitle(): string {
    const date = moment().year(this.year).isoWeek(this.week);
    return 'KW ' + date.isoWeek() + ' ' + date.year();
  }

  ngOnInit(): void {
  }


}
