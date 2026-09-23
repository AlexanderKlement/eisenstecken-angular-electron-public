import { Component, inject, OnInit } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import { BehaviorSubject, Observable } from "rxjs";
import { Order } from "../../../../../api/openapi";
import { AsyncPipe } from "@angular/common";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { DefaultLayoutAlignDirective, DefaultLayoutDirective, FlexModule } from "ng-flex-layout";
import { MatButton } from "@angular/material/button";


export interface ShopOrderHistoryData {
  order: number;
}

@Component({
  selector: "app-shop-order-history",
  imports: [
    MatDialogTitle,
    MatDialogContent,
    AsyncPipe,
    MatProgressSpinner,
    DefaultLayoutAlignDirective,
    DefaultLayoutDirective,
    FlexModule,
    MatButton,
    MatDialogActions
  ],
  templateUrl: "./shop-order-history.component.html",
  styleUrl: "./shop-order-history.component.scss"
})
export class ShopOrderHistoryComponent implements OnInit {
  dialogRef = inject<MatDialogRef<ShopOrderHistoryComponent>>(MatDialogRef);
  data = inject<ShopOrderHistoryData>(MAT_DIALOG_DATA);
  history$: Observable<Order[]>;
  private loadingSubject = new BehaviorSubject<boolean>(true);
  public loading$ = this.loadingSubject.asObservable();

  ngOnInit() {
    console.log(`init ${this.data.order}`);
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

}
