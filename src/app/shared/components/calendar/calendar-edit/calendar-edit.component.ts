import { Component, Inject, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import {
  AbstractControl,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import * as moment from 'moment';
import { timepickerTheme } from '../../../themes/timepicker.theme';
import {
  CalendarEntry,
  CalendarEntryCreate,
  DefaultService,
} from '../../../../../client/api';
import { CommonModule } from '@angular/common';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

export const timeValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const exampleDate = '07.07.1993';
  const startTime = control.get('start_time').value;
  const endTime = control.get('end_time').value;
  if (startTime.length < 5 || endTime.length < 5) {
    return { timeValid: false };
  }
  const startTimeMoment = moment(
    exampleDate + ' ' + startTime,
    'DD.MM.YYYY HH:mm'
  );
  const endTimeMoment = moment(exampleDate + ' ' + endTime, 'DD.MM.YYYY HH:mm');
  if (!startTimeMoment.isValid() || !endTimeMoment.isValid()) {
    return { timeValid: false };
  }
  return moment.duration(endTimeMoment.diff(startTimeMoment)).asMinutes() > 0
    ? null
    : { timeValid: false };
};

export interface CalendarData {
  calendarId: number;
  calendarEntryId?: number;
}

@Component({
  standalone: true,
  selector: 'app-calendar-edit',
  templateUrl: './calendar-edit.component.html',
  styleUrls: ['./calendar-edit.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    NgxMaterialTimepickerModule,
  ],
})
export class CalendarEditComponent implements OnInit {
  submitted = false;
  createMode: boolean;

  calendarId: number;
  calendarEntryId: number; //maybe these two need to be replaced by param
  calendarGroup: UntypedFormGroup;

  ready = false;

  primaryTheme = timepickerTheme;

  constructor(
    private api: DefaultService,
    public dialogRef: MatDialogRef<CalendarEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CalendarData
  ) {}

  ngOnInit(): void {
    if (this.data.calendarEntryId === undefined) {
      this.createMode = true;
      this.calendarId = this.data.calendarId;
      if (isNaN(this.calendarId)) {
        console.error('CalendarEditComponent: Cannot parse CalendarId');
      }
      this.createCalendarGroup();
      this.ready = true;
    } else {
      this.createMode = false;
      this.calendarEntryId = this.data.calendarEntryId;
      this.api
        .readCalendarEntryCalendarCalendarEntryIdGet(this.calendarEntryId)
        .subscribe(calendarEntry => {
          this.createCalendarGroup(calendarEntry);
          this.ready = true;
        });
    }
  }

  createCalendarGroup(calendarEntry?: CalendarEntry): void {
    let title = '';
    let date = new Date();
    let description = '';
    let startTime = '';
    let endTime = '';
    if (calendarEntry !== undefined) {
      title = calendarEntry.title;
      description = calendarEntry.description;
      date = moment(calendarEntry.start_time).toDate();
      startTime = moment(calendarEntry.start_time).format('HH:mm');
      endTime = moment(calendarEntry.end_time).format('HH:mm');
    }

    this.calendarGroup = new UntypedFormGroup(
      {
        title: new UntypedFormControl(title, Validators.required),
        description: new UntypedFormControl(description),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        date: new UntypedFormControl(date, Validators.required),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        start_time: new UntypedFormControl(
          startTime,
          Validators.pattern('^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$')
        ),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        end_time: new UntypedFormControl(
          endTime,
          Validators.pattern('^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$')
        ),
      },
      { validators: timeValidator }
    );
  }

  onSubmit(): void {
    this.submitted = true;
    const date = moment(this.calendarGroup.get('date').value);
    const startDateString =
      date.format('DD.MM.YYYY') +
      ' ' +
      this.calendarGroup.get('start_time').value;
    const endDateString =
      date.format('DD.MM.YYYY') +
      ' ' +
      this.calendarGroup.get('end_time').value;
    const startDate = moment(startDateString, 'DD.MM.YYYY HH:mm');
    const endDate = moment(endDateString, 'DD.MM.YYYY HH:mm');
    const calendarEntryCreate: CalendarEntryCreate = {
      title: this.calendarGroup.get('title').value,
      description: this.calendarGroup.get('description').value,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      start_time: startDate.format(),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      end_time: endDate.format(),
    };
    if (this.createMode) {
      this.api
        .createCalendarEntryCalendarCalendarIdPost(
          this.calendarId,
          calendarEntryCreate
        )
        .pipe(first())
        .subscribe(
          calendarEntry => {
            this.createUpdateSuccess(calendarEntry);
          },
          error => {
            this.createUpdateError(error);
          },
          () => {
            this.createUpdateComplete();
          }
        );
    } else {
      this.api
        .updateCalendarEntryCalendarCalendarEntryIdPut(
          this.calendarEntryId,
          calendarEntryCreate
        )
        .pipe(first())
        .subscribe(
          calendarEntry => {
            this.createUpdateSuccess(calendarEntry);
          },
          error => {
            this.createUpdateError(error);
          },
          () => {
            this.createUpdateComplete();
          }
        );
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createUpdateSuccess(calendarEntry: CalendarEntry): void {
    this.dialogRef.close(calendarEntry);
  }

  createUpdateError(error: any): void {
    console.error(
      'CalendarEditComponent: Could not complete ' +
        (this.createMode ? 'creation' : 'update')
    );
    console.error(error);
    this.submitted = false;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  createUpdateComplete(): void {
    this.submitted = false;
  }

  deleteButtonClicked(): void {
    this.deleteCalendarEntry();
  }

  deleteCalendarEntry(): void {
    this.api
      .deleteCalendarEntryCalendarCalendarIdDelete(this.calendarEntryId)
      .pipe(first())
      .subscribe(() => {
        this.dialogRef.close(true);
      });
  }

  onDelete() {
    this.deleteCalendarEntry();
  }
}
