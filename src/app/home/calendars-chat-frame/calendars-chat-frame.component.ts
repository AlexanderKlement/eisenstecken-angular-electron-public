import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { first, tap } from 'rxjs/operators';
import { ChatService } from '../chat/chat.service';
import { Calendar, DefaultService } from '../../../client/api';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { EventCalendarComponent } from '../event-calendar/event-calendar.component';
import { ChatComponent } from '../chat/chat.component';
import { SimpleCalendarComponent } from '../../shared/components/calendar/simple-calendar.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { AsyncPipe, NgForOf } from '@angular/common';

@Component({
  selector: 'app-calendars-frame',
  templateUrl: './calendars-chat-frame.component.html',
  styleUrls: ['./calendars-chat-frame.component.scss'],
  imports: [
    MatTab,
    EventCalendarComponent,
    ChatComponent,
    SimpleCalendarComponent,
    LoadingComponent,
    MatTabGroup,
    NgForOf,
    AsyncPipe,
  ],
})
export class CalendarsChatFrameComponent implements OnInit, OnDestroy {
  @ViewChild('chatTab') chatTab;

  calendars$: Observable<Calendar[]>;
  loading = true;
  chatTabName = '  Chat';

  checkIfUnreadMessagesInterval: NodeJS.Timeout;
  secondsCheckIfUnreadMessages = 10;
  eventTabName = ' Betriebskalender';

  constructor(
    private api: DefaultService,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.calendars$ = this.api.readCalendarsCalendarGet().pipe(
      first(),
      tap(() => {
        this.loading = false;
      })
    );
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
