import { Component, Inject, OnInit } from "@angular/core";
import { first } from "rxjs/operators";
import dayjs from "dayjs";
import {
  AbstractControl,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent } from "@angular/material/dialog";
import { timepickerTheme } from "../../../themes/timepicker.theme";
import { DefaultService, CalendarEntry, CalendarEntryCreate } from "../../../../../api/openapi";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { DefaultLayoutDirective, DefaultLayoutAlignDirective } from "ng-flex-layout";
import { MatFormField, MatLabel, MatInput, MatSuffix } from "@angular/material/input";
import { MatDatepickerInput, MatDatepickerToggle, MatDatepicker } from "@angular/material/datepicker";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { MatButton } from "@angular/material/button";

export const timeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const exampleDate = "07.07.1993";
  const startTime = control.get("start_time").value;
  const endTime = control.get("end_time").value;
  if (startTime.length < 5 || endTime.length < 5) {
    return { timeValid: false };
  }
  const startTimeMoment = dayjs(exampleDate + " " + startTime, "DD.MM.YYYY HH:mm");
  const endTimeMoment = dayjs(exampleDate + " " + endTime, "DD.MM.YYYY HH:mm");
  if (!startTimeMoment.isValid() || !endTimeMoment.isValid()) {
    return { timeValid: false };
  }
  const minutes = dayjs.duration(endTimeMoment.diff(startTimeMoment)).asMinutes();
  return minutes > 0 ? null : { timeValid: false };
};

export interface CalendarData {
  calendarId: number;
  calendarEntryId?: number;
}

@Component({
  selector: 'app-calendar-edit',
  templateUrl: './calendar-edit.component.html',
  styleUrls: ['./calendar-edit.component.scss'],
  imports: [MatDialogTitle, MatDialogContent, MatProgressSpinner, FormsModule, ReactiveFormsModule, DefaultLayoutDirective, DefaultLayoutAlignDirective, MatFormField, MatLabel, MatInput, MatDatepickerInput, MatDatepickerToggle, MatSuffix, MatDatepicker, NgxMaterialTimepickerModule, MatButton],
})
export class CalendarEditComponent implements OnInit {
  submitted = false;
  createMode: boolean;

  calendarId: number;
  calendarEntryId: number; //maybe these two need to be replaced by param
  calendarGroup: UntypedFormGroup;

  ready = false;

  primaryTheme = timepickerTheme;

  constructor(private api: DefaultService, public dialogRef: MatDialogRef<CalendarEditComponent>,
              @Inject(MAT_DIALOG_DATA) public data: CalendarData) {
  }

  ngOnInit(): void {
    if (this.data.calendarEntryId === undefined) {
      this.createMode = true;
      this.calendarId = this.data.calendarId;
      if (isNaN(this.calendarId)) {
        console.error("CalendarEditComponent: Cannot parse CalendarId");
      }
      this.createCalendarGroup();
      this.ready = true;
    } else {
      this.createMode = false;
      this.calendarEntryId = this.data.calendarEntryId;
      this.api.readCalendarEntryCalendarCalendarEntryIdGet(this.calendarEntryId).subscribe((calendarEntry) => {
        this.createCalendarGroup(calendarEntry);
        this.ready = true;
      });
    }
  }

  createCalendarGroup(calendarEntry?: CalendarEntry): void {
    let title = "";
    let date = new Date();
    let description = "";
    let startTime = "";
    let endTime = "";
    if (calendarEntry !== undefined) {
      title = calendarEntry.title;
      description = calendarEntry.description;
      date = dayjs(calendarEntry.start_time).toDate();
      startTime = dayjs(calendarEntry.start_time).format("HH:mm");
      endTime = dayjs(calendarEntry.end_time).format("HH:mm");
    }

    this.calendarGroup = new UntypedFormGroup({
      title: new UntypedFormControl(title, Validators.required),
      description: new UntypedFormControl(description),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      date: new UntypedFormControl(date, Validators.required),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      start_time: new UntypedFormControl(startTime, Validators.pattern("^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$")),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      end_time: new UntypedFormControl(endTime, Validators.pattern("^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$")),
    }, { validators: timeValidator });

  }


  onSubmit(): void {
    this.submitted = true;
    const date = dayjs(this.calendarGroup.get("date").value);
    const startDateString = date.format("DD.MM.YYYY") + " " + this.calendarGroup.get("start_time").value;
    const endDateString = date.format("DD.MM.YYYY") + " " + this.calendarGroup.get("end_time").value;
    const startDate = dayjs(startDateString, "DD.MM.YYYY HH:mm");
    const endDate = dayjs(endDateString, "DD.MM.YYYY HH:mm");
    const calendarEntryCreate: CalendarEntryCreate = {
      title: this.calendarGroup.get("title").value,
      description: this.calendarGroup.get("description").value,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      start_time: startDate.format(),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      end_time: endDate.format(),
    };
    if (this.createMode) {
      this.api.createCalendarEntryCalendarCalendarIdPost(this.calendarId, calendarEntryCreate)
        .pipe(first())
        .subscribe({
          next: (calendarEntry) => this.createUpdateSuccess(calendarEntry),
          error: (error) => this.createUpdateError(error),
          complete: () => this.createUpdateComplete(),
        });
    } else {
      this.api.updateCalendarEntryCalendarCalendarEntryIdPut(this.calendarEntryId, calendarEntryCreate).pipe(first()).subscribe({
          next: (calendarEntry) => this.createUpdateSuccess(calendarEntry),
          error: (error) => this.createUpdateError(error),
          complete: () => this.createUpdateComplete(),
        },
      );
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createUpdateSuccess(calendarEntry: CalendarEntry): void {
    this.dialogRef.close(calendarEntry);
  }


  createUpdateError(error: any): void {
    console.error("CalendarEditComponent: Could not complete " + (this.createMode ? "creation" : "update"));
    console.error(error);
    this.submitted = false;
  }


  onCancel(): void {
    this.dialogRef.close();
  }

  createUpdateComplete(): void {
    this.submitted = false;
  }

  deleteCalendarEntry(): void {
    this.api.deleteCalendarEntryCalendarCalendarIdDelete(this.calendarEntryId).pipe(first()).subscribe(() => {
      this.dialogRef.close(true);
    });
  }

  onDelete() {
    this.deleteCalendarEntry();
  }
}
