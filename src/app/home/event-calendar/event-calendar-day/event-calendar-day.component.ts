import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from "@angular/core";
import moment from "moment";
import {MatDialog} from "@angular/material/dialog";
import {
  EventCalendarDialogComponent,
  getEventTranslation
} from "../event-calendar-dialog/event-calendar-dialog.component";
import {first} from "rxjs/operators";
import {Subject, Subscription} from "rxjs";
import {AuthService} from "../../../shared/services/auth.service";
import {DefaultService, CompanyEvent, CompanyEventEnum} from "../../../../api/openapi";
import { DefaultLayoutDirective, DefaultLayoutAlignDirective } from "ng-flex-layout";
import { NgClass } from "@angular/common";
import { DefaultClassDirective } from "ng-flex-layout/extended";
import { MatIcon } from "@angular/material/icon";
import { EventCalendarEventComponent } from "../event-calendar-event/event-calendar-event.component";

@Component({
    selector: 'app-event-calendar-day',
    templateUrl: './event-calendar-day.component.html',
    styleUrls: ['./event-calendar-day.component.scss'],
    imports: [DefaultLayoutDirective, DefaultLayoutAlignDirective, NgClass, DefaultClassDirective, MatIcon, EventCalendarEventComponent]
})
export class EventCalendarDayComponent implements OnInit, OnChanges, OnDestroy {

  @Input() week: number;
  @Input() day: number;
  @Input() year: number;
  @Input() updateSubject: Subject<void>;

  date: moment.Moment;
  dateFormatted: string;
  isoDateString: string;

  subscription: Subscription;

  events: CompanyEvent[] = [];

  companyClosed = false;


  constructor(private api: DefaultService, public dialog: MatDialog, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.isoDateString = this.date.format("YYYY-MM-DD");
    this.updateDate();

    this.updateEvents();
    this.subscription = this.updateSubject.subscribe(
      () => {
        this.updateEvents();
      });
  }


  ngOnChanges(changes: SimpleChanges): void {
    this.updateDate();
  }

  ngOnDestroy() {
    // prevent memory leak when component is destroyed
    this.subscription.unsubscribe();
  }

  addEvent() {
    const dialogRef = this.dialog.open(EventCalendarDialogComponent, {
      width: "400px",
      data: {
        date: this.isoDateString,
      },
    });
    dialogRef.afterClosed().pipe(first()).subscribe(_ => {
      this.updateEvents();
    });

  }

  updateEvents() {
    this.api.readCompanyEventByDateCompanyEventGet(this.isoDateString).subscribe(events => {
      this.events = [];
      this.companyClosed = false;
      for (const event of events) {
        if (event.event_type === CompanyEventEnum.Vacation) {
          this.companyClosed = true;
          continue;
        }
        this.events.push(event);
      }
    });
  }


  editEvent(eventId: number) {
    const dialogRef = this.dialog.open(EventCalendarDialogComponent, {
      width: "400px",
      data: {
        id: eventId,
        date: this.isoDateString
      },
    });
    dialogRef.afterClosed().pipe(first()).subscribe(_ => {
      this.updateEvents();
    });
  }

  eventDayClicked() {
    this.api.readCompanyEventByDateCompanyEventGet(this.isoDateString).subscribe(events => {
      this.authService.getCurrentUser().subscribe(user => {
        for (const event of events) {
          if (event.user.id === user.id) {
            this.editEvent(event.id);
            return;
          }
        }
        this.addEvent();
      });
    });
  }

  private updateDate(): void {
    this.date = moment().year(this.year).isoWeek(this.week).isoWeekday(this.day + 1);
    this.dateFormatted = this.date.format("DD.MM");
  }
}
