import { Component, ComponentRef, OnInit, inject } from "@angular/core";
import { TableDataSource } from "../shared/components/table-builder/table-builder.datasource";
import {
  DefaultService, ScopeEnum,
  Stock,
  Supplier
} from "../../api/openapi";
import { LockService } from "../shared/services/lock.service";
import { CustomButton, ToolbarComponent } from "../shared/components/toolbar/toolbar.component";
import { ActivatedRoute, Router } from "@angular/router";
import { first } from "rxjs/operators";
import { AuthStateService } from "../shared/services/auth-state.service";
import { Observable, Subscriber } from "rxjs";
import { MatTabGroup, MatTab } from "@angular/material/tabs";
import { TableBuilderComponent } from "../shared/components/table-builder/table-builder.component";

@Component({
  selector: "app-supplier",
  templateUrl: "./supplier.component.html",
  styleUrls: ["./supplier.component.scss"],
  imports: [ToolbarComponent, MatTabGroup, MatTab, TableBuilderComponent]
})
export default class SupplierComponent implements OnInit {
  private api = inject(DefaultService);
  private locker = inject(LockService);
  private router = inject(Router);
  private authService = inject(AuthStateService);

  supplierTableDataSource: TableDataSource<Supplier, DefaultService>;
  stockTableDataSource: TableDataSource<Stock, DefaultService>;
  buttons: CustomButton[] = [];
  suppliersReadAllowed = false;
  stocksReadAllowed = false;

  public $refresh: Observable<void>;
  private $refreshSubscriber: Subscriber<void>;

  ngOnInit(): void {
    this.initSupplierDataSource();
    this.initStockDataSource();
    this.initRefreshObservables();
  }

  initRefreshObservables(): void {
    this.$refresh = new Observable<void>((subscriber) => {
      this.$refreshSubscriber = subscriber;
    });
  }

  onAttach(ref: ComponentRef<any>, activatedRoute: ActivatedRoute): void {
    this.$refreshSubscriber.next();
  }

  private initSupplierDataSource(): void {
    this.supplierTableDataSource = new TableDataSource(
      this.api,
      (api, filter, sortDirection, skip, limit) =>
        api.readSuppliersSupplierGet(skip, limit, filter, true),
      (dataSourceClasses) => {
        const rows = [];
        dataSourceClasses.forEach((dataSource) => {
          rows.push({
            values: {
              id: dataSource.id,
              name: dataSource.name
            },
            route: () => {
              this.router.navigateByUrl("supplier/" + dataSource.id.toString());
            }
          });
        });
        return rows;
      },
      [{ name: "name", headerName: "Name" }],
      (api) => api.readSupplierCountSupplierCountGet()
    );
    this.supplierTableDataSource.loadData();
    this.authService
      .currentUserHasScope(ScopeEnum.Office)
      .pipe(first())
      .subscribe((allowed) => {
        if (allowed) {
          this.buttons.push({
            name: "Neuer Lieferant",
            navigate: () => {
              this.router.navigateByUrl("supplier/edit/new");
            }
          });
        }
      });
    this.authService
      .currentUserHasScope(ScopeEnum.Office)
      .pipe(first())
      .subscribe((allowed) => {
        if (allowed) {
          this.buttons.push({
            name: "Neues Lager",
            navigate: () => {
              this.router.navigateByUrl("stock/edit/new");
            }
          });
        }
      });
    this.authService
      .currentUserHasScope(ScopeEnum.Office)
      .pipe(first())
      .subscribe((allowed) => {
        this.stocksReadAllowed = true;
      });
    this.authService
      .currentUserHasScope(ScopeEnum.Office)
      .pipe(first())
      .subscribe((allowed) => {
        this.suppliersReadAllowed = true;
      });
  }

  private initStockDataSource() {
    this.stockTableDataSource = new TableDataSource(
      this.api,
      (api, filter, sortDirection, skip, limit) =>
        api.readStocksStockGet(skip, limit, filter),
      (dataSourceClasses) => {
        const rows = [];
        dataSourceClasses.forEach((dataSource) => {
          rows.push({
            values: {
              id: dataSource.id,
              name: dataSource.name
            },
            route: () => {
              this.router.navigateByUrl("stock/" + dataSource.id.toString());
            }
          });
        });
        return rows;
      },
      [{ name: "name", headerName: "Name" }],
      (api) => api.readStockCountStockCountGet()
    );
    this.stockTableDataSource.loadData();
  }
}
