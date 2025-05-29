import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Order } from '../../../../client/api';
import { MatButton } from '@angular/material/button';
import { AsyncPipe, NgForOf } from '@angular/common';

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
  imports: [
    MatSelectionList,
    MatDialogTitle,
    MatDialogContent,
    MatListOption,
    MatDialogActions,
    MatButton,
    AsyncPipe,
    NgForOf,
  ],
})
export class OrderPrintDialogComponent implements OnInit {
  @ViewChild('orders') ordersSelected: MatSelectionList;
  error = false;

  constructor(
    public dialogRef: MatDialogRef<OrderPrintDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OrderDialogData
  ) {}

  ngOnInit(): void {
    console.log('Order print dialog initialized');
  }

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
