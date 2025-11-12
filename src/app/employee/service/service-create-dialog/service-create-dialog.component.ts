import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from "@angular/material/dialog";
import { first } from "rxjs/operators";
import { UntypedFormControl, UntypedFormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { formatDateTransport } from "../../../shared/date.util";
import { DefaultService, ServiceCreate, User } from "../../../../api/openapi";
import { CdkScrollable } from "@angular/cdk/scrolling";
import { DefaultLayoutDirective, DefaultLayoutAlignDirective } from "ng-flex-layout";
import { MatFormField, MatLabel, MatInput, MatSuffix } from "@angular/material/input";
import { MatDatepickerInput, MatDatepickerToggle, MatDatepicker } from "@angular/material/datepicker";
import { MinuteHourComponent } from "../../../shared/components/minute-hour/minute-hour.component";
import { MatButton } from "@angular/material/button";

export interface ServiceCreateDialogData {
  userId: number;
}

@Component({
    selector: 'app-service-create-dialog',
    templateUrl: './service-create-dialog.component.html',
    styleUrls: ['./service-create-dialog.component.scss'],
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, DefaultLayoutDirective, DefaultLayoutAlignDirective, MatFormField, MatLabel, MatInput, FormsModule, MatDatepickerInput, ReactiveFormsModule, MatDatepickerToggle, MatSuffix, MatDatepicker, MinuteHourComponent, MatDialogActions, MatButton]
})
export class ServiceCreateDialogComponent implements OnInit {

  user: User;
  loading = true;
  serviceGroup: UntypedFormGroup;

  constructor(public dialogRef: MatDialogRef<ServiceCreateDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ServiceCreateDialogData,
              private api: DefaultService) {
  }

  ngOnInit(): void {
    this.api.readUserUsersUserIdGet(this.data.userId).pipe(first()).subscribe((user) => {
      this.user = user;
      this.serviceGroup = new UntypedFormGroup({
        minutes: new UntypedFormControl(0),
        date: new UntypedFormControl(new Date().toISOString()),
      });
      this.loading = false;
    });
  }

  getDateControl(): UntypedFormControl {
    return this.serviceGroup.get("date") as UntypedFormControl;
  }

  getMinuteControl(): UntypedFormControl {
    return this.serviceGroup.get("minutes") as UntypedFormControl;
  }

  onNoClick() {
    this.dialogRef.close(false);
  }

  onYesClick() {
    const serviceCreate: ServiceCreate = {
      minutes: parseInt(this.getMinuteControl().value, 10),
      date: formatDateTransport(this.getDateControl().value),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      user_id: this.user.id,
    };
    this.api.createServiceServicePost(serviceCreate).pipe(first()).subscribe(() => {
      this.dialogRef.close(true);
    });
  }
}
