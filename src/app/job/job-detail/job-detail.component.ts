import {Component, OnInit, ViewChild} from '@angular/core';
import {InfoDataSource} from '../../shared/components/info-builder/info-builder.datasource';
import {Job, DefaultService, Offer, OutgoingInvoice, Order} from 'eisenstecken-openapi-angular-library';
import {ActivatedRoute, Router} from '@angular/router';
import {InfoBuilderComponent} from '../../shared/components/info-builder/info-builder.component';
import {first, map} from 'rxjs/operators';
import {TableDataSource} from '../../shared/components/table-builder/table-builder.datasource';
import {LockService} from '../../shared/services/lock.service';
import * as moment from 'moment';
import {AuthService} from '../../shared/services/auth.service';
import {ConfirmDialogComponent} from '../../shared/components/confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {formatCurrency} from '@angular/common';
import {
    OrderReturnData
} from './order-print-dialog/order-print-dialog.component';
import {OrderPrintDialogComponent} from './order-print-dialog/order-print-dialog.component';
import {FileService} from '../../shared/services/file.service';

@Component({
    selector: 'app-job-detail',
    templateUrl: './job-detail.component.html',
    styleUrls: ['./job-detail.component.scss']
})
export class JobDetailComponent implements OnInit {

    @ViewChild(InfoBuilderComponent) child: InfoBuilderComponent<Job>;

    public infoDataSource: InfoDataSource<Job>;
    public jobId: number;
    public isMainJob = true;
    public clientId: number;

    buttonsMain = [];

    buttonsSub = [];


    offerDataSource: TableDataSource<Offer>;
    outgoingInvoiceDataSource: TableDataSource<OutgoingInvoice>;
    subJobDataSource: TableDataSource<Job>;
    orderDataSource: TableDataSource<Order>;
    ordersAllowed = false;
    outgoingInvoicesAllowed = false;
    offersAllowed = false;
    title = '';

    constructor(private api: DefaultService, private router: Router, private route: ActivatedRoute, private snackBar: MatSnackBar,
                private locker: LockService, private authService: AuthService, private dialog: MatDialog, private file: FileService) {
    }

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            let id: number;

            try {
                id = parseInt(params.id, 10);
            } catch {
                console.error('Cannot parse given id');
                this.router.navigate(['Job']);
                return;
            }
            this.jobId = id;
            this.api.readJobJobJobIdGet(this.jobId).pipe(first()).subscribe((job) => {
                this.isMainJob = job.is_main;
                this.title = 'Auftrag: ' + job.displayable_name;
                this.clientId = job.client.id;
            });
            this.initOfferTable();
            this.initSubJobTable();
            this.initOutgoingInvoiceTable();
            this.initJobDetail(id);
            this.initOrderTable();
        });
        this.initAccessRights();
    }

    initSubJobTable() {
        this.subJobDataSource = new TableDataSource(
            this.api,
            (api, filter, sortDirection, skip, limit) =>
                api.readSubjobsByJobJobSubjobByJobJobIdGet(this.jobId, filter, skip, limit),
            (dataSourceClasses) => {
                const rows = [];
                dataSourceClasses.forEach((dataSource) => {
                    rows.push(
                        {
                            values: {
                                name: dataSource.code + ' - ' + dataSource.name,
                            },
                            route: () => {
                                this.router.navigateByUrl('/job/' + dataSource.id.toString());
                            }
                        });
                });
                return rows;
            },
            [
                {name: 'name', headerName: 'Name'}
            ],
            (api) => api.readSubjobCountByJobJobSubjobCountByJobJobIdGet(this.jobId)
        );
        this.subJobDataSource.loadData();
    }

    initOfferTable() {
        this.offerDataSource = new TableDataSource(
            this.api,
            (api, filter, sortDirection, skip, limit) => api.readOffersByJobOfferJobJobIdGet(this.jobId, filter, skip, limit),
            (dataSourceClasses) => {
                const rows = [];
                dataSourceClasses.forEach((dataSource) => {
                    rows.push(
                        {
                            values: {
                                id: dataSource.id,
                                date: moment(dataSource.date).format('L'),
                                // eslint-disable-next-line @typescript-eslint/naming-convention
                                full_price_without_vat: formatCurrency(dataSource.full_price_without_vat, 'de-DE', 'EUR')
                            },
                            route: () => {
                                this.authService.currentUserHasRight('offers:modify').pipe(first()).subscribe(allowed => {
                                    if (allowed) {
                                        this.locker.getLockAndTryNavigate(
                                            this.api.islockedOfferOfferIslockedOfferIdGet(dataSource.id),
                                            this.api.lockOfferOfferLockOfferIdPost(dataSource.id),
                                            this.api.lockOfferOfferUnlockOfferIdPost(dataSource.id),
                                            'offer/edit/' + dataSource.id.toString()
                                        );
                                    }
                                });
                            }
                        });
                });
                return rows;
            },
            [
                {name: 'id', headerName: 'ID'},
                {name: 'date', headerName: 'Datum'},
                {name: 'full_price_without_vat', headerName: 'Preis'}
            ],
            (api) => api.countOffersByJobOfferJobCountJobIdGet(this.jobId)
        );
        this.offerDataSource.loadData();
    }

    initOutgoingInvoiceTable() {
        this.outgoingInvoiceDataSource = new TableDataSource(
            this.api,
            (api, filter, sortDirection, skip, limit) =>
                api.readOutgoingInvoicesByJobOutgoingInvoiceJobJobIdGet(this.jobId, filter, skip, limit),
            (dataSourceClasses) => {
                const rows = [];
                dataSourceClasses.forEach((dataSource) => {
                    rows.push(
                        {
                            values: {
                                // eslint-disable-next-line @typescript-eslint/naming-convention
                                client_name: dataSource.client_name,
                                date: moment(dataSource.date, 'YYYY-MM-DD').format('L'),
                                id: dataSource.number
                            },
                            route: () => {
                                this.authService.currentUserHasRight('outgoing_invoices:modify').pipe(first()).subscribe(allowed => {
                                    if (allowed) {
                                        this.locker.getLockAndTryNavigate(
                                            this.api.islockedOutgoingInvoiceOutgoingInvoiceIslockedOutgoingInvoiceIdGet(dataSource.id),
                                            this.api.lockOutgoingInvoiceOutgoingInvoiceLockOutgoingInvoiceIdPost(dataSource.id),
                                            this.api.unlockOutgoingInvoiceOutgoingInvoiceUnlockOutgoingInvoiceIdPost(dataSource.id),
                                            'outgoing_invoice/edit/' + dataSource.id.toString()
                                        );
                                    }
                                });

                            }
                        });
                });
                return rows;
            },
            [
                {name: 'client_name', headerName: 'Kunde'},
                {name: 'id', headerName: 'Nummer'},
                {name: 'date', headerName: 'Datum'}
            ],
            (api) => api.countOutgoingInvoicesByJobOutgoingInvoiceJobCountJobIdGet(this.jobId)
        );
        this.outgoingInvoiceDataSource.loadData();
    }

    initJobDetail(id: number) {
        this.infoDataSource = new InfoDataSource<Job>(
            this.api.readJobJobJobIdGet(id),
            [
                {
                    property: 'name',
                    name: 'Name'
                },
                {
                    property: 'code',
                    name: 'Kodex'
                },
                {
                    property: 'client.fullname',
                    name: 'Kunde'
                },
                {
                    property: 'responsible.fullname',
                    name: 'Zuständig'
                }
            ],
            '/job/edit/' + this.jobId.toString(),
            this.api.islockedJobJobIslockedJobIdGet(this.jobId),
            this.api.lockJobJobLockJobIdPost(this.jobId),
            this.api.unlockJobJobUnlockJobIdPost(this.jobId)
        );
    }

    private initOrderTable(): void {
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
                                'order_to.displayable_name': dataSource.order_to.displayable_name,
                                // eslint-disable-next-line @typescript-eslint/naming-convention
                                'order_from.displayable_name': dataSource.order_from.displayable_name,
                                // eslint-disable-next-line @typescript-eslint/naming-convention
                                create_date: moment(dataSource.create_date).format('L'),
                                // eslint-disable-next-line @typescript-eslint/naming-convention
                                delivery_date: dataSource.delivery_date === null ? '' : moment(dataSource.delivery_date).format('L'),
                                status: dataSource.status_translation,
                            },
                            route: () => {
                                this.router.navigateByUrl('/order/' + dataSource.id.toString());
                            }
                        });
                });
                return rows;
            },
            [
                {name: 'order_to.displayable_name', headerName: 'Ziel'},
                {name: 'order_from.displayable_name', headerName: 'Herkunft'},
                {name: 'create_date', headerName: 'Erstelldatum'},
                {name: 'delivery_date', headerName: 'Lieferdatum'},
                {name: 'status', headerName: 'Status'},
            ],
            (api) => api.readOrdersToCountOrderToOrderableToIdCountGet(this.jobId)
        );
        this.orderDataSource.loadData();
    }

    private initAccessRights() {
        this.authService.currentUserHasRight('orders:all').pipe(first()).subscribe(allowed => {
            this.ordersAllowed = allowed;
        });
        this.authService.currentUserHasRight('offers:all').pipe(first()).subscribe(allowed => {
            this.offersAllowed = allowed;
        });
        this.authService.currentUserHasRight('outgoing_invoices:all').pipe(first()).subscribe(allowed => {
            this.outgoingInvoicesAllowed = allowed;
        });

        this.authService.currentUserHasRight('jobs:modify').pipe(first()).subscribe(allowed => {
            if (allowed) {
                this.buttonsMain.push({
                    name: 'Bearbeiten',
                    navigate: (): void => {
                        this.child.editButtonClicked();
                    }
                });
                this.buttonsSub.push({
                    name: 'Bearbeiten',
                    navigate: (): void => {
                        this.child.editButtonClicked();
                    }
                });
            }
        });

        this.authService.currentUserHasRight('offers:create').pipe(first()).subscribe(allowed => {
            if (allowed) {
                this.buttonsMain.push({
                    name: 'Neues Angebot',
                    navigate: (): void => {
                        this.router.navigateByUrl('/offer/edit/new/' + this.jobId.toString());
                    }
                });
            }
        });

        this.authService.currentUserHasRight('outgoing_invoices:create').pipe(first()).subscribe(allowed => {
            if (allowed) {
                this.buttonsMain.push({
                    name: 'Neue Rechnung',
                    navigate: (): void => {
                        this.newInvoiceClicked();
                    }
                });
            }
        });

        this.authService.currentUserHasRight('work_hours:all').pipe(first()).subscribe(allowed => {
            if (allowed) {
                this.buttonsMain.push({
                    name: 'Stunden',
                    navigate: (): void => {
                        this.router.navigateByUrl('/work_hours/' + this.jobId.toString());
                    }
                });
            }
        });


        this.authService.currentUserHasRight('work_hours:all').pipe(first()).subscribe(allowed => {
            if (allowed) {
                this.buttonsMain.push({
                    name: 'Neuer Unterauftrag',
                    navigate: (): void => {
                        this.router.navigateByUrl('/job/edit/new/' + this.jobId.toString() + '/sub');
                    }
                });
            }
        });

        this.authService.currentUserHasRight('jobs:delete').pipe(first()).subscribe(allowed => {
            if (allowed) {
                this.buttonsMain.push({
                    name: 'Auftrag löschen',
                    navigate: (): void => {
                        this.jobDeleteClicked();
                    }
                });
                this.buttonsSub.push({
                    name: 'Unterauftrag löschen',
                    navigate: (): void => {
                        this.jobDeleteClicked();
                    }
                });
            }
        });

        this.authService.currentUserHasRight('orders:all').pipe(first()).subscribe(allowed => {
            if (allowed) {
                this.buttonsMain.push({
                    name: 'Bestellen',
                    navigate: (): void => {
                        this.router.navigateByUrl('order');
                    }
                });
                this.buttonsSub.push({
                    name: 'Bestellen',
                    navigate: (): void => {
                        this.router.navigateByUrl('order');
                    }
                });
                this.buttonsMain.push({
                    name: 'Bestellungen drucken',
                    navigate: (): void => {
                        this.printOrdersClicked();
                    }
                });
                this.buttonsSub.push({
                    name: 'Bestellungen drucken',
                    navigate: (): void => {
                        this.printOrdersClicked();
                    }
                });
            }
        });
    }

    private jobDeleteClicked(): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            data: {
                title: 'Auftrag löschen?',
                text: 'Auftrag wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden!'
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.api.deleteJobJobJobIdDelete(this.jobId).pipe(first()).subscribe(success => {
                    if (success) {
                        this.router.navigateByUrl('job');
                    } else {
                        this.snackBar.open('Der Auftrag konnte leider nicht gelöscht werden.'
                            , 'Ok', {
                                duration: 10000
                            });
                    }
                });
            }
        });
    }

    private newInvoiceClicked() {
        this.api.getClientValidationClientValidationClientIdGet(this.clientId).pipe(first()).subscribe((clientValidation) => {
            if (clientValidation.success) {
                this.router.navigateByUrl('/outgoing_invoice/edit/new/' + this.jobId.toString());
            } else {
                let text = 'Achtung: Die Kundendaten sind unvollständig: \n';
                for (const error of clientValidation.errors) {
                    text += error + '\n';
                }
                const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                    width: '500px',
                    data: {
                        title: 'Validierung fehlgeschlagen',
                        text,
                    }
                });
                dialogRef.afterClosed().subscribe(result => {
                    if (result) {
                        this.router.navigateByUrl('/client/edit/' + this.clientId.toString());
                    }
                });
            }
        });

    }

    private printOrdersClicked() {
        const dialogRef = this.dialog.open(OrderPrintDialogComponent, {
            width: '400px',
            data: {
                name: this.api.readJobJobJobIdGet(this.jobId).pipe(
                    map((job) => job.displayable_name)),
                orders: this.api.readOrdersToOrderToOrderableToIdGet(this.jobId, 0, 1000)
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            this.makePdfFromOrderList(result);
        });
    }


    private makePdfFromOrderList(orderDateReturnData: OrderReturnData) {
        this.api.generateOrderPdfOrderPdfPost(orderDateReturnData.orders).pipe(first()).subscribe(pdf => {
            this.file.open(pdf);
        });
    }
}
