import { Component, inject, OnInit } from "@angular/core";
import { Observable, of } from "rxjs";
import { first, tap } from "rxjs/operators";
import { Calendar, DefaultService } from "../../../api/openapi";
import { LoadingComponent } from "../../shared/components/loading/loading.component";
import { FlexModule } from "ng-flex-layout";
import { SimpleCalendarComponent } from "../../shared/components/calendar/simple-calendar.component";
import { AsyncPipe } from "@angular/common";

@Component({
  selector: "app-calendars-frame",
  templateUrl: "./calendars-chat-frame.component.html",
  styleUrls: ["./calendars-chat-frame.component.scss"],
  imports: [
    LoadingComponent,
    FlexModule,
    SimpleCalendarComponent,
    AsyncPipe
  ]
})
export class CalendarsChatFrameComponent implements OnInit {
  private api = inject(DefaultService);


  calendars$: Observable<Calendar[]>;
  loading = true;

  ngOnInit(): void {
    this.init();
  }

  private init(): void {
    this.calendars$ = this.api.readCalendarsCalendarGet().pipe(
      first(),
      tap(() => {
        this.loading = false;
      })
    );
    setTimeout(() => {
      this.calendars$ = of([]);
      this.loading = true;
      this.init();
    }, 86_400_000); // init every 24h
  }
}
