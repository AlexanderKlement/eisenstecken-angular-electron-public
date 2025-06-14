import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import {
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import {
  DefaultService,
  User,
  Workload,
  WorkloadCreate,
  WorkloadUpdate,
} from '../../../../client/api';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MinuteHourComponent } from '../../../shared/components/minute-hour/minute-hour.component';

export interface WorkHourEditDialogData {
  jobId: number;
  userId: number;
}

@Component({
  selector: 'app-work-hour-edit-dialog',
  templateUrl: './work-hour-edit-dialog.component.html',
  styleUrls: ['./work-hour-edit-dialog.component.scss'],
  imports: [
    MatFormField,
    MatDialogContent,
    MatDialogTitle,
    MatSelect,
    AsyncPipe,
    MatButton,
    MatOption,
    MinuteHourComponent,
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    MatLabel,
  ],
})
export class WorkHourEditDialogComponent implements OnInit {
  create: boolean;
  userId: number;
  jobId: number;
  workloadId: number;
  users$: Observable<User[]>;
  selectedUserName$: Observable<string>;
  workHourGroup: UntypedFormGroup;
  loading = true;

  constructor(
    public dialogRef: MatDialogRef<WorkHourEditDialogComponent>,
    private api: DefaultService,
    @Inject(MAT_DIALOG_DATA) public data: WorkHourEditDialogData
  ) {}

  ngOnInit(): void {
    this.create = this.data.userId <= 0;
    this.users$ = this.api.readUsersUsersGet();
    this.userId = this.data.userId;
    this.jobId = this.data.jobId;
    if (!this.create) {
      this.selectedUserName$ = this.api
        .readUserUsersUserIdGet(this.userId)
        .pipe(map(user => user.fullname));
      this.api
        .readWorkloadByUserAndJobWorkloadUserJobUserIdJobIdGet(
          this.userId,
          this.jobId
        )
        .pipe(first())
        .subscribe(workload => {
          this.initWorkHourGroup(workload);
          this.workloadId = workload.id;
          this.loading = false;
        });
    } else {
      this.initWorkHourGroup();
      this.loading = false;
    }
  }

  initWorkHourGroup(workload?: Workload): void {
    let minutes = 0;
    let minutesDirection = 0;
    if (workload) {
      minutes = workload.minutes;
      minutesDirection = workload.minutes_direction;
    }
    this.workHourGroup = new UntypedFormGroup({
      minutes: new UntypedFormControl(minutes),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      minutes_direction: new UntypedFormControl(minutesDirection),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      selected_user_id: new UntypedFormControl(this.create ? 1 : this.userId),
    });
  }

  onNoClick(): void {
    this.closeDialog(false);
  }

  getMinuteControl(): UntypedFormControl {
    return this.workHourGroup.get('minutes') as UntypedFormControl;
  }

  getMinuteDirectionControl(): UntypedFormControl {
    return this.workHourGroup.get('minutes_direction') as UntypedFormControl;
  }

  getSelectedUserControl(): UntypedFormControl {
    return this.workHourGroup.get('selected_user_id') as UntypedFormControl;
  }

  onSubmitClick() {
    if (this.create) {
      const workloadCreate: WorkloadCreate = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        user_id: parseInt(this.workHourGroup.get('selected_user_id').value, 10),
        minutes: parseInt(this.getMinuteControl().value, 10),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        minutes_direction: parseInt(this.getMinuteDirectionControl().value, 10),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        job_id: this.data.jobId,
      };
      this.api
        .createWorkloadWorkloadPost(workloadCreate)
        .pipe(first())
        .subscribe(() => {
          this.closeDialog(true);
        });
    } else {
      const workloadUpdate: WorkloadUpdate = {
        minutes: parseInt(this.getMinuteControl().value, 10),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        minutes_direction: parseInt(this.getMinuteDirectionControl().value, 10),
        // eslint-disable-next-line @typescript-eslint/naming-convention
      };
      this.api
        .updateWorkloadWorkloadWorkloadIdPut(this.workloadId, workloadUpdate)
        .pipe(first())
        .subscribe(() => {
          this.closeDialog(true);
        });
    }
  }

  closeDialog(reload: boolean): void {
    this.dialogRef.close(reload);
  }
}
