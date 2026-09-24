import { Component, inject, OnInit } from "@angular/core";
import {
  DefaultService,
  Job,
  Order,
  OrderBundle,
  OrderBundleService,
  OrderedArticleService,
  Stock,
  Supplier,
  User
} from "../../../../api/openapi";
import { BehaviorSubject, concat, Observable, of, Subject } from "rxjs";
import { AuthStateService } from "../../../shared/services/auth-state.service";
import { catchError, distinctUntilChanged, first, switchMap, tap } from "rxjs/operators";
import { DefaultLayoutAlignDirective, DefaultLayoutDirective, DefaultLayoutGapDirective } from "ng-flex-layout";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatFormField, MatInput, MatLabel } from "@angular/material/input";
import { MatOption, MatSelect } from "@angular/material/select";
import { AsyncPipe, formatCurrency } from "@angular/common";
import { MtxSelect } from "@ng-matero/extensions/select";
import dayjs from "dayjs/esm";
import { TableDataSource } from "../../../shared/components/table-builder/table-builder.datasource";
import { TableBuilderComponent } from "../../../shared/components/table-builder/table-builder.component";
import { MatDialog } from "@angular/material/dialog";
import { ShopOrderHistoryComponent } from "../shop-order-history/shop-order-history/shop-order-history.component";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatIconButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { Router } from "@angular/router";

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
    MtxSelect,
    TableBuilderComponent,
    MatProgressSpinner,
    MatIconButton,
    MatIcon
  ],
  templateUrl: "./shop-orders.component.html",
  styleUrl: "./shop-orders.component.scss"
})
export class ShopOrdersComponent implements OnInit {
  private api = inject(DefaultService);
  private orderBundleService = inject(OrderBundleService);
  private orderedArticleService = inject(OrderedArticleService);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private authService = inject(AuthStateService);
  selectedOrder: OrderBundle | undefined;
  articlesDataSource: TableDataSource<Order, DefaultService> | undefined;

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
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
      this.orders$ = this.orderBundleService.searchShop(this.filterForm.get("year").value, this.filterForm.get("orderer").value);
    });
    this.authService.getCurrentUser().pipe(first()).subscribe((user) => {
      this.filterForm.patchValue({ orderer: user.id }, { emitEvent: true });
    });
  }

  protected readonly dayjs = dayjs;

  protected setSelectedOrder(order: OrderBundle) {
    this.selectedOrder = order;
    this.articlesDataSource = new TableDataSource(
      this.api,
      (api, filter, sortDirection, skip, limit) =>
        api.readOrdersByOrderBundleOrderBundleOrdersOrderBundleIdGet(order.id, skip, limit, filter),
      (dataSourceClasses) => {
        const rows = [];
        dataSourceClasses.forEach((order) => {
          order.articles.forEach((article) => {
            rows.push(
              {
                values: {
                  id: article.id,
                  article: `${article.name.translation_de} ${article.modNumber}`,
                  amount: article.amount,
                  price: formatCurrency(article.price, "de-DE", "€"),
                  sum: formatCurrency(article.price * article.amount, "de-DE", "€"),
                  condition: order.order_to.displayable_name,
                  commission: { id: order.order_to.id, displayable_name: order.order_to.displayable_name }
                },
                rowClass: "cell-f-2 cell-f-3-alt cell-1-f-alt cell-5-f",
                route: () => {
                  //this.router.navigateByUrl("order/" + order.id);

                }
              }
            );
          });
        });
        return rows;
      },
      [
        { name: "article", sortable: true, headerName: "Artikel" },
        { name: "amount", sortable: false, headerName: "Menge" },
        { name: "price", sortable: false, headerName: "Preis" },
        { name: "sum", sortable: false, headerName: "Summe" },
        {
          name: "commission", sortable: false, asInput: {
            type: "select-autocomplete",
            typeahead: this.commissionInput$,
            loading: () => {
              console.log("loading check");
              return this.jobsLoading || this.stocksLoading;
            },
            items: this.commissions$,
            trackByFunc: this.trackByFnCommission,
            label: "Neue Komission",
            onChange: ($event, id) => {
              const jobSupplier: Job | Supplier = $event;
              const articleId = typeof id === "string" ? parseInt(id, 10) : id;
              this.loadingSubject.next(true);
              this.orderedArticleService.moveOrderedArticle(articleId, jobSupplier.id).pipe(first()).subscribe((res) => {
                this.loadingSubject.next(false);
                this.articlesDataSource.loadData();
              });
            }
          }, headerName: "Komission"
        }
      ],
      (api) => api.readOrdersByOrderBundleOrderBundleOrdersOrderBundleIdCountGet(order.id)
    );
    this.articlesDataSource.loadData();
  }

  onOpenHistory() {
    if (this.selectedOrder) {
      this.dialog.open(ShopOrderHistoryComponent, {
        width: "800px",
        data: {
          orderBundleId: this.selectedOrder.id
        }
      });
    }
  }
}
