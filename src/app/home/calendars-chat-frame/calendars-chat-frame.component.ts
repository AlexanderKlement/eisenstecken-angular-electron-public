import { Component, OnDestroy, OnInit} from "@angular/core";
import { Observable } from "rxjs";
import { first, tap } from "rxjs/operators";
import { DefaultService, Calendar } from "../../../api/openapi";
import { LoadingComponent } from "../../shared/components/loading/loading.component";
import {
  FlexModule,
  DefaultLayoutDirective,
  DefaultLayoutAlignDirective,
} from "ng-flex-layout";
import { SimpleCalendarComponent } from "../../shared/components/calendar/simple-calendar.component";
import { AsyncPipe } from "@angular/common";

@Component({
  selector: "app-calendars-frame",
  templateUrl: "./calendars-chat-frame.component.html",
  styleUrls: ["./calendars-chat-frame.component.scss"],
  imports: [
    LoadingComponent,
    DefaultLayoutDirective,
    FlexModule,
    DefaultLayoutAlignDirective,
    SimpleCalendarComponent,
    AsyncPipe,
  ],
})
export class CalendarsChatFrameComponent implements OnInit, OnDestroy {

  calendars$: Observable<Calendar[]>;
  loading = true;

  constructor(
    private api: DefaultService,
  ) {}

  ngOnInit(): void {
    this.calendars$ = this.api.readCalendarsCalendarGet().pipe(
      first(),
      tap(() => {
        this.loading = false;
      }),
    );
  }

  ngOnDestroy(): void {
  }
}
