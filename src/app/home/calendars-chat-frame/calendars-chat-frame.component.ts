import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { first, tap } from 'rxjs/operators';
import { ChatService } from '../chat/chat.service';
import { DefaultService, Calendar } from '../../../api/openapi';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { FlexModule, DefaultLayoutDirective, DefaultLayoutAlignDirective } from 'ng-flex-layout';
import { SimpleCalendarComponent } from '../../shared/components/calendar/simple-calendar.component';
import { EventCalendarComponent } from '../event-calendar/event-calendar.component';
import { ChatComponent } from '../chat/chat.component';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-calendars-frame',
    templateUrl: './calendars-chat-frame.component.html',
    styleUrls: ['./calendars-chat-frame.component.scss'],
    imports: [LoadingComponent, MatTabGroup, FlexModule, MatTab, DefaultLayoutDirective, DefaultLayoutAlignDirective, SimpleCalendarComponent, EventCalendarComponent, ChatComponent, AsyncPipe]
})
export class CalendarsChatFrameComponent implements OnInit, OnDestroy {

  @ViewChild('chatTab') chatTab;

  calendars$: Observable<Calendar[]>;
  loading = true;
  chatTabName = '  Chat';

  checkIfUnreadMessagesInterval: NodeJS.Timeout;
  secondsCheckIfUnreadMessages = 10;
  eventTabName = ' Betriebskalender';

  constructor(private api: DefaultService, private chatService: ChatService) {
  }

  ngOnInit(): void {
    this.calendars$ = this.api.readCalendarsCalendarGet().pipe(first(), tap(() => {
      this.loading = false;
    }));
    /*
    this.checkIfUnreadMessagesInterval = setInterval(() => {
      this.resetUnreadChatMessageCountIfActive();
    }, 1000 * this.secondsCheckIfUnreadMessages);

     */
  }

  ngOnDestroy(): void {
    //clearInterval(this.checkIfUnreadMessagesInterval);
  }

  private resetUnreadChatMessageCountIfActive(): void {
    if (this.chatTab.isActive) {
      this.chatService.resetUnreadMessageCount();
    }
  }


}
