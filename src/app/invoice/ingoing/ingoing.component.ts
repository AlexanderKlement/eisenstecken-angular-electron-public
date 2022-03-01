import {Component, Input, OnInit} from '@angular/core';
import {TableDataSource} from '../../shared/components/table-builder/table-builder.datasource';
import {DefaultService, IngoingInvoice} from 'eisenstecken-openapi-angular-library';
import {LockService} from '../../shared/services/lock.service';
import * as moment from 'moment';
import {TableButton} from '../../shared/components/table-builder/table-builder.component';
import {first} from 'rxjs/operators';
import {ConfirmDialogComponent} from '../../shared/components/confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {Observable, Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {formatCurrency} from '@angular/common';

@Component({
    selector: 'app-ingoing',
    templateUrl: './ingoing.component.html',
    styleUrls: ['./ingoing.component.scss']
})
export class IngoingComponent implements OnInit {

    @Input() updateTables$: Observable<void>;
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
        {
            name: 'Löschen',
            navigate: ($event: any, id: number) => {
                this.deleteClicked($event, id);
            },
            selectedField: 'id',
        },
    ];
    private subscription: Subscription;

    constructor(private api: DefaultService, private locker: LockService, private dialog: MatDialog, private router: Router) {
    }

    ngOnInit(): void {
        this.initAllIngoingInvoiceDataSource();
        this.initPaidIngoingInvoiceDataSource();
        this.initUnPaidIngoingInvoiceDataSource();
        if (!this.updateTables$) {
            console.warn('OutgoingComponent: Cannot update tables');
            return;
        }
        this.subscription = new Subscription();
        this.subscription.add(this.updateTables$.subscribe(() => {
            this.loadTables();
        }));
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
                                this.router.navigateByUrl('/invoice/ingoing/' + dataSource.id.toString());
                            },
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
                                this.router.navigateByUrl('/invoice/ingoing/' + dataSource.id.toString());
                            },
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
                                total: formatCurrency(dataSource.total, 'de-DE', 'EUR'),
                                id: dataSource.id,
                            },
                            route: () => {
                                this.router.navigateByUrl('/invoice/ingoing/' + dataSource.id.toString());
                            },
                        });
                });
                return rows;
            },
            [
                {name: 'name', headerName: 'Firma'},
                {name: 'rgNum', headerName: 'Nummer'},
                {name: 'date', headerName: 'Datum'},
                {name: 'total', headerName: 'Gesamtpreis [mit MwSt.]'},
            ],
            (api) => api.countIngoingInvoicesIngoingInvoiceCountGet(false)
        );
        this.unPaidIngoingInvoiceDataSource.loadData();
    }


    private deleteClicked($event: any, id: number) {
        $event.stopPropagation();
        this.api.readIngoingInvoiceIngoingInvoiceIngoingInvoiceIdGet(id).pipe(first()).subscribe(ingoingInvoice => {
            const text = `Die Rechnung ${ingoingInvoice.number} vom ${moment(ingoingInvoice.date, 'YYYY-MM-DD')
                .format('L')} von ${ingoingInvoice.name} löschen?`;
            const title = 'Rechnung löschen';

            const returnFunction = (result) => {
                if (result) {
                    this.api.deleteIngoingInvoiceIngoingInvoiceIngoingInvoiceIdDelete(id).pipe(first()).subscribe(() => {
                        this.loadTables();
                    });
                }
            };


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
}
