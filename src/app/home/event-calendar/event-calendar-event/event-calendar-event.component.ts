import { Component, Input, OnInit } from '@angular/core';
import { getEventTranslation } from '../event-calendar-dialog/event-calendar-dialog.component';
import { CompanyEvent, CompanyEventEnum } from '../../../../client/api';

@Component({
  selector: 'app-event-calendar-event',
  templateUrl: './event-calendar-event.component.html',
  styleUrls: ['./event-calendar-event.component.scss'],
})
export class EventCalendarEventComponent implements OnInit {
  @Input() event: CompanyEvent;

  class: string;

  constructor() {}

  getEventText(event: CompanyEvent): string {
    switch (event.event_type) {
      case CompanyEventEnum.EVENT:
        return event.title;
      case CompanyEventEnum.HOLIDAY:
        return event.user.fullname;
      case CompanyEventEnum.ILLNESS:
        return event.user.fullname;
    }
    return getEventTranslation(event.event_type);
  }

  ngOnInit(): void {
    this.class = this.getClassName();
  }

  private getClassName(): string {
    switch (this.event.event_type) {
      case CompanyEventEnum.EVENT:
        return 'event';
      case CompanyEventEnum.HOLIDAY:
        return 'holiday';
      case CompanyEventEnum.VACATION:
        return 'vacation';
      case CompanyEventEnum.ILLNESS:
        return 'illness';
    }
  }
}
