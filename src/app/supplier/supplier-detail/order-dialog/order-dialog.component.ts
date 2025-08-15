import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatSelectionList } from "@angular/material/list";
import { Observable } from "rxjs";
import * as moment from "moment";
import { UntypedFormControl } from "@angular/forms";
import { Order } from "../../../../api/openapi";

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
    const date = moment(this.dateControl.value);
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
