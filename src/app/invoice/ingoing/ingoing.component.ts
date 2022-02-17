import {Component, OnInit} from '@angular/core';
import {TableDataSource} from '../../shared/components/table-builder/table-builder.datasource';
import {DefaultService, IngoingInvoice} from 'eisenstecken-openapi-angular-library';
import {LockService} from '../../shared/services/lock.service';
import * as moment from 'moment';
import {TableButton} from '../../shared/components/table-builder/table-builder.component';
import {first} from 'rxjs/operators';
import {ConfirmDialogComponent} from '../../shared/components/confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
    selector: 'app-ingoing',
    templateUrl: './ingoing.component.html',
    styleUrls: ['./ingoing.component.scss']
})
export class IngoingComponent implements OnInit {

    allIngoingInvoiceDataSource: TableDataSource<IngoingInvoice>;
    paidIngoingInvoiceDataSource: TableDataSource<IngoingInvoice>;
    unPaidIngoingInvoiceDataSource: TableDataSource<IngoingInvoice>;

    buttons: TableButton[] = [
        {
            name: 'Zahlung',
            navigate: ($event: any, id: number) => {
                this.paidClicked($event, id);
            },
            selectedField: 'id',
        },
    ];


    constructor(private api: DefaultService, private locker: LockService, private dialog: MatDialog) {
    }

    ngOnInit(): void {
        this.initAllIngoingInvoiceDataSource();
        this.initPaidIngoingInvoiceDataSource();
        this.initUnPaidIngoingInvoiceDataSource();
    }

    loadTables() {
        this.allIngoingInvoiceDataSource.loadData();
        this.paidIngoingInvoiceDataSource.loadData();
        this.unPaidIngoingInvoiceDataSource.loadData();
    }

    paidClicked(event: any, id: number) {
        event.stopPropagation();
        this.api.readIngoingInvoiceIngoingInvoiceIngoingInvoiceIdGet(id).pipe(first()).subscribe(ingoingInvoice => {
            let text = `Die Rechnung ${ingoingInvoice.number} vom ${moment(ingoingInvoice.date, 'YYYY-MM-DD')
                .format('L')} an ${ingoingInvoice.name} `;
            let title = 'Zahlung ';
            let returnFunction = (result) => {
                console.log(result);
            };
            if (!ingoingInvoice.paid) {
                text += 'als bezahlt markieren?';
                title += ' hinzufügen';
                returnFunction = (result) => {
                    if (result) {
                        this.api.payIngoingInvoicePaymentIngoingInvoiceIdPayPost(id).pipe(first()).subscribe(() => {
                            this.loadTables();
                        });
                    }
                };

            } else {
                text += 'als NICHT bezahlt markieren?';
                title += ' entfernen';
                returnFunction = (result) => {
                    if (result) {
                        this.api.unpayIngoingInvoicePaymentIngoingInvoiceIdUnpayPost(id).pipe(first()).subscribe(() => {
                            this.loadTables();
                        });
                    }
                };
            }

            const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                width: '400px',
                data: {
                    title,
                    text
                }
            });

            dialogRef.afterClosed().subscribe(result => {
                returnFunction(result);
            });

        });
    }

    private initAllIngoingInvoiceDataSource(): void {
        this.allIngoingInvoiceDataSource = new TableDataSource(
            this.api,
            (api, filter, sortDirection, skip, limit) =>
                api.readIngoingInvoicesIngoingInvoiceGet(skip, limit, filter),
            (dataSourceClasses) => {
                const rows = [];
                dataSourceClasses.forEach((dataSource) => {
                    rows.push(
                        {
                            values: {
                                rgNum: dataSource.number,
                                name: dataSource.name,
                                date: moment(dataSource.date).format('L'),
                                id: dataSource.id,
                                paid: dataSource.paid ? 'Ja' : 'Nein',
                            },
                            route: () => {
                                this.locker.getLockAndTryNavigate(
                                    this.api.islockedIngoingInvoiceIngoingInvoiceIslockedIngoingInvoiceIdGet(dataSource.id),
                                    this.api.lockIngoingInvoiceIngoingInvoiceLockIngoingInvoiceIdPost(dataSource.id),
                                    this.api.unlockIngoingInvoiceIngoingInvoiceUnlockIngoingInvoiceIdPost(dataSource.id),
                                    'ingoing_invoice/edit/' + dataSource.id.toString()
                                );
                            }
                        });
                });
                return rows;
            },
            [
                {name: 'name', headerName: 'Firma'},
                {name: 'rgNum', headerName: 'Nummer'},
                {name: 'date', headerName: 'Datum'},
                {name: 'paid', headerName: 'Bezahlt'}
            ],
            (api) => api.countIngoingInvoicesIngoingInvoiceCountGet()
        );
        this.allIngoingInvoiceDataSource.loadData();
    }

    private initPaidIngoingInvoiceDataSource(): void {
        this.paidIngoingInvoiceDataSource = new TableDataSource(
            this.api,
            (api, filter, sortDirection, skip, limit) =>
                api.readIngoingInvoicesIngoingInvoiceGet(skip, limit, filter, true),
            (dataSourceClasses) => {
                const rows = [];
                dataSourceClasses.forEach((dataSource) => {
                    rows.push(
                        {
                            values: {
                                rgNum: dataSource.number,
                                name: dataSource.name,
                                date: moment(dataSource.date).format('L'),
                                id: dataSource.id,
                            },
                            route: () => {
                                this.locker.getLockAndTryNavigate(
                                    this.api.islockedIngoingInvoiceIngoingInvoiceIslockedIngoingInvoiceIdGet(dataSource.id),
                                    this.api.lockIngoingInvoiceIngoingInvoiceLockIngoingInvoiceIdPost(dataSource.id),
                                    this.api.unlockIngoingInvoiceIngoingInvoiceUnlockIngoingInvoiceIdPost(dataSource.id),
                                    'ingoing_invoice/edit/' + dataSource.id.toString()
                                );
                            }
                        });
                });
                return rows;
            },
            [
                {name: 'name', headerName: 'Firma'},
                {name: 'rgNum', headerName: 'Nummer'},
                {name: 'date', headerName: 'Datum'},
            ],
            (api) => api.countIngoingInvoicesIngoingInvoiceCountGet(true)
        );
        this.paidIngoingInvoiceDataSource.loadData();
    }

    private initUnPaidIngoingInvoiceDataSource(): void {
        this.unPaidIngoingInvoiceDataSource = new TableDataSource(
            this.api,
            (api, filter, sortDirection, skip, limit) =>
                api.readIngoingInvoicesIngoingInvoiceGet(skip, limit, filter, false),
            (dataSourceClasses) => {
                const rows = [];
                dataSourceClasses.forEach((dataSource) => {
                    rows.push(
                        {
                            values: {
                                rgNum: dataSource.number,
                                name: dataSource.name,
                                date: moment(dataSource.date).format('L'),
                                id: dataSource.id,
                            },
                            route: () => {
                                this.locker.getLockAndTryNavigate(
                                    this.api.islockedIngoingInvoiceIngoingInvoiceIslockedIngoingInvoiceIdGet(dataSource.id),
                                    this.api.lockIngoingInvoiceIngoingInvoiceLockIngoingInvoiceIdPost(dataSource.id),
                                    this.api.unlockIngoingInvoiceIngoingInvoiceUnlockIngoingInvoiceIdPost(dataSource.id),
                                    'ingoing_invoice/edit/' + dataSource.id.toString()
                                );
                            }
                        });
                });
                return rows;
            },
            [
                {name: 'name', headerName: 'Firma'},
                {name: 'rgNum', headerName: 'Nummer'},
                {name: 'date', headerName: 'Datum'},
            ],
            (api) => api.countIngoingInvoicesIngoingInvoiceCountGet(false)
        );
        this.unPaidIngoingInvoiceDataSource.loadData();
    }


}
