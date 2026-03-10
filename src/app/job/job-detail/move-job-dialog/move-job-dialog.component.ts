import { Component, Inject, OnInit } from "@angular/core";
import { UntypedFormControl, UntypedFormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions
} from "@angular/material/dialog";
import { first } from "rxjs/operators";
import { DefaultService } from "../../../../api/openapi";
import { DefaultLayoutDirective, DefaultLayoutAlignDirective } from "ng-flex-layout";
import { MatFormField, MatLabel, MatInput } from "@angular/material/input";
import { MatButton } from "@angular/material/button";
import { MatTabsModule } from "@angular/material/tabs";
import { Client } from "../../../model/client";


export interface ChangePathDialogData {
  id: number;
}

@Component({
  selector: "app-change-path-dialog",
  templateUrl: "./move-job-dialog.component.html",
  styleUrls: ["./move-job-dialog.component.scss"],
  imports: [MatDialogTitle, MatTabsModule, MatDialogContent, FormsModule, ReactiveFormsModule, DefaultLayoutDirective, DefaultLayoutAlignDirective, MatFormField, MatLabel, MatInput, MatDialogActions, MatButton]
})
export class MoveJobDialogComponent implements OnInit {
  title = "Jahr verschieben";
  moveJobYearFormGroup: UntypedFormGroup;
  moveJobClientFormGroup: UntypedFormGroup;


  constructor(private api: DefaultService,
              public dialogRef: MatDialogRef<MoveJobDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ChangePathDialogData) {
  }

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    this.moveJobYearFormGroup = new UntypedFormGroup({
      year: new UntypedFormControl(nextYear.toString())
    });
    this.moveJobYearFormGroup = new UntypedFormGroup({
      customerId: [],
      customerSearch: []
    });
    this.api.readJobJobJobIdGet(this.data.id).pipe(first()).subscribe((job) => {
      this.title += ": " + job.displayable_name;
    });
  }

  onCancelClick() {
    this.dialogRef.close();
  }

  private filterCustomers(value: string): Client[] {
    const filterValue = value.toLowerCase();
    return this.customersList.filter(c =>
      c.name.toLowerCase().includes(filterValue)
    );
  }


  public selectCustomer(customerId: number) {
    this.moveJobClientFormGroup.get("customerId").setValue(customerId);
  }

  onSubmitYearClick() {
    this.api.moveJobToYearJobMoveJobToYearJobIdPost(this.data.id, this.moveJobYearFormGroup.get("year").value)
      .pipe(first()).subscribe(() => {
      this.dialogRef.close(true);
    });
  }

  onSubmitClientClick() {
    this.api.moveJobToClient()

  }
}
