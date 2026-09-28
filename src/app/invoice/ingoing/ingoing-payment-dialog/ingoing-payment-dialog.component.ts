import { Component, inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from "@angular/material/dialog";
import { DefaultLayoutAlignDirective, DefaultLayoutDirective, FlexModule } from "ng-flex-layout";
import { MatButton, MatIconButton } from "@angular/material/button";
import { Observable } from "rxjs";
import { DefaultService, IngoingInvoice, Liability, LiabilityService } from "../../../../api/openapi";
import { AsyncPipe, formatCurrency } from "@angular/common";
import dayjs from "dayjs/esm";
import { first } from "rxjs/operators";
import { MatFormField, MatInput, MatLabel, MatSuffix } from "@angular/material/input";
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from "@angular/material/datepicker";
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatIcon } from "@angular/material/icon";

export interface IngoingPaymentData {
  ingoingId: number;
}

type LiabilityGroup = {
  id: FormControl<number>;
  dueDate: FormControl<Date>;
  dueDateOrig: FormControl<Date>;
  amount: FormControl<number>;
  amountOrig: FormControl<number>;
  paid: FormControl<boolean>;
  deleted: FormControl<boolean>;
}

interface LoadState {
  id: number | null;
  status: "loading" | "loaded" | "error";
  liabilities: Liability[];
  error?: unknown;
}

@Component({
  selector: "app-ingoing-payment-dialog",
  imports: [
    MatDialogContent,
    DefaultLayoutAlignDirective,
    DefaultLayoutDirective,
    FlexModule,
    MatButton,
    MatDialogActions,
    AsyncPipe,
    MatFormField,
    MatLabel,
    MatDatepicker,
    MatDatepickerToggle,
    MatSuffix,
    MatDatepickerInput,
    ReactiveFormsModule,
    MatInput,
    MatIconButton,
    MatIcon
  ],
  templateUrl: "./ingoing-payment-dialog.component.html",
  styleUrl: "./ingoing-payment-dialog.component.scss"
})
export class IngoingPaymentDialogComponent implements OnInit {
  data = inject<IngoingPaymentData>(MAT_DIALOG_DATA);
  api = inject(DefaultService);
  liabilityService = inject(LiabilityService);
  dialogRef = inject<MatDialogRef<IngoingPaymentDialogComponent>>(MatDialogRef);
  invoice$: Observable<IngoingInvoice>;
  liabilityGroup: FormGroup<{
    entries: FormArray<FormGroup<LiabilityGroup>>
  }> = new FormGroup({
    entries: new FormArray([])
  });


  paid() {
    return this.liabilityGroup.controls.entries.controls.reduce<number>((prev, l) => l.get("paid").value ? l.get("amount").value + prev : prev, 0);
  }

  open() {
    return this.liabilityGroup.controls.entries.controls.reduce<number>((prev, l) => !l.get("paid").value ? l.get("amount").value + prev : prev, 0);
  }

  reloadLiabilities() {
    this.liabilityService.getLiabilities(0, 100, undefined, undefined, undefined, undefined, this.data.ingoingId).pipe(first()).subscribe(res => {
      this.liabilityGroup.controls.entries.clear({ emitEvent: false });
      res.sort((a, b) => {
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      }).forEach(item => {
        this.liabilityGroup.controls.entries.push(new FormGroup<LiabilityGroup>({
          id: new FormControl(item.id),
          dueDate: new FormControl(new Date(item.due_date)),
          dueDateOrig: new FormControl(new Date(item.due_date)),
          amount: new FormControl(item.amount),
          amountOrig: new FormControl(item.amount),
          paid: new FormControl(item.paid),
          deleted: new FormControl(false)
        }), { emitEvent: false });
      });
    });
  }

  ngOnInit() {
    this.invoice$ = this.api.readIngoingInvoiceIngoingInvoiceIngoingInvoiceIdGet(this.data.ingoingId);
    this.reloadLiabilities();
    this.liabilityGroup.valueChanges.subscribe(() => {
      if (this.liabilityGroup.controls.entries.length !== 0) {
        const last = this.liabilityGroup.controls.entries.at(-1);
        const latestDate = last.get("dueDate").value.getTime();
        const openAmountOrig = last.get("amountOrig").value;
        const openAmount = last.get("amount").value;
        let diffAmount = 0;
        this.liabilityGroup.controls.entries.controls.forEach((group, idx) => {
          const thisDiff = (group.get("amount").value - group.get("amountOrig").value);
          if (thisDiff !== 0) { // TODO this does not work atm
            if (thisDiff > openAmount) {
              group.patchValue({ amount: openAmountOrig }, { emitEvent: false });
              diffAmount += (openAmount - group.get("amountOrig").value);
            } else if (idx !== this.liabilityGroup.controls.entries.length - 1) {
              diffAmount += thisDiff;
            }
          }
          if (group.get("dueDate").value.getTime() > latestDate) {
            group.patchValue({ dueDate: new Date(latestDate) }, { emitEvent: false });
          }
        });
        last.patchValue({ amount: openAmount - diffAmount }, { emitEvent: false });
      }
    });
  }

  protected onCancelClick() {
    this.dialogRef.close();
  }

  protected readonly dayjs = dayjs;
  protected readonly formatCurrency = formatCurrency;

  protected onAddLine() {
    if (this.open() !== 0) {
      this.liabilityGroup.controls.entries.insert(0, new FormGroup({
        id: new FormControl(-1),
        amount: new FormControl(0),
        amountOrig: new FormControl(0),
        dueDate: new FormControl(new Date()),
        dueDateOrig: new FormControl(new Date()),
        paid: new FormControl(false),
        deleted: new FormControl(false)
      }));
    }
  }

  protected hasChangesControl(group: FormGroup<LiabilityGroup>, key: "amount" | "dueDate") {
    if (key === "amount") {
      return group.get("amount").value !== group.get(`amountOrig`).value;
    } else {
      return group.get("dueDate").value.getTime() !== group.get(`dueDateOrig`).value.getTime();
    }
  }

  protected hasChangesGroup(group: FormGroup<LiabilityGroup>) {
    return this.hasChangesControl(group, "amount") || this.hasChangesControl(group, "dueDate") || group.get("deleted").value || group.get("id").value === -1;
  }

  protected hasChanges() {
    return !!this.liabilityGroup.controls.entries.controls.find(grp => this.hasChangesGroup(grp));
  }

  protected toggleDelete(index: number) {
    const grp = this.liabilityGroup.controls.entries.at(index);
    if (grp.get("id").value === -1) {
      this.liabilityGroup.controls.entries.removeAt(index);
    } else {
      grp.patchValue({ deleted: !grp.get("deleted").value });
    }
  }

  protected onSave() {

  }
}
