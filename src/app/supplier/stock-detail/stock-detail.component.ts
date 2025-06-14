import { Component, ComponentRef, OnInit, ViewChild } from '@angular/core';
import { InfoBuilderComponent } from '../../shared/components/info-builder/info-builder.component';
import { InfoDataSource } from '../../shared/components/info-builder/info-builder.datasource';
import { TableDataSource } from '../../shared/components/table-builder/table-builder.datasource';
import { CustomButton, ToolbarComponent } from '../../shared/components/toolbar/toolbar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { AuthService } from '../../shared/services/auth.service';
import { first, map } from 'rxjs/operators';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  OrderDateReturnData,
  OrderDialogComponent,
} from '../supplier-detail/order-dialog/order-dialog.component';
import { FileService } from '../../shared/services/file.service';
import { Observable, Subscriber } from 'rxjs';
import {
  DefaultService,
  Order,
  OrderBundleCreate,
  OrderStatusType,
  Stock,
  Supplier,
} from '../../../client/api';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { TableBuilderComponent } from '../../shared/components/table-builder/table-builder.component';

@Component({
  selector: 'app-stock-detail',
  templateUrl: './stock-detail.component.html',
  styleUrls: ['./stock-detail.component.scss'],
  imports: [
    ToolbarComponent,
    InfoBuilderComponent,
    MatTabGroup,
    MatTab,
    TableBuilderComponent,
  ],
})
export class StockDetailComponent implements OnInit {
  @ViewChild(InfoBuilderComponent) child: InfoBuilderComponent<Supplier>;
  public infoDataSource: InfoDataSource<Stock>;
  public id: number;
  ingoingDataSource: TableDataSource<Order>;
  outgoingDataSource: TableDataSource<Order>;
  buttons: CustomButton[] = [];

  public $refresh: Observable<void>;
  private $refreshSubscriber: Subscriber<void>;

  constructor(
    private api: DefaultService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private file: FileService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      try {
        this.id = parseInt(params.id, 10);
      } catch {
        console.error('Cannot parse given id');
        this.router.navigateByUrl('supplier');
        return;
      }
      this.initStockDetail(this.id);
      this.initOrderTable();
    });
    this.authService
      .currentUserHasRight('stocks:modify')
      .pipe(first())
      .subscribe(allowed => {
        if (allowed) {
          this.buttons.push({
            name: 'Bearbeiten',
            navigate: () => {
              this.child.editButtonClicked();
            },
          });
        }
      });
    this.authService
      .currentUserHasRight('stocks:delete')
      .pipe(first())
      .subscribe(allowed => {
        if (allowed) {
          this.buttons.push({
            name: 'Lager ausblenden',
            navigate: () => {
              this.stockDeleteClicked();
            },
          });
        }
      });
    this.authService
      .currentUserHasRight('orders:modify')
      .pipe(first())
      .subscribe(allowed => {
        if (allowed) {
          this.buttons.push({
            name: 'Bestellung(en) senden',
            navigate: () => {
              this.sendOrderButtonClicked();
            },
          });
        }
      });
    this.authService
      .currentUserHasRight('articles:all')
      .pipe(first())
      .subscribe(allowed => {
        if (allowed) {
          this.buttons.push({
            name: 'Artikel',
            navigate: () => {
              this.router.navigateByUrl('stock/articles/' + this.id.toString());
            },
          });
        }
      });
    this.initRefreshObservables();
  }

  initRefreshObservables(): void {
    this.$refresh = new Observable<void>(subscriber => {
      this.$refreshSubscriber = subscriber;
    });
  }

  onAttach(ref: ComponentRef<any>, activatedRoute: ActivatedRoute): void {
    this.$refreshSubscriber.next();
  }

  private initStockDetail(id: number): void {
    this.infoDataSource = new InfoDataSource<Stock>(
      this.api.readStockStockStockIdGet(id),
      [
        {
          property: 'name',
          name: 'Name',
        },
      ],
      '/stock/edit/' + this.id.toString(),
      this.api.islockedStockStockIslockedStockIdGet(this.id),
      this.api.lockStockStockLockStockIdPost(this.id),
      this.api.unlockStockStockUnlockStockIdPost(this.id)
    );
  }

  private initOrderTable(): void {
    this.ingoingDataSource = new TableDataSource(
      this.api,
      (api, filter, sortDirection, skip, limit) =>
        api.readOrdersToOrderToOrderableToIdGet(this.id, skip, limit, filter),
      dataSourceClasses => {
        const rows = [];
        dataSourceClasses.forEach(dataSource => {
          rows.push({
            values: {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              'order_from.displayable_name':
                dataSource.order_from.displayable_name,
              articles: dataSource.articles[0].article.name.translation,
              // eslint-disable-next-line @typescript-eslint/naming-convention
              create_date: moment(dataSource.create_date).format('L'),
              // eslint-disable-next-line @typescript-eslint/naming-convention
              delivery_date:
                dataSource.delivery_date !== null
                  ? moment(dataSource.delivery_date).format('L')
                  : '',
              'user.fullname': dataSource.user.fullname,
            },
            route: () => {
              this.router.navigateByUrl('/order/' + dataSource.id.toString());
            },
          });
        });
        return rows;
      },
      [
        { name: 'order_from.displayable_name', headerName: 'Lieferant' },
        { name: 'articles', headerName: 'Artikel' },
        { name: 'create_date', headerName: 'Bestelldatum' },
        { name: 'delivery_date', headerName: 'Lieferdatum' },
        { name: 'user.fullname', headerName: 'Bestellt von' },
      ],
      api => api.readOrdersToCountOrderToOrderableToIdCountGet(this.id)
    );
    this.outgoingDataSource = new TableDataSource(
      this.api,
      (api, filter, sortDirection, skip, limit) =>
        api.readOrdersFromOrderFromOrderableFromIdGet(
          this.id,
          skip,
          limit,
          filter
        ),
      dataSourceClasses => {
        const rows = [];
        dataSourceClasses.forEach(dataSource => {
          rows.push({
            values: {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              'order_to.displayable_name': dataSource.order_to.displayable_name,
              // eslint-disable-next-line @typescript-eslint/naming-convention
              create_date: moment(dataSource.create_date).format('LLLL'),
              articles: dataSource.articles[0].article.name.translation,
              // eslint-disable-next-line @typescript-eslint/naming-convention
              delivery_date:
                dataSource.delivery_date !== null
                  ? moment(dataSource.delivery_date).format('L')
                  : '',
              'user.fullname': dataSource.user.fullname,
              status: dataSource.status_translation,
            },
            route: () => {
              this.router.navigateByUrl('/order/' + dataSource.id.toString());
            },
          });
        });
        return rows;
      },
      [
        { name: 'order_to.displayable_name', headerName: 'Auftrag' },
        { name: 'articles', headerName: 'Artikel' },
        { name: 'create_date', headerName: 'Bestelldatum' },
        { name: 'delivery_date', headerName: 'Lieferdatum' },
        { name: 'user.fullname', headerName: 'Bestellt von' },
      ],
      api => api.readOrdersFromCountOrderFromOrderableFromIdCountGet(this.id)
    );
    this.ingoingDataSource.loadData();
    this.outgoingDataSource.loadData();
  }

  private stockDeleteClicked() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Lager löschen?',
        text: 'Das Lager ausblenden? Diese Aktion KANN rückgängig gemacht werden?',
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api
          .deleteStockStockStockIdDelete(this.id)
          .pipe(first())
          .subscribe(success => {
            if (success) {
              this.router.navigateByUrl('supplier');
            } else {
              this.snackBar.open(
                'Beim Ausblenden ist ein Fehler aufgetreten',
                'Ok',
                {
                  duration: 10000,
                }
              );
              console.error('Could not delete order bundle');
            }
          });
      }
    });
  }

  private sendOrderButtonClicked(): void {
    const dialogRef = this.dialog.open(OrderDialogComponent, {
      width: '400px',
      data: {
        name: this.api
          .readStockStockStockIdGet(this.id)
          .pipe(map(supplier => supplier.displayable_name)),
        orders: this.api.readOrdersFromOrderFromOrderableFromIdGet(
          this.id,
          0,
          1000,
          '',
          OrderStatusType.CREATED
        ),
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ordersToOrderSelected(result);
    });
  }

  private ordersToOrderSelected(
    orderDateReturnData: OrderDateReturnData
  ): void {
    this.api
      .readStockStockStockIdGet(this.id)
      .pipe(first())
      .subscribe(stock => {
        const orderBundle: OrderBundleCreate = {
          description: '',
          orders: orderDateReturnData.orders,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          delivery_date: orderDateReturnData.date,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          order_from_id: stock.id,
          request: false,
        };
        this.api
          .createOrderBundleOrderBundlePost(orderBundle)
          .pipe(first())
          .subscribe(newOrderBundle => {
            this.ingoingDataSource.loadData();
            this.outgoingDataSource.loadData();
            this.snackBar.open('Erfolgreich bestellt!', 'Ok', {
              duration: 1000,
            });
          });
      });
  }
}
