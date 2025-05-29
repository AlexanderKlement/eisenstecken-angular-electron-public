import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { Order } from '../../../../client/api';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';
import {
  MatFormField,
  MatInput,
  MatLabel,
  MatSuffix,
} from '@angular/material/input';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
} from '@angular/material/datepicker';

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
  imports: [
    MatFormField,
    MatLabel,
    AsyncPipe,
    MatButton,
    MatSuffix,
    MatInput,
    MatFormField,
    MatDialogContent,
    MatDatepicker,
    MatDialogActions,
    MatDatepickerToggle,
    MatListOption,
    MatSelectionList,
    ReactiveFormsModule,
    MatDatepickerInput,
    MatDialogTitle,
    NgForOf,
    NgIf,
  ],
})
export class OrderDialogComponent implements OnInit {
  @ViewChild('orders') ordersSelected: MatSelectionList;
  dateControl: UntypedFormControl;
  error = false;

  constructor(
    public dialogRef: MatDialogRef<OrderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OrderDialogData
  ) {}

  ngOnInit(): void {
    this.dateControl = new UntypedFormControl(new Date());
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

  getReturnData(): OrderDateReturnData {
    const date = moment(this.dateControl.value);
    const keys = this.getSelectedKeys();
    return {
      orders: keys,
      date: date.format('YYYY-MM-DD'),
    };
  }

  onSubmitClick() {
    this.dialogRef.close(this.getReturnData());
  }
}
