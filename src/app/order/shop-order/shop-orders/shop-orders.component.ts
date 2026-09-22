import { Component, inject, OnInit } from "@angular/core";
import { DefaultService, Job, OrderBundle, OrderBundleService, Stock, Supplier, User } from "../../../../api/openapi";
import { concat, Observable, of, Subject } from "rxjs";
import { AuthStateService } from "../../../shared/services/auth-state.service";
import { catchError, distinctUntilChanged, first, switchMap, tap } from "rxjs/operators";
import { DefaultLayoutAlignDirective, DefaultLayoutDirective, DefaultLayoutGapDirective } from "ng-flex-layout";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatFormField, MatInput, MatLabel } from "@angular/material/input";
import { MatOption, MatSelect } from "@angular/material/select";
import { AsyncPipe } from "@angular/common";
import { MtxSelect } from "@ng-matero/extensions/select";
import dayjs from "dayjs/esm";

type OrderBundleFilter = {
  commission: FormControl<number>;
  orderer: FormControl<number>;
  year: FormControl<number>;
  supplier: FormControl<number>;
}

@Component({
  selector: "app-shop-orders",
  imports: [
    DefaultLayoutDirective,
    DefaultLayoutAlignDirective,
    DefaultLayoutGapDirective,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatSelect,
    AsyncPipe,
    MatOption,
    MtxSelect
  ],
  templateUrl: "./shop-orders.component.html",
  styleUrl: "./shop-orders.component.scss"
})
export class ShopOrdersComponent implements OnInit {
  private api = inject(DefaultService);
  private orderBundleService = inject(OrderBundleService);
  private authService = inject(AuthStateService);
  filterForm = new FormGroup<OrderBundleFilter>({
    commission: new FormControl<number>(-1),
    orderer: new FormControl<number>(-1),
    supplier: new FormControl<number>(-1),
    year: new FormControl<number>(new Date().getFullYear())
  });
  orders$: Observable<OrderBundle[]>;
  users$: Observable<User[]>;
  suppliersInput$ = new Subject<string>();
  suppliersLoading = false;
  suppliers$: Observable<Supplier[]> = concat(
    of([]), // default items
    this.suppliersInput$.pipe(
      distinctUntilChanged(),
      tap(() => (this.suppliersLoading = true)),
      switchMap(term =>
        this.api.readSuppliersSupplierGet(0, 20, term, false, false).pipe(
          catchError(() => of([])), // empty list on error
          tap(() => (this.suppliersLoading = false))
        )
      )
    )
  );
  trackByFnSupplier = (item: Supplier) => `supplier-${item.id}`;
  commissionInput$ = new Subject<string>();
  jobsLoading = false;
  stocksLoading = false;
  commissions$: Observable<(Job | Stock)[]> = concat(
    of([]), // default items
    this.commissionInput$.pipe(
      distinctUntilChanged(),
      tap(() => (this.jobsLoading = true)),
      switchMap(term =>
        this.api.readJobsJobGet(0, 20, term).pipe(
          catchError(() => of([])), // empty list on error
          tap(() => (this.jobsLoading = false))
        )
      )
    ),
    this.commissionInput$.pipe(
      tap(() => (this.stocksLoading = true)),
      switchMap(term =>
        this.api.readStocksStockGet(0, 20, term).pipe(
          catchError(() => of([])), // empty list on error
          tap(() => (this.stocksLoading = false))
        ))
    )
  );
  trackByFnCommission = (item: Job | Stock) => `commission-${item.id}`;

  ngOnInit() {
    this.users$ = this.api.readUsersUsersGet(0, undefined, 100);
    this.filterForm.valueChanges.subscribe(() => {
      console.log("value-changed");
      this.orders$ = this.orderBundleService.findShopOrderBundleOrderBundleV2ShopSearchGet(this.filterForm.get("year").value, this.filterForm.get("orderer").value);
    });
    this.authService.getCurrentUser().pipe(first()).subscribe((user) => {
      this.filterForm.patchValue({ orderer: user.id }, { emitEvent: true });
    });
  }

  protected readonly dayjs = dayjs;
}
