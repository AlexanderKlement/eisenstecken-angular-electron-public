import { Component, OnInit, inject } from "@angular/core";
import { UntypedFormControl, UntypedFormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions
} from "@angular/material/dialog";
import { debounceTime, distinctUntilChanged, first, map, startWith, switchMap } from "rxjs/operators";
import { ClientService, ClientSmall, DefaultService, JobService } from "../../../../api/openapi";
import { DefaultLayoutDirective, DefaultLayoutAlignDirective } from "ng-flex-layout";
import { MatTabsModule } from "@angular/material/tabs";
import { Observable, of } from "rxjs";
import { AsyncPipe } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatAutocompleteModule } from "@angular/material/autocomplete";


export interface ChangePathDialogData {
  id: number;
}

@Component({
  selector: "app-move-job-dialog",
  templateUrl: "./move-job-dialog.component.html",
  styleUrls: ["./move-job-dialog.component.scss"],
  imports: [
    MatDialogTitle,
    MatTabsModule,
    MatDialogContent,
    FormsModule,
    ReactiveFormsModule,
    DefaultLayoutDirective,
    DefaultLayoutAlignDirective,
    MatFormFieldModule,
    MatInputModule,
    MatDialogActions,
    MatButtonModule,
    MatAutocompleteModule,
    AsyncPipe
  ]
})
export class MoveJobDialogComponent implements OnInit {
  private api = inject(DefaultService);
  private jobService = inject(JobService);
  private clientService = inject(ClientService);
  dialogRef = inject<MatDialogRef<MoveJobDialogComponent>>(MatDialogRef);
  data = inject<ChangePathDialogData>(MAT_DIALOG_DATA);

  title = "Jahr verschieben";
  moveJobYearFormGroup: UntypedFormGroup;
  moveJobClientFormGroup: UntypedFormGroup;
  filteredCustomers!: Observable<ClientSmall[]>;

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;

    this.moveJobYearFormGroup = new UntypedFormGroup({
      year: new UntypedFormControl(nextYear.toString())
    });
    this.moveJobClientFormGroup = new UntypedFormGroup({
      customerSearch: new UntypedFormControl(""),
      customerId: new UntypedFormControl(null)
    });

    this.filteredCustomers = this.moveJobClientFormGroup.get("customerSearch")!.valueChanges.pipe(
      startWith(""),
      map(value => typeof value === "string" ? value : value?.name ?? ""),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(search => {
        if (!search || search.trim().length < 2) {
          return of([]);
        }

        return this.clientService.getClients(0, 10, search.trim());
      })
    );
    this.api.readJobJobJobIdGet(this.data.id).pipe(first()).subscribe((job) => {
      this.title += ": " + job.displayable_name;
    });
  }

  onCancelClick() {
    this.dialogRef.close();
  }



  displayCustomer(client: ClientSmall): string {
    return client ? client.name : "";
  }


  public selectCustomer(customer: ClientSmall) {
    this.moveJobClientFormGroup.get("customerId")?.setValue(customer.id);
  }

  onSubmitYearClick() {
    this.api.moveJobToYearJobMoveJobToYearJobIdPost(this.data.id, this.moveJobYearFormGroup.get("year").value)
      .pipe(first()).subscribe(() => {
      this.dialogRef.close(true);
    });
  }

  onSubmitClientClick() {
    const customerId = this.moveJobClientFormGroup.get("customerId")?.value;

    if (!customerId) {
      return;
    }

    this.jobService.moveJobToClient(this.data.id, customerId)
      .pipe(first())
      .subscribe(() => {
        this.dialogRef.close(true);
      });
  }
}
