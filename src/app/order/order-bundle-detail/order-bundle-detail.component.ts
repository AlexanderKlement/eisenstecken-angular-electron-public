import { Component, ComponentRef, OnInit } from '@angular/core';
import { InfoDataSource } from '../../shared/components/info-builder/info-builder.datasource';
import { TableDataSource } from '../../shared/components/table-builder/table-builder.datasource';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomButton, ToolbarComponent } from '../../shared/components/toolbar/toolbar.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { first } from 'rxjs/operators';
import { LockService } from '../../shared/services/lock.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileService } from '../../shared/services/file.service';
import { EmailService } from '../../shared/services/email.service';
import { SupplierDetailComponent } from '../../supplier/supplier-detail/supplier-detail.component';
import { AuthService } from '../../shared/services/auth.service';
import { OrderDetailComponent } from '../order-detail/order-detail.component';
import { Observable, Subscriber } from 'rxjs';
import {
  DefaultService,
  Order,
  OrderableType,
  OrderBundle,
  Supplier,
} from '../../../client/api';
import { InfoBuilderComponent } from '../../shared/components/info-builder/info-builder.component';
import { TableBuilderComponent } from '../../shared/components/table-builder/table-builder.component';

@Component({
  selector: 'app-order-bundle-detail',
  templateUrl: './order-bundle-detail.component.html',
  styleUrls: ['./order-bundle-detail.component.scss'],
  imports: [ToolbarComponent, InfoBuilderComponent, TableBuilderComponent],
})
export class OrderBundleDetailComponent implements OnInit {
  orderDataSource: TableDataSource<Order>;
  infoDataSource: InfoDataSource<OrderBundle>;
  public $refresh: Observable<void>;
  private $refreshSubscriber: Subscriber<void>;
  orderBundleId: number;

  buttons: CustomButton[] = [
    {
      name: 'Löschen',
      navigate: (): void => {
        this.orderDeleteClicked();
      },
    },
    {
      name: 'PDF neu generieren',
      navigate: (): void => {
        this.regeneratePdfClicked();
      },
    },
  ];

  constructor(
    private api: DefaultService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private file: FileService,
    private email: EmailService,
    public dialog: MatDialog,
    private locker: LockService,
    private snackBar: MatSnackBar
  ) {}

  private static instanceOfSupplier(object: any): object is Supplier {
    return object.type === OrderableType.SUPPLIER;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.orderBundleId = parseInt(params.id, 10);
      if (isNaN(this.orderBundleId)) {
        console.error('Cannot parse given id');
        this.router.navigate(['supplier']);
        return;
      }
      this.initOrderDataSource();
      this.initInfoDataSource();
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

  orderDeleteClicked(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Bestellung löschen?',
        text: 'Bestellung wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden!',
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api
          .deleteOrderBundleOrderBundleOrderBundleIdDelete(this.orderBundleId)
          .pipe(first())
          .subscribe(success => {
            if (success) {
              this.orderDataSource.loadData();
            } else {
              this.snackBar.open(
                'Bestellung konnte nicht gelöscht werden',
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

  private initInfoDataSource(): void {
    this.infoDataSource = new InfoDataSource<OrderBundle>(
      this.api.readOrderBundleOrderBundleOrderBundleIdGet(this.orderBundleId),
      [
        {
          property: 'order_from.name',
          name: 'Name',
        },
        {
          property: 'create_date_formatted',
          name: 'Bestelldatum',
        },
        {
          property: 'delivery_date_formatted',
          name: 'Lieferdatumdatum',
        },
        {
          property: 'user.fullname',
          name: 'Bestellung versendet:',
        },
      ],
      '/order/' + this.orderBundleId.toString(),
      undefined,
      undefined,
      undefined
    );
  }

  private initOrderDataSource(): void {
    this.orderDataSource = new TableDataSource(
      this.api,
      (api, filter, sortDirection, skip, limit) =>
        api.readOrdersByOrderBundleOrderBundleOrdersOrderBundleIdGet(
          this.orderBundleId,
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
              'order_to.name': dataSource.order_to.name,
            },
            route: () => {
              this.router.navigateByUrl('/order/' + dataSource.id.toString());
            },
            toolTip: OrderDetailComponent.extractOrderToolTips(dataSource),
          });
        });
        return rows;
      },
      [{ name: 'order_to.name', headerName: 'Ziel' }],
      api =>
        api.readOrdersByOrderBundleOrderBundleOrdersOrderBundleIdCountGet(
          this.orderBundleId
        )
    );
    this.orderDataSource.loadData();
  }

  private regeneratePdfClicked() {
    this.api
      .regenerateOrderBundlePdfOrderBundlePdfOrderBundleIdPut(
        this.orderBundleId
      )
      .pipe(first())
      .subscribe(orderBundle => {
        if (
          OrderBundleDetailComponent.instanceOfSupplier(orderBundle.order_from)
        ) {
          SupplierDetailComponent.sendAndDisplayOrderBundlePdf(
            this.api,
            this.authService,
            this.email,
            this.file,
            orderBundle,
            orderBundle.order_from,
            orderBundle.request
          );
        }
      });
  }
}
