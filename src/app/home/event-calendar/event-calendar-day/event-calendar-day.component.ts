import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import * as moment from 'moment';
import {CompanyEvent, CompanyEventEnum, DefaultService} from 'eisenstecken-openapi-angular-library';
import {MatDialog} from '@angular/material/dialog';
import {
  EventCalendarDialogComponent,
  getEventTranslation
} from '../event-calendar-dialog/event-calendar-dialog.component';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-event-calendar-day',
  templateUrl: './event-calendar-day.component.html',
  styleUrls: ['./event-calendar-day.component.scss']
})
export class EventCalendarDayComponent implements OnInit, OnChanges {

  @Input() week: number;
  @Input() day: number;
  @Input() year: number;

  date: moment.Moment;
  dateFormatted: string;
  isoDateString: string;

  events: CompanyEvent[] = [];

  constructor(private api: DefaultService, public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.isoDateString = this.date.format('YYYY-MM-DD');
    this.updateDate();
    this.api.readCompanyEventByDateCompanyEventGet(this.isoDateString).subscribe(events => {
      this.events = events;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateDate();
  }

  addEvent() {
    const dialogRef = this.dialog.open(EventCalendarDialogComponent, {
      data: {
        date: this.isoDateString,
      },
    });
    dialogRef.afterClosed().pipe(first()).subscribe(_ => {
      this.updateDate();
    });

  }


  editEvent(eventId: number) {
    const dialogRef = this.dialog.open(EventCalendarDialogComponent, {
      data: {
        id: eventId,
        date: this.isoDateString
      },
    });
    dialogRef.afterClosed().pipe(first()).subscribe(_ => {
      this.updateDate();
    });
  }

  private updateDate(): void {
    this.date = moment().year(this.year).isoWeek(this.week).isoWeekday(this.day + 1);

    this.dateFormatted = this.date.format('dddd, DD.MM');
  }
}
