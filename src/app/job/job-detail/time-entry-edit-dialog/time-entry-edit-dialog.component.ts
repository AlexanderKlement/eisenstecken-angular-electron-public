import { Component, inject, OnInit } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import { TikTakService, TikTakTimeEntryByJob } from "../../../../api/openapi";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { DefaultLayoutAlignDirective, DefaultLayoutDirective, FlexModule } from "ng-flex-layout";
import { MatFormField, MatInput, MatLabel, MatSuffix } from "@angular/material/input";
import { MatButton } from "@angular/material/button";
import { first } from "rxjs/operators";

export interface TimeEntryEditData {
  timeEntry: TikTakTimeEntryByJob;
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
    MatSuffix
  ]
})
export class TimeEntryEditDialogComponent implements OnInit {
  dialogRef = inject<MatDialogRef<TimeEntryEditDialogComponent>>(MatDialogRef);
  data = inject<TimeEntryEditData>(MAT_DIALOG_DATA);
  tikTakService = inject(TikTakService);
  dataGroup: FormGroup<TimeEntryControl>;


  ngOnInit(): void {
    this.dataGroup = new FormGroup<TimeEntryControl>(
      {
        user: new FormControl(this.data.timeEntry.user.fullname),
        minutes: new FormControl(this.data.timeEntry.minutes, Validators.min(0)),
        hours: new FormControl(`${Math.floor(this.data.timeEntry.minutes / 60)}:${(this.data.timeEntry.minutes % 60).toString(10).padStart(2, "0")}`),
        hourlyRate: new FormControl(this.data.timeEntry.hourlyRate ? this.data.timeEntry.hourlyRate.toFixed(2) : " - "),
        sum: new FormControl(this.data.timeEntry.hourlyRate ? (this.data.timeEntry.hourlyRate * (this.data.timeEntry.minutes / 60)).toFixed(2) : " - ")
      }
    );
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onMinutesChange() {
    const newMinutes = this.dataGroup.get("minutes").value;
    const hourlyRate = this.data.timeEntry.hourlyRate;
    this.dataGroup.patchValue({ hours: `${Math.floor(newMinutes / 60)}:${(newMinutes % 60).toString(10).padStart(2, "0")}` });
    if (hourlyRate)
      this.dataGroup.patchValue({ sum: (hourlyRate * (newMinutes / 60)).toFixed(2) });
  }

  onSubmitClick() {
    const newMinutes = this.dataGroup.get("minutes").value;
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
