import { Component, inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogContent, MatDialogRef } from "@angular/material/dialog";
import { DefaultService, OutgoingInvoice, ReceivableService } from "../../../../api/openapi";
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
import { MatButton } from "@angular/material/button";
import { MatProgressSpinner } from "@angular/material/progress-spinner";

export interface OutgoingPaymentData {
  outgoingId: number;
}


export declare type ReceivableGroup = {
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
    MatDialogActions,
    MatDialogContent,
    MatProgressSpinner,
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
  private loadingSubject = new BehaviorSubject<boolean>(true);
  public loading$ = this.loadingSubject.asObservable();

  paid() {
    return this.receivableGroup.controls.entries.controls.reduce<number>((prev, l) => l.get("paid").value ? l.get("amount").value + prev : prev, 0);
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
      this.reloadReceivables();
    });
  }

  protected onCancelClick() {
    this.dialogRef.close();
  }

  protected readonly dayjs = dayjs;
  protected readonly formatCurrency = formatCurrency;


  protected lastPaid() {
    if (this.receivableGroup.controls.entries.length !== 0) {
      return this.receivableGroup.controls.entries.at(-1).get("paid").value;
    }
    return true;
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

  protected noop(): void {
    //
  }
}
