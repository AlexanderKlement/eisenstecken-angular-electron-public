import {Component, Input, OnInit} from '@angular/core';
import {CompanyEvent, CompanyEventEnum} from 'eisenstecken-openapi-angular-library';
import {getEventTranslation} from '../event-calendar-dialog/event-calendar-dialog.component';

@Component({
  selector: 'app-event-calendar-event',
  templateUrl: './event-calendar-event.component.html',
  styleUrls: ['./event-calendar-event.component.scss']
})
export class EventCalendarEventComponent implements OnInit {

  @Input() event: CompanyEvent;

  class: string;

  constructor() {
  }

  translate(eventType: CompanyEventEnum): string {
    return getEventTranslation(eventType);
  }

  ngOnInit(): void {
    this.class = this.getClassName();
  }

  private getClassName(): string {
    switch (this.event.event_type) {
      case CompanyEventEnum.Event:
        return 'event';
      case CompanyEventEnum.Holiday:
        return 'holiday';
      case CompanyEventEnum.Vacation:
        return 'vacation';
      case CompanyEventEnum.Illness:
        return 'illness';
    }
  }

}
