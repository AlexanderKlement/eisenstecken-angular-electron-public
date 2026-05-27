import { Component, inject, OnInit } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import { DefaultService, TikTakService, TikTakTimeEntryByJob, User } from "../../../../api/openapi";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { DefaultLayoutAlignDirective, DefaultLayoutDirective, FlexModule } from "ng-flex-layout";
import { MatFormField, MatInput, MatLabel, MatSuffix } from "@angular/material/input";
import { MatButton } from "@angular/material/button";
import { first } from "rxjs/operators";
import { MatOption, MatSelect } from "@angular/material/select";
import { AsyncPipe } from "@angular/common";
import { Observable } from "rxjs";

export interface TimeEntryEditData {
  timeEntry?: TikTakTimeEntryByJob;
  jobId: number;
}

type TimeEntryControl = {
  user: FormControl<string>,
  minutes: FormControl<number>,
  hours: FormControl<string>,
  hourlyRate: FormControl<string>,
  sum: FormControl<string>,
}

@Component({
  selector: "time-entry-edit-dialog",
  templateUrl: "./time-entry-edit-dialog.component.html",
  styleUrls: ["./time-entry-edit-dialog.component.scss"],
  imports: [
    MatDialogContent,
    MatDialogTitle,
    DefaultLayoutDirective,
    DefaultLayoutAlignDirective,
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatDialogActions,
    MatButton,
    FlexModule,
    MatSuffix,
    MatSelect,
    AsyncPipe,
    MatOption
  ]
})
export class TimeEntryEditDialogComponent implements OnInit {
  dialogRef = inject<MatDialogRef<TimeEntryEditDialogComponent>>(MatDialogRef);
  data = inject<TimeEntryEditData>(MAT_DIALOG_DATA);
  tikTakService = inject(TikTakService);
  api = inject(DefaultService);
  dataGroup: FormGroup<TimeEntryControl>;
  createMode: boolean = false;
  users$: Observable<User[]>;
  title = "";
  hourlyRateCreate = 0;

  ngOnInit(): void {
    if (this.data.timeEntry) {
      this.title = `Arbeitszeit ${this.data.timeEntry.user.fullname} bearbeiten`;
      this.dataGroup = new FormGroup<TimeEntryControl>(
        {
          user: new FormControl(this.data.timeEntry.user.fullname),
          minutes: new FormControl(this.data.timeEntry.minutes, Validators.min(0)),
          hours: new FormControl(`${Math.floor(this.data.timeEntry.minutes / 60)}:${(this.data.timeEntry.minutes % 60).toString(10).padStart(2, "0")}`),
          hourlyRate: new FormControl(this.data.timeEntry.hourlyRate ? this.data.timeEntry.hourlyRate.toFixed(2) : " - "),
          sum: new FormControl(this.data.timeEntry.hourlyRate ? (this.data.timeEntry.hourlyRate * (this.data.timeEntry.minutes / 60)).toFixed(2) : " - ")
        }
      );
    } else {
      this.title = `Arbeitszeit erstellen`;
      this.users$ = this.api.readUsersUsersGet(0, "", 100);
      this.createMode = true;
      this.dataGroup = new FormGroup<TimeEntryControl>(
        {
          user: new FormControl("-1", Validators.required),
          minutes: new FormControl(0, [Validators.min(1), Validators.required]),
          hours: new FormControl(""),
          hourlyRate: new FormControl(" - "),
          sum: new FormControl(" - ")
        }
      );
    }
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSelectUser(): void {
    const id = parseInt(this.dataGroup.get("user").value, 10);
    if (id !== -1) {
      this.api.getHourlyRatesUsersHourlyRatesUserIdGet(id).subscribe(data => {
          if (data.length > 0) {
            const rates = [...data].sort((a, b) => {
              if (!a.end_date)
                return -1;
              if (!b.end_date)
                return 1;
              return 0;
            });
            this.hourlyRateCreate = rates[0].rate;
          }
        }
      );
    }
  }

  onMinutesChange() {
    if (this.createMode) {
      const newMinutes = this.dataGroup.get("minutes").value;
      this.dataGroup.patchValue({ hours: `${Math.floor(newMinutes / 60)}:${(newMinutes % 60).toString(10).padStart(2, "0")}` });
      this.dataGroup.patchValue({ sum: (this.hourlyRateCreate * (newMinutes / 60)).toFixed(2) });
    } else {
      const newMinutes = this.dataGroup.get("minutes").value;
      const hourlyRate = this.data.timeEntry.hourlyRate;
      this.dataGroup.patchValue({ hours: `${Math.floor(newMinutes / 60)}:${(newMinutes % 60).toString(10).padStart(2, "0")}` });
      if (hourlyRate)
        this.dataGroup.patchValue({ sum: (hourlyRate * (newMinutes / 60)).toFixed(2) });
    }
  }

  onSubmitClick() {
    const newMinutes = this.dataGroup.get("minutes").value;
    if (this.createMode) {
      const user = parseInt(this.dataGroup.get("user").value, 10);
      const jobId = this.data.jobId;
      if (newMinutes !== 0 && user !== -1 && jobId) {
        this.tikTakService.createTimeEntryTiktakTimeEntryPut({
          minutes: newMinutes,
          lastSync: new Date().toISOString(),
          jobId,
          userId: user
        }).subscribe((_) => {
          this.dialogRef.close();
        });
      }
    } else {
      const oldMinutes = this.data.timeEntry.minutes;
      if (newMinutes != oldMinutes) {
        this.tikTakService.updateTimeEntryTiktakTimeEntryTimeEntryIdPost(this.data.timeEntry.id, {
          minutes: newMinutes,
          lastSync: null
        })
          .pipe(first())
          .subscribe((_) => {
            this.dialogRef.close();
          });
      } else {
        this.dialogRef.close();
      }
    }
  }
}
