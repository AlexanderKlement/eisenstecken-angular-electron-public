import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TableDataSource } from "../../shared/components/table-builder/table-builder.datasource";
import dayjs from "dayjs/esm";
import { first, map } from "rxjs/operators";
import { Observable, Subscriber } from "rxjs";
import { CustomButton, ToolbarComponent } from "../../shared/components/toolbar/toolbar.component";
import { LockService } from "../../shared/services/lock.service";
import { AuthService } from "../../shared/services/auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { minutesToDisplayableString } from "../../shared/date.util";
import { formatCurrency, AsyncPipe, DecimalPipe, CurrencyPipe } from "@angular/common";
import {
  Recalculation,
  Paint,
  Workload,
  Expense,
  DefaultService,
  WoodList,
  Order,
  OrderSmall,
} from "../../../api/openapi";
import { DefaultLayoutDirective, DefaultLayoutAlignDirective } from "ng-flex-layout";
import { MatFormField, MatLabel, MatInput } from "@angular/material/input";
import { TableBuilderComponent } from "../../shared/components/table-builder/table-builder.component";

@Component({
  selector: 'app-recalculation-detail',
  templateUrl: './recalculation-detail.component.html',
  styleUrls: ['./recalculation-detail.component.scss'],
  imports: [
    ToolbarComponent,
    DefaultLayoutDirective,
    DefaultLayoutAlignDirective,
    MatFormField,
    MatLabel,
    MatInput,
    TableBuilderComponent,
    AsyncPipe,
    DecimalPipe,
    CurrencyPipe,
  ],
})
export class RecalculationDetailComponent implements OnInit {

  jobId: number;
  loading = true;
  recalculation: Recalculation;

  orderDataSource: TableDataSource<OrderSmall, DefaultService>;
  workloadDataSource: TableDataSource<Workload, DefaultService>;
  expenseDataSource: TableDataSource<Expense, DefaultService>;
  paintDataSource: TableDataSource<Paint, DefaultService>;
  woodListDataSource: TableDataSource<WoodList, DefaultService>;
  jobName$: Observable<string>;

  buttons: CustomButton[] = [];

  public $refresh: Observable<void>;
  private $refreshSubscriber: Subscriber<void>;

  constructor(private api: DefaultService, private router: Router, private route: ActivatedRoute,
              private locker: LockService, private authService: AuthService, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.jobId = parseInt(params.id, 10);
      if (isNaN(this.jobId)) {
        console.error("RecalculationDetail: Cannot parse jobId");
        this.router.navigateByUrl("recalculation");
        return;
      }
      this.api.readRecalculationByJobRecalculationJobJobIdGet(this.jobId).pipe().subscribe(recalculation => {
        if (recalculation === undefined || recalculation === null) {
          this.authService.currentUserHasRight("recalculations:create").pipe(first()).subscribe(allowed => {
            if (allowed) {
              this.router.navigateByUrl("recalculation/edit/new/" + this.jobId.toString(), { replaceUrl: true });
            } else {
              this.snackBar.open("Sie sind nicht berechtigt Nachkalkulationen zu erstellen!"
                , "Ok", {
                  duration: 10000,
                });
              this.router.navigateByUrl("recalculation");
            }
          });

          return;
        }
        this.recalculation = recalculation;
        this.initRecalculation();
        this.loading = false;
      });
    });
    this.authService.currentUserHasRight("recalculations:modify").pipe(first()).subscribe(allowed => {
      if (allowed) {
        this.buttons.push({
          name: "Bearbeiten",
          navigate: () => {
            this.editButtonClicked();
          },
        });
      }
    });
    this.initRefreshObservables();
  }

  initRefreshObservables(): void {
    this.$refresh = new Observable<void>((subscriber => {
      this.$refreshSubscriber = subscriber;
    }));
  }


  initRecalculation(): void {
    this.initOrderTable();
    this.initWorkloadTable();
    this.initExpenseTable();
    this.initPaintTable();
    this.initWoodListTable();
    this.jobName$ = this.api.readJobJobJobIdGet(this.jobId).pipe(
      first(),
      map(job => "Nachkalkulation: " + job.displayable_name),
    );
  }

  private initOrderTable() {
    this.orderDataSource = new TableDataSource(
      this.api,
      (api, filter, sortDirection, skip, limit) =>
        api.readOrdersToOrderToOrderableToIdGet(this.jobId, skip, limit, filter),
      (dataSourceClasses) => {
        const rows = [];
        dataSourceClasses.forEach((dataSource) => {
          rows.push(
            {
              values: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                "order_to.displayable_name": dataSource.order_to.displayable_name,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                "order_from.displayable_name": dataSource.order_from.displayable_name,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                create_date: dayjs(dataSource.create_date).format("L"),
                // eslint-disable-next-line @typescript-eslint/naming-convention
                delivery_date: dataSource.delivery_date === null ? "" : dayjs(dataSource.delivery_date).format("L"),
                status: dataSource.status_translation,
              },
              route: () => {
                this.router.navigateByUrl("/order/" + dataSource.id.toString());
              },
            });
        });
        return rows;
      },
      [
        { name: "order_to.displayable_name", headerName: "Ziel" },
        { name: "order_from.displayable_name", headerName: "Herkunft" },
        { name: "create_date", headerName: "Erstelldatum" },
        { name: "delivery_date", headerName: "Lieferdatum" },
        { name: "status", headerName: "Status" },
      ],
      (api) => api.readOrdersToCountOrderToOrderableToIdCountGet(this.jobId),
    );
    this.orderDataSource.loadData();
  }

  private initWorkloadTable() {
    this.workloadDataSource = new TableDataSource(
      this.api,
      (api, filter, sortDirection, skip, limit) =>
        api.readWorkloadsWorkloadGet(skip, limit, filter, undefined, this.jobId),
      (dataSourceClasses) => {
        const rows = [];
        dataSourceClasses.forEach((dataSource) => {
          rows.push(
            {
              values: {
                "user.fullname": dataSource.user.fullname,
                minutes: minutesToDisplayableString(dataSource.minutes),
                cost: formatCurrency(dataSource.cost, "de-DE", "EUR"),
              },
              route: () => {
                //this.router.navigateByUrl('/order/' + dataSource.id.toString());
              },
            });
        });
        return rows;
      },
      [
        { name: "user.fullname", headerName: "Name" },
        { name: "minutes", headerName: "Zeit" },
        { name: "cost", headerName: "Kosten" },
      ],
      (api) => api.readWorkloadCountWorkloadCountGet(undefined, this.jobId),
    );
    this.workloadDataSource.loadData();
  }

  private initExpenseTable() {
    this.expenseDataSource = new TableDataSource(
      this.api,
      (api, filter, sortDirection, skip, limit) =>
        api.readExpensesExpenseGet(skip, limit, filter, this.recalculation.id),
      (dataSourceClasses) => {
        const rows = [];
        dataSourceClasses.forEach((dataSource) => {
          rows.push(
            {
              values: {
                name: dataSource.name,
                amount: formatCurrency(dataSource.amount, "de-DE", "EUR"),
              },
              route: () => {
                //this.router.navigateByUrl('/order/' + dataSource.id.toString());
              },
            });
        });
        return rows;
      },
      [
        { name: "name", headerName: "Beschreibung" },
        { name: "amount", headerName: "Kosten" },
      ],
      (api) => api.readExpenseCountExpenseCountGet(this.recalculation.id),
    );
    this.expenseDataSource.loadData();
  }

  private initPaintTable() {
    this.paintDataSource = new TableDataSource(
      this.api,
      (api, filter, sortDirection, skip, limit) =>
        api.readPaintsPaintGet(skip, limit, filter, this.recalculation.id),
      (dataSourceClasses) => {
        const rows = [];
        dataSourceClasses.forEach((dataSource) => {
          rows.push(
            {
              values: {
                name: dataSource.name,
                price: formatCurrency(dataSource.price, "de-DE", "EUR"),
                unit: dataSource.unit.name.translation,
                amount: dataSource.amount,
                id: formatCurrency(dataSource.price * dataSource.amount, "de-DE", "EUR"),
              },
              route: () => {
                //this.router.navigateByUrl('/order/' + dataSource.id.toString());
              },
            });
        });
        return rows;
      },
      [
        { name: "name", headerName: "Beschreibung" },
        { name: "amount", headerName: "Menge" },
        { name: "unit", headerName: "Einheit" },
        { name: "price", headerName: "Einzelpreis" },
        { name: "id", headerName: "Gesamtpreis" },
      ],
      (api) => api.readPaintCountPaintCountGet(this.recalculation.id),
    );
    this.paintDataSource.loadData();
  }

  private initWoodListTable() {
    this.woodListDataSource = new TableDataSource(
      this.api,
      (api, filter, sortDirection, skip, limit) =>
        api.readWoodListsWoodListGet(skip, limit, filter, this.recalculation.id),
      (dataSourceClasses) => {
        const rows = [];
        dataSourceClasses.forEach((dataSource) => {
          rows.push(
            {
              values: {
                name: dataSource.name,
                price: formatCurrency(dataSource.price, "de-DE", "EUR"),
              },
              route: () => {
                //this.router.navigateByUrl('/order/' + dataSource.id.toString());
              },
            });
        });
        return rows;
      },
      [
        { name: "name", headerName: "Beschreibung" },
        { name: "price", headerName: "Preis" },
      ],
      (api) => api.readWoodListCountWoodListCountGet(this.recalculation.id),
    );
    this.woodListDataSource.loadData();
  }

  private editButtonClicked(): void {
    this.locker.getLockAndTryNavigate(
      this.api.islockedRecalculationRecalculationIslockedRecalculationIdGet(this.recalculation.id),
      this.api.lockRecalculationRecalculationLockRecalculationIdPost(this.recalculation.id),
      this.api.unlockRecalculationRecalculationUnlockRecalculationIdPost(this.recalculation.id),
      "recalculation/edit/" + this.recalculation.id.toString() + "/" + this.jobId.toString(),
    );
  }
}
