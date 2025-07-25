import { Component, ComponentRef, OnInit, ViewChild } from '@angular/core';
import { InfoDataSource } from '../../shared/components/info-builder/info-builder.datasource';
import { ActivatedRoute, Router } from '@angular/router';
import { TableDataSource } from '../../shared/components/table-builder/table-builder.datasource';
import {
  CustomButton,
  ToolbarComponent,
} from '../../shared/components/toolbar/toolbar.component';
import { InfoBuilderComponent } from '../../shared/components/info-builder/info-builder.component';
import { MatDialog } from '@angular/material/dialog';
import {
  OrderDateReturnData,
  OrderDialogComponent,
} from './order-dialog/order-dialog.component';
import { first, map } from 'rxjs/operators';
import * as moment from 'moment';
import { AuthService } from '../../shared/services/auth.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileService } from '../../shared/services/file.service';
import { EmailService } from '../../shared/services/email.service';
import { combineLatest, Observable, Subscriber } from 'rxjs';
import {
  DefaultService,
  Order,
  OrderBundle,
  OrderBundleCreate,
  OrderStatusType,
  Supplier,
} from '../../../client/api';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { TableBuilderComponent } from '../../shared/components/table-builder/table-builder.component';

@Component({
  selector: 'app-supplier-detail',
  templateUrl: './supplier-detail.component.html',
  styleUrls: ['./supplier-detail.component.scss'],
  imports: [
    ToolbarComponent,
    InfoBuilderComponent,
    MatTabGroup,
    MatTab,
    TableBuilderComponent,
  ],
})
export class SupplierDetailComponent implements OnInit {
  @ViewChild(InfoBuilderComponent) child: InfoBuilderComponent<Supplier>;
  public infoDataSource: InfoDataSource<Supplier>;
  public id: number;
  createdOrderDataSource: TableDataSource<Order>;
  orderedOrderDataSource: TableDataSource<OrderBundle>;
  deliveredOrderDataSource: TableDataSource<OrderBundle>;
  requestOrderDataSource: TableDataSource<OrderBundle>;
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
    private email: EmailService,
    public dialog: MatDialog
  ) {}

  static sendAndDisplayOrderBundlePdf(
    api: DefaultService,
    authService: AuthService,
    email: EmailService,
    file: FileService,
    orderBundle: OrderBundle,
    supplier: Supplier,
    request = false
  ) {
    let subject$ = api.getParameterParameterKeyGet('order_subject');
    let body$ = api.getParameterParameterKeyGet('order_mail');
    if (request) {
      subject$ = api.getParameterParameterKeyGet('order_subject_request');
      body$ = api.getParameterParameterKeyGet('order_mail_request');
    }

    combineLatest([subject$, body$])
      .pipe(first())
      .subscribe(([subject, body]) => {
        authService
          .getCurrentUser()
          .pipe(first())
          .subscribe(user => {
            body = body.replace('[NAME]', user.fullname);
            body = body.replace('[POSITION]', user.position);
            body = body.replace('[MOBILE]', user.handy);
            body = body.replace('[TEL]', user.tel);
            email.sendMail(
              supplier.mail1,
              subject,
              body,
              orderBundle.pdf_external
            );
          });
      });
    file.open(orderBundle.pdf_internal);
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      try {
        this.id = parseInt(params.id, 10);
      } catch {
        console.error('Cannot parse given id');
        this.router.navigateByUrl('supplier');
        return;
      }
      this.initSupplierDetail(this.id);
      this.initOrderTable(this.id);
    });
    this.authService
      .currentUserHasRight('suppliers:modify')
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
      .currentUserHasRight('orders:modify')
      .pipe(first())
      .subscribe(allowed => {
        if (allowed) {
          this.buttons.push({
            name: 'Bestellung(en) senden',
            navigate: () => {
              this.sendOrderButtonClicked(false);
            },
          });
          this.buttons.push({
            name: 'Anfrage(n) senden',
            navigate: () => {
              this.sendOrderButtonClicked(true);
            },
          });
        }
      });
    this.authService
      .currentUserHasRight('suppliers:delete')
      .pipe(first())
      .subscribe(allowed => {
        if (allowed) {
          this.buttons.push({
            name: 'Lieferant ausblenden',
            navigate: () => {
              this.supplierDeleteClicked();
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
              this.router.navigateByUrl(
                'supplier/articles/' + this.id.toString()
              );
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

  private initSupplierDetail(id: number): void {
    this.infoDataSource = new InfoDataSource<Supplier>(
      this.api.readSupplierSupplierSupplierIdGet(id),
      [
        {
          property: 'name',
          name: 'Name',
        },
        {
          property: 'mail1',
          name: 'Mail',
        },
        {
          property: 'mail2',
          name: 'Mail',
        },
        {
          property: 'tel1',
          name: 'Telefon',
        },
        {
          property: 'tel2',
          name: 'Telefon',
        },
        {
          property: 'address.street_number',
          name: 'Adresse',
        },
        {
          property: 'address.city',
          name: 'Gemeinde',
        },
        {
          property: 'contact_person',
          name: 'Ansprechpartner',
        },
      ],
      '/supplier/edit/' + this.id.toString(),
      this.api.islockedSupplierSupplierIslockedSupplierIdGet(this.id),
      this.api.lockSupplierSupplierLockSupplierIdPost(this.id),
      this.api.unlockSupplierSupplierUnlockSupplierIdPost(this.id)
    );
  }

  private initOrderTable(supplierId: number): void {
    this.createdOrderDataSource = new TableDataSource(
      this.api,
      (api, filter, sortDirection, skip, limit) =>
        api.readOrdersSupplierOrderSupplierSupplierIdGet(
          this.id,
          skip,
          limit,
          filter,
          OrderStatusType.CREATED
        ),
      dataSourceClasses => {
        const rows = [];
        dataSourceClasses.forEach(dataSource => {
          rows.push({
            values: {
              id: dataSource.id,
              // eslint-disable-next-line @typescript-eslint/naming-convention
              'order_to.displayable_name': dataSource.order_to.displayable_name,
              // eslint-disable-next-line @typescript-eslint/naming-convention
              description: dataSource.description,
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
        { name: 'id', headerName: 'ID' },
        { name: 'order_to.displayable_name', headerName: 'Ziel' },
        { name: 'description', headerName: 'Beschreibung' },
        { name: 'user.fullname', headerName: 'Bestellt von' },
      ],
      api =>
        api.readOrderCountOrderSupplierSupplierIdCountGet(
          supplierId,
          OrderStatusType.CREATED
        )
    );
    this.orderedOrderDataSource = new TableDataSource(
      this.api,
      (api, filter, sortDirection, skip, limit) =>
        api.readOrderBundleBySupplierOrderBundleSupplierSupplierIdGet(
          this.id,
          skip,
          limit,
          filter,
          OrderStatusType.ORDERED
        ),
      dataSourceClasses => {
        const rows = [];
        dataSourceClasses.forEach(dataSource => {
          rows.push({
            values: {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              create_date: moment(dataSource.create_date).format('L'),
              // eslint-disable-next-line @typescript-eslint/naming-convention
              delivery_date: moment(dataSource.delivery_date).format('L'),
              'user.fullname': dataSource.user.fullname,
            },
            route: () => {
              this.router.navigateByUrl(
                '/order_bundle/' + dataSource.id.toString()
              );
            },
          });
        });
        return rows;
      },
      [
        { name: 'create_date', headerName: 'Bestelldatum' },
        { name: 'delivery_date', headerName: 'Lieferdatum' },
        { name: 'user.fullname', headerName: 'Bestellt von' },
      ],
      api =>
        api.readCountOfOrderBundleBySupplierAndStatusOrderBundleSupplierSupplierIdCountGet(
          supplierId,
          OrderStatusType.ORDERED
        )
    );
    this.deliveredOrderDataSource = new TableDataSource(
      this.api,
      (api, filter, sortDirection, skip, limit) =>
        api.readOrderBundleBySupplierOrderBundleSupplierSupplierIdGet(
          this.id,
          skip,
          limit,
          filter,
          OrderStatusType.DELIVERED
        ),
      dataSourceClasses => {
        const rows = [];
        dataSourceClasses.forEach(dataSource => {
          rows.push({
            values: {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              create_date: moment(dataSource.create_date).format('L'),
              // eslint-disable-next-line @typescript-eslint/naming-convention
              delivery_date: moment(dataSource.delivery_date).format('L'),
              'user.fullname': dataSource.user.fullname,
            },
            route: () => {
              this.router.navigateByUrl(
                '/order_bundle/' + dataSource.id.toString()
              );
            },
          });
        });
        return rows;
      },
      [
        { name: 'create_date', headerName: 'Bestelldatum' },
        { name: 'delivery_date', headerName: 'Lieferdatum' },
        { name: 'user.fullname', headerName: 'Bestellt von' },
      ],
      api =>
        api.readCountOfOrderBundleBySupplierAndStatusOrderBundleSupplierSupplierIdCountGet(
          supplierId,
          OrderStatusType.DELIVERED
        )
    );
    this.requestOrderDataSource = new TableDataSource(
      this.api,
      (api, filter, sortDirection, skip, limit) =>
        api.readOrderBundleBySupplierOrderBundleSupplierSupplierIdGet(
          this.id,
          skip,
          limit,
          filter,
          undefined,
          true
        ),
      dataSourceClasses => {
        const rows = [];
        dataSourceClasses.forEach(dataSource => {
          rows.push({
            values: {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              create_date: moment(dataSource.create_date).format('L'),
              // eslint-disable-next-line @typescript-eslint/naming-convention
              delivery_date: moment(dataSource.delivery_date).format('L'),
              'user.fullname': dataSource.user.fullname,
            },
            route: () => {
              this.router.navigateByUrl(
                '/order_bundle/' + dataSource.id.toString()
              );
            },
          });
        });
        return rows;
      },
      [
        { name: 'create_date', headerName: 'Bestelldatum' },
        { name: 'delivery_date', headerName: 'Lieferdatum' },
        { name: 'user.fullname', headerName: 'Bestellt von' },
      ],
      api =>
        api.readCountOfOrderBundleBySupplierAndStatusOrderBundleSupplierSupplierIdCountGet(
          supplierId,
          OrderStatusType.DELIVERED
        )
    );
    this.createdOrderDataSource.loadData();
    this.orderedOrderDataSource.loadData();
    this.deliveredOrderDataSource.loadData();
    this.requestOrderDataSource.loadData();
  }

  private sendOrderButtonClicked(request: boolean): void {
    const dialogRef = this.dialog.open(OrderDialogComponent, {
      width: '400px',
      data: {
        name: this.api
          .readSupplierSupplierSupplierIdGet(this.id)
          .pipe(map(supplier => supplier.displayable_name)),
        orders: this.api.readOrdersSupplierOrderSupplierSupplierIdGet(
          this.id,
          0,
          1000,
          '',
          OrderStatusType.CREATED,
          request
        ),
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ordersToOrderSelected(result, request);
    });
  }

  private ordersToOrderSelected(
    orderDateReturnData: OrderDateReturnData,
    request: boolean
  ): void {
    this.api
      .readSupplierSupplierSupplierIdGet(this.id)
      .pipe(first())
      .subscribe(supplier => {
        const orderBundle: OrderBundleCreate = {
          description: '',
          orders: orderDateReturnData.orders,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          delivery_date: orderDateReturnData.date,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          order_from_id: supplier.id,
          request,
        };
        this.api
          .createOrderBundleOrderBundlePost(orderBundle)
          .pipe(first())
          .subscribe(newOrderBundle => {
            this.deliveredOrderDataSource.loadData();
            this.orderedOrderDataSource.loadData();
            this.createdOrderDataSource.loadData();
            SupplierDetailComponent.sendAndDisplayOrderBundlePdf(
              this.api,
              this.authService,
              this.email,
              this.file,
              newOrderBundle,
              supplier,
              request
            );
          });
      });
  }

  private supplierDeleteClicked() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Lieferant löschen?',
        text: 'Den Lieferanten ausblenden? Diese Aktion KANN rückgängig gemacht werden?',
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api
          .deleteSupplierSupplierSupplierIdDelete(this.id)
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
}
