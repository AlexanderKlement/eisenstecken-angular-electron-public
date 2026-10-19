import { Component, inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogContent, MatDialogRef } from "@angular/material/dialog";
import {
  DefaultService,
  OutgoingInvoice,
  ReceivableCreate,
  ReceivablePatch,
  ReceivableService
} from "../../../../api/openapi";
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { BehaviorSubject, forkJoin } from "rxjs";
import { finalize, first } from "rxjs/operators";
import { ConfirmDialogComponent } from "../../../shared/components/confirm-dialog/confirm-dialog.component";
import { AsyncPipe, formatCurrency } from "@angular/common";
import dayjs from "dayjs/esm";
import {
  DefaultFlexDirective,
  DefaultLayoutAlignDirective,
  DefaultLayoutDirective,
  DefaultLayoutGapDirective,
  FlexModule
} from "ng-flex-layout";
import { MatButton, MatIconButton } from "@angular/material/button";
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from "@angular/material/datepicker";
import { MatError, MatFormField, MatInput, MatLabel, MatSuffix } from "@angular/material/input";
import { MatIcon } from "@angular/material/icon";
import { MatProgressSpinner } from "@angular/material/progress-spinner";

export interface OutgoingPaymentData {
  outgoingId: number;
}


type ReceivableGroup = {
  id: FormControl<number>;
  dueDate: FormControl<Date>;
  dueDateOrig: FormControl<Date>;
  amount: FormControl<number>;
  amountOrig: FormControl<number>;
  paid: FormControl<boolean>;
}

@Component({
  selector: "app-outgoing-payment-dialog",
  imports: [
    AsyncPipe,
    DefaultFlexDirective,
    DefaultLayoutAlignDirective,
    DefaultLayoutDirective,
    DefaultLayoutGapDirective,
    FlexModule,
    MatButton,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDialogActions,
    MatDialogContent,
    MatError,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    MatProgressSpinner,
    MatSuffix,
    ReactiveFormsModule
  ],
  templateUrl: "./outgoing-payment-dialog.component.html",
  styleUrl: "./outgoing-payment-dialog.component.scss"
})
export class OutgoingPaymentDialogComponent implements OnInit {
  private data = inject<OutgoingPaymentData>(MAT_DIALOG_DATA);
  private api = inject(DefaultService);
  private dialog = inject(MatDialog);
  private receivableService = inject(ReceivableService);
  dialogRef = inject<MatDialogRef<OutgoingPaymentDialogComponent>>(MatDialogRef);
  invoice: OutgoingInvoice | null = null;
  receivableGroup: FormGroup<{
    entries: FormArray<FormGroup<ReceivableGroup>>
  }> = new FormGroup({
    entries: new FormArray([])
  });
  receivableName = "";
  private loadingSubject = new BehaviorSubject<boolean>(true);
  public loading$ = this.loadingSubject.asObservable();

  paid() {
    return this.receivableGroup.controls.entries.controls.reduce<number>((prev, l) => l.get("paid").value ? l.get("amount").value + prev : prev, 0);
  }

  hasNew() {
    return this.receivableGroup.controls.entries.controls.reduce<boolean>((prev, l) => prev || this.isNew(l), false);
  }

  isNew(l: FormGroup<ReceivableGroup>) {
    return l.get("id").value === -1;
  }

  open() {
    return this.receivableGroup.controls.entries.controls.reduce<number>((prev, l) => !l.get("paid").value ? l.get("amount").value + prev : prev, 0);
  }

  reloadReceivables() {
    this.receivableService.getReceivables(0, 100, undefined, undefined, undefined, undefined, this.data.outgoingId).pipe(first()).subscribe(res => {
      this.loadingSubject.next(false);
      this.receivableGroup.controls.entries.clear({ emitEvent: false });
      res.sort((a, b) => {
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      }).forEach((item, index) => {

        const grp = new FormGroup<ReceivableGroup>({
          id: new FormControl(item.id),
          dueDate: new FormControl(new Date(item.due_date)),
          dueDateOrig: new FormControl(new Date(item.due_date)),
          amount: new FormControl(item.amount),
          amountOrig: new FormControl(item.amount),
          paid: new FormControl(item.paid)
        });
        if (item.paid) {
          grp.controls.amount.disable();
          grp.controls.dueDate.disable();
        } else if (index === res.length - 1) {
          grp.controls.amount.disable();
        }
        this.receivableGroup.controls.entries.push(grp, { emitEvent: false });
      });

    });


  }


  ngOnInit() {
    this.api.readOutgoingInvoiceOutgoingInvoiceOutgoingInvoiceIdGet(this.data.outgoingId).pipe(first()).subscribe((res) => {
      this.invoice = res;
      this.receivableName = `${res.name} - ${res.number}`;
      this.reloadReceivables();
    });

    this.receivableGroup.valueChanges.subscribe(() => {
      if (this.receivableGroup.controls.entries.length !== 0) {
        const last = this.receivableGroup.controls.entries.at(-1);
        const openAmountOrig = last.get("amountOrig").value;
        let diffAmount = 0;
        this.receivableGroup.controls.entries.controls.forEach((group, idx) => {
          if (idx < this.receivableGroup.controls.entries.length - 1) {
            const thisDiff = (group.get("amount").value - group.get("amountOrig").value);
            if (thisDiff !== 0) {
              if (thisDiff > openAmountOrig) {
                group.patchValue({ amount: openAmountOrig - diffAmount }, { emitEvent: false });
                diffAmount = openAmountOrig;
              } else if (diffAmount + thisDiff > openAmountOrig) {
                const remainder = openAmountOrig - diffAmount;
                group.patchValue({ amount: remainder }, { emitEvent: false });
                diffAmount += remainder;
              } else {
                diffAmount += thisDiff;
              }
            }
          }
        });
        last.patchValue({ amount: openAmountOrig - diffAmount }, { emitEvent: false });
      }
    });
  }

  protected onCancelClick() {
    this.dialogRef.close();
  }

  protected readonly dayjs = dayjs;
  protected readonly formatCurrency = formatCurrency;

  protected onAddLine() {
    if (this.open() !== 0 || this.receivableGroup.controls.entries.length === 0) {
      this.receivableGroup.controls.entries.insert(0, new FormGroup({
        id: new FormControl(-1),
        amount: new FormControl(0),
        amountOrig: new FormControl(0),
        dueDate: new FormControl(new Date()),
        dueDateOrig: new FormControl(new Date(0)),
        paid: new FormControl(false)
      }));
    }
  }

  protected hasChangesControl(group: FormGroup<ReceivableGroup>, key: "amount" | "dueDate") {
    if (key === "amount") {
      return group.get("amount").value !== group.get(`amountOrig`).value;
    } else {
      const date = group.get("dueDate").value;
      const dateOrig = group.get("dueDateOrig").value;
      if (!date || !dateOrig) {
        return false;
      }
      return date.getTime() !== dateOrig.getTime();
    }
  }

  protected hasChangesGroup(group: FormGroup<ReceivableGroup>) {
    return this.hasChangesControl(group, "amount") || this.hasChangesControl(group, "dueDate") || group.get("id").value === -1;
  }

  protected hasChanges() {
    if (this.receivableGroup.controls.entries.length !== 0) {
      return !!this.receivableGroup.controls.entries.controls.find(grp => this.hasChangesGroup(grp));
    }
    return false;
  }

  private maxDate() {
    const last = this.receivableGroup.controls.entries.at(-1);
    if (last) {
      return last.get("dueDate").value;
    }
    return undefined;
  }

  protected controlInvalid(group: FormGroup<ReceivableGroup>, key: "amount" | "dueDate") {
    if (!group)
      return false;
    if (group.get("paid").value) {
      return false;
    }
    if (key === "amount") {
      /*   const valid = group.get("amount").value >= 0;
         if (!valid) {
           group.get("amount").setErrors({ invalid: true });
           group.get("amount").markAsTouched();
         } else {
           group.get("amount").setErrors(null);
           group.get("amount").markAsTouched();
         } */
      return false;
    } else {
      const last = this.receivableGroup.controls.entries.at(-1);
      if (last.get("id").value === group.get("id").value) {
        const date = group.get("dueDate").value;
        if (!date) {
          group.get("dueDate").setErrors({ invalid: true });
          group.get("dueDate").markAsTouched();
        } else {
          group.get("dueDate").setErrors(null);
          group.get("dueDate").markAsTouched();
        }
        return !date;
      }
      const date = group.get("dueDate").value;
      const m = this.maxDate();
      const valid = !!date && !!m && (date.getTime() < m.getTime());
      if (!valid) {
        group.get("dueDate").setErrors({ invalid: true });
        group.get("dueDate").markAsTouched();
      } else {
        group.get("dueDate").setErrors(null);
        group.get("dueDate").markAsTouched();
      }
      return !valid;
    }
  }

  protected groupInvalid(group: FormGroup<ReceivableGroup>) {
    if (!group)
      return false;
    const amountInvalid = this.controlInvalid(group, "amount");
    const dateInvalid = this.controlInvalid(group, "dueDate");
    return amountInvalid || dateInvalid;
  }

  protected formInvalid() {
    if (this.receivableGroup.controls.entries.length !== 0) {
      return !!this.receivableGroup.controls.entries.controls.find(grp => this.groupInvalid(grp));
    }
    return false;
  }

  protected lastPaid() {
    if (this.receivableGroup.controls.entries.length !== 0) {
      return this.receivableGroup.controls.entries.at(-1).get("paid").value;
    }
    return true;
  }

  protected onDelete(index: number) {
    const grp = this.receivableGroup.controls.entries.at(index);
    if (grp) {
      const id = grp.get("id").value;
      if (id === -1) {
        this.receivableGroup.controls.entries.removeAt(index);
      } else {
        this.receivableService.deleteReceivable(id).pipe(first()).subscribe(() => {
          this.receivableGroup.controls.entries.removeAt(index);
          this.onRecalculateRest();
          this.onSave();
        });
      }
    }
  }

  protected onRecalculateRest() {
    if (this.invoice) {
      const amount = this.invoice.full_price_with_vat;
      let calculated = 0;
      const last = this.receivableGroup.controls.entries.at(-1);
      if (last) {
        this.receivableGroup.controls.entries.controls.forEach((grp) => {
          if (last.get("id").value !== grp.get("id").value) {
            calculated += grp.get("amount").value;
          }
        });
        if (calculated + last.get("amount").value !== amount) {
          last.patchValue({ amount: amount - calculated }, { emitEvent: false });
        }
      }
    }
  }

  protected onPayReceivable(id: number, paid: boolean) {
    if (paid) {
      this.receivableService.unpayReceivable(id).pipe(finalize(() => {
        this.reloadReceivables();
      })).subscribe();
    } else {
      this.receivableService.payReceivable(id).pipe(finalize(() => {
        this.reloadReceivables();
      })).subscribe();
    }
  }

  protected onPayAllRemaining() {
    const unpaid = this.receivableGroup.controls.entries.controls.filter(grp => !grp.get("paid").value);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "400px",
      data: {
        title: "Alles zahlen?",
        text: `Möchtest du die ${unpaid.length} offenen Verpflichtungen als bezahlt markieren?`
      }
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        forkJoin(
          unpaid.map(grp => {
            return this.receivableService.payReceivable(grp.get("id").value);
          })
        ).pipe(finalize(() => {
          this.reloadReceivables();
        })).subscribe();
      }
    });
  }

  protected onSave() {
    const creates: ReceivableCreate[] = [];
    const patches: Record<number, ReceivablePatch> = {};
    this.receivableGroup.controls.entries.controls.forEach((group) => {
      const id = group.get("id").value;
      const amount = group.get("amount").value;
      const dueDate = group.get("dueDate").value;
      const due_date = new Date(dueDate.getTime() + 7300_000).toISOString().split("T")[0];
      if (id === -1) {
        creates.push({
          name: this.receivableName,
          due_date,
          amount,
          outgoing_invoice_id: this.invoice.id
        });
      } else {
        if (this.hasChangesGroup(group)) {
          patches[id] = {
            amount,
            due_date
          };
        }
      }
    });
    const patchKeys: (keyof typeof patches)[] = Object.keys(patches).map(key => parseInt(key, 10));
    this.loadingSubject.next(true);
    forkJoin(
      Array(creates.length + patchKeys.length).fill(0).map((_, i) => {
        if (i < creates.length) {
          return this.receivableService.createReceivable(creates[i]);
        }
        const id = patchKeys[i - creates.length];
        return this.receivableService.patchReceivable(id, patches[id]);
      })
    ).pipe(finalize(() => {
      this.reloadReceivables();
    })).subscribe();
  }

  protected noop(): void {
    //
  }
}
