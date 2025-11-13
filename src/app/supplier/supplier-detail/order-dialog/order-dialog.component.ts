import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from "@angular/material/dialog";
import { MatSelectionList, MatListOption } from "@angular/material/list";
import { Observable } from "rxjs";
import dayjs from "dayjs";
import { UntypedFormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Order } from "../../../../api/openapi";
import { DefaultLayoutDirective, DefaultLayoutAlignDirective } from "ng-flex-layout";
import { MatFormField, MatLabel, MatInput, MatSuffix } from "@angular/material/input";
import { MatDatepickerInput, MatDatepickerToggle, MatDatepicker } from "@angular/material/datepicker";
import { MatButton } from "@angular/material/button";
import { AsyncPipe } from "@angular/common";

export interface OrderDialogData {
  name: Observable<string>;
  orders: Observable<Order[]>;
}

export interface OrderDateReturnData {
  orders: number[];
  date: string;
}

@Component({
    selector: 'app-order-dialog',
    templateUrl: './order-dialog.component.html',
    styleUrls: ['./order-dialog.component.scss'],
    imports: [MatDialogTitle, MatDialogContent, DefaultLayoutDirective, DefaultLayoutAlignDirective, MatSelectionList, MatListOption, MatFormField, MatLabel, MatInput, FormsModule, MatDatepickerInput, ReactiveFormsModule, MatDatepickerToggle, MatSuffix, MatDatepicker, MatDialogActions, MatButton, AsyncPipe]
})
export class OrderDialogComponent implements OnInit {

  @ViewChild('orders') ordersSelected: MatSelectionList;
  dateControl: UntypedFormControl;
  error = false;

  constructor(public dialogRef: MatDialogRef<OrderDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: OrderDialogData) {
  }

  ngOnInit(): void {
    this.dateControl = new UntypedFormControl(new Date());
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  getSelectedKeys(): number[] {
    if (this.ordersSelected !== undefined) {
      return this.ordersSelected.selectedOptions.selected.map((obj) => parseInt(obj.value, 10));
    } else {
      console.warn("OrderDialogComponent: Cannot get selected Options");
      return [];
    }
  }

  getReturnData(): OrderDateReturnData {
    const date = dayjs(this.dateControl.value);
    const keys = this.getSelectedKeys();
    return {
      orders: keys,
      date: date.format("YYYY-MM-DD"),
    };
  }

  onSubmitClick() {
    this.dialogRef.close(this.getReturnData());
  }
}
