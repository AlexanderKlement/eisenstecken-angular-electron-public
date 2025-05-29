import { Component, Inject, OnInit } from '@angular/core';
import { JobEnum } from '../hours-stepper.component';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {
  ReactiveFormsModule,
  UntypedFormArray,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { NgForOf } from '@angular/common';

export interface HoursStepperDriveDialogData {
  jobEnums: JobEnum[];
  reason?: string;
  jobId?: number;
  jobFormGroup: UntypedFormGroup;
}

@Component({
  selector: 'app-hours-stepper-drive-dialog',
  templateUrl: './hours-stepper-drive-dialog.component.html',
  styleUrls: ['./hours-stepper-drive-dialog.component.scss'],
  imports: [
    MatDialogContent,
    MatDialogTitle,
    MatFormField,
    MatLabel,
    ReactiveFormsModule,
    MatFormField,
    MatDialogActions,
    MatButton,
    MatFormField,
    MatInput,
    MatFormField,
    NgForOf,
  ],
})
export class HoursStepperDriveDialogComponent implements OnInit {
  confirmDisabled: true;
  jobFormGroup: UntypedFormGroup;
  reasonGroup: UntypedFormGroup;

  constructor(
    public dialogRef: MatDialogRef<HoursStepperDriveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: HoursStepperDriveDialogData
  ) {}

  ngOnInit(): void {
    this.jobFormGroup = this.data.jobFormGroup;
    this.reasonGroup = new UntypedFormGroup({
      reason: new UntypedFormControl(''),
    });
  }

  getJobListName(jobEnum: JobEnum) {
    switch (jobEnum) {
      case JobEnum.accepted:
        return 'Angenommen';
      case JobEnum.created:
        return 'Erstellt';
    }
  }

  getAllJobs(): UntypedFormArray[] {
    return [this.getJobs(JobEnum.accepted), this.getJobs(JobEnum.created)];
  }

  getJobs(jobEnum: JobEnum): UntypedFormArray {
    switch (jobEnum) {
      case JobEnum.accepted:
        return this.jobFormGroup.get('jobsAccepted') as UntypedFormArray;
      case JobEnum.created:
        return this.jobFormGroup.get('jobsCreated') as UntypedFormArray;
    }
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  jobClicked(i: number, j: number) {
    const jobId = this.getJobs(j).at(i).get('jobId').value;
    const data = this.data;
    this.data.jobId = jobId;
    this.dialogRef.close(data);
  }

  getNameFromJob(i: number, jobEnum: JobEnum): string {
    return this.getJobs(jobEnum).at(i).get('name').value;
  }

  onConfirmClick() {
    const data = this.data;
    this.data.reason = this.reasonGroup.get('reason').value;
    this.dialogRef.close(data);
  }
}
