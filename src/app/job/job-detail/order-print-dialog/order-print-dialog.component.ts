import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatSelectionList } from '@angular/material/list';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Order } from '../../../../client/api';

export interface OrderDialogData {
  name: Observable<string>;
  orders: Observable<Order[]>;
}

export interface OrderReturnData {
  orders: number[];
}

@Component({
  selector: 'app-order-print-dialog',
  templateUrl: './order-print-dialog.component.html',
  styleUrls: ['./order-print-dialog.component.scss'],
})
export class OrderPrintDialogComponent implements OnInit {
  @ViewChild('orders') ordersSelected: MatSelectionList;
  error = false;

  constructor(
    public dialogRef: MatDialogRef<OrderPrintDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OrderDialogData
  ) {}

  ngOnInit(): void {}

  onCancelClick(): void {
    this.dialogRef.close();
  }

  getSelectedKeys(): number[] {
    if (this.ordersSelected !== undefined) {
      return this.ordersSelected.selectedOptions.selected.map(obj =>
        parseInt(obj.value, 10)
      );
    } else {
      console.warn('OrderDialogComponent: Cannot get selected Options');
      return [];
    }
  }

  getReturnData(): OrderReturnData {
    const keys = this.getSelectedKeys();
    return {
      orders: keys,
    };
  }

  onSubmitClick() {
    this.dialogRef.close(this.getReturnData());
  }
}
