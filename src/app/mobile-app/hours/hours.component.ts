import { Component, OnInit } from "@angular/core";
import { CustomButton, ToolbarComponent } from "../../shared/components/toolbar/toolbar.component";
import { Subject } from "rxjs";
import { first } from "rxjs/operators";
import { DefaultService, WorkDay } from "../../../api/openapi";
import { DefaultLayoutDirective, DefaultLayoutAlignDirective } from "ng-flex-layout";
import { HoursStepperComponent } from "./hours-stepper/hours-stepper.component";
import { MatButton } from "@angular/material/button";

@Component({
    selector: 'app-hours',
    templateUrl: './hours.component.html',
    styleUrls: ['./hours.component.scss'],
    imports: [
        ToolbarComponent,
        DefaultLayoutDirective,
        DefaultLayoutAlignDirective,
        HoursStepperComponent,
        MatButton,
    ],
})
export class HoursComponent implements OnInit {

  loading = true;
  buttons: CustomButton[] = [];
  stepBackSubject$: Subject<void> = new Subject<void>();
  todaysWorkDayFinished = false;
  workDay$: Subject<WorkDay>;

  constructor(private api: DefaultService) {
  }


  ngOnInit(): void {
    this.workDay$ = new Subject<WorkDay>();
    this.api.getCurrentWorkDayWorkDayCurrentGet().pipe(first()).subscribe((workDay) => {
      if (workDay) {
        this.todaysWorkDayFinished = true;
      }
      console.log("HoursComponent: Downloading Subject", workDay);
      this.workDay$.next(workDay);
      this.loading = false;
    });
  }

  editButtonClicked() {
    this.todaysWorkDayFinished = false;
  }
}
