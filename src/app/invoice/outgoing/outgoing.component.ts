import {Component, Input, OnInit} from "@angular/core";
import {TableDataSource} from "../../shared/components/table-builder/table-builder.datasource";
import {LockService} from "../../shared/services/lock.service";
import {first} from "rxjs/operators";
import {AuthService} from "../../shared/services/auth.service";
import * as moment from "moment";
import {TableButton} from "../../shared/components/table-builder/table-builder.component";
import {ConfirmDialogComponent} from "../../shared/components/confirm-dialog/confirm-dialog.component";
import {MatLegacyDialog as MatDialog} from "@angular/material/legacy-dialog";
import {Observable} from "rxjs";
import {formatCurrency} from "@angular/common";
import { DefaultService, OutgoingInvoice } from "../../../api/openapi";

@Component({
    selector: 'app-outgoing',
    templateUrl: './outgoing.component.html',
    styleUrls: ['./outgoing.component.scss']
})
export class OutgoingComponent implements OnInit {


    @Input() $refresh: Observable<void>;
    allOutgoingInvoiceDataSource: TableDataSource<OutgoingInvoice>;
    unPaidOutgoingInvoiceDataSource: TableDataSource<OutgoingInvoice>;
    paidOutgoingInvoiceDataSource: TableDataSource<OutgoingInvoice>;

    public selectedYear = moment().year();
    public $year: Observable<number[]>;

    buttons: TableButton[] = [
        {
            name: (condition: any) => (condition) ? "Zahlung entfernen" : " Zahlung hinzufügen",
            class: (condition: any) => (condition) ? "paid" : " unpaid",
            navigate: ($event: any, id: number) => {
                this.paidClicked($event, id);
            },
            color: (_) => "primary",
            selectedField: "id",
        },
    ];

    constructor(private api: DefaultService, private locker: LockService, private authService: AuthService, private dialog: MatDialog) {
    }

    ngOnInit(): void {
        this.initDataSources();
        this.$year = this.api.getAvailableYearsOutgoingInvoiceAvailableYearsGet();
    }

    initDataSources() {
        this.initAllOutgoingInvoiceDataSource();
        this.initPaidOutgoingInvoiceDataSource();
        this.initUnPaidOutgoingInvoiceDataSource();
    }

    loadTables(): void {
        this.allOutgoingInvoiceDataSource.loadData();
        this.unPaidOutgoingInvoiceDataSource.loadData();
        this.paidOutgoingInvoiceDataSource.loadData();
    }

    paidClicked(event: any, id: number) {
        event.stopPropagation();
        this.api.readOutgoingInvoiceOutgoingInvoiceOutgoingInvoiceIdGet(id).pipe(first()).subscribe(outgoingInvoice => {
            let text = `Die Rechnung ${outgoingInvoice.number} vom ${moment(outgoingInvoice.date, "YYYY-MM-DD")
                .format("L")} an ${outgoingInvoice.client_name} `;
            let title = "Zahlung ";
            let returnFunction = (result) => {
                console.info(result);
            };
            if (!outgoingInvoice.paid) {
                text += "als bezahlt markieren?";
                title += " hinzufügen";
                returnFunction = (result) => {
                    if (result) {
                        this.api.payOutgoingInvoicePaymentOutgoingInvoiceIdPayPost(id).pipe(first()).subscribe(() => {
                            this.loadTables();
                        });
                    }
                };

            } else {
                text += "als NICHT bezahlt markieren?";
                title += " entfernen";
                returnFunction = (result) => {
                    if (result) {
                        this.api.unpayOutgoingInvoicePaymentOutgoingInvoiceIdUnpayPost(id).pipe(first()).subscribe(() => {
                            this.loadTables();
                        });
                    }
                };
            }

            const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                width: "400px",
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

    yearChanged() {
        this.initDataSources();
    }

    private initAllOutgoingInvoiceDataSource(): void {
        this.allOutgoingInvoiceDataSource = new TableDataSource(
            this.api,
            (api, filter, sortDirection, skip, limit) =>
                api.readOutgoingInvoicesOutgoingInvoiceGet(skip, filter, limit, undefined, this.selectedYear),
            (dataSourceClasses) => {
                const rows = [];
                dataSourceClasses.forEach((dataSource) => {
                    rows.push(
                        {
                            values: {
                                // eslint-disable-next-line @typescript-eslint/naming-convention
                                client_name: dataSource.client_name,
                                date: moment(dataSource.date, "YYYY-MM-DD").format("L"),
                                rgNum: dataSource.number,
                                id: dataSource.id,
                                total: formatCurrency(dataSource.full_price_with_vat, "de-DE", "EUR"),
                                // eslint-disable-next-line @typescript-eslint/naming-convention
                                payment_date: moment(dataSource.payment_date, "YYYY-MM-DD").format("L"),
                                condition: dataSource.paid
                            },
                            route: () => {
                                this.authService.currentUserHasRight("outgoing_invoices:modify").pipe(first()).subscribe(allowed => {
                                    if (allowed) {
                                        this.locker.getLockAndTryNavigate(
                                            this.api.islockedOutgoingInvoiceOutgoingInvoiceIslockedOutgoingInvoiceIdGet(dataSource.id),
                                            this.api.lockOutgoingInvoiceOutgoingInvoiceLockOutgoingInvoiceIdPost(dataSource.id),
                                            this.api.unlockOutgoingInvoiceOutgoingInvoiceUnlockOutgoingInvoiceIdPost(dataSource.id),
                                            "outgoing_invoice/edit/" + dataSource.id.toString()
                                        );
                                    }
                                });
                            }
                        });
                });
                return rows;
            },
            [
                {name: "client_name", headerName: "Kunde"},
                {name: "rgNum", headerName: "Nummer"},
                {name: "date", headerName: "Ausstellungsdatum"},
                {name: "payment_date", headerName: "Fälligkeitsdatum"},
                {name: "total", headerName: "Preis [mit MwSt.]"},
            ],
            (api) => api.countOutgoingInvoicesOutgoingInvoiceCountGet(undefined, this.selectedYear)
        );
        this.allOutgoingInvoiceDataSource.loadData();
    }

    private initPaidOutgoingInvoiceDataSource(): void {
        this.paidOutgoingInvoiceDataSource = new TableDataSource(
            this.api,
            (api, filter, sortDirection, skip, limit) =>
                api.readOutgoingInvoicesOutgoingInvoiceGet(skip, filter, limit, true, this.selectedYear),
            (dataSourceClasses) => {
                const rows = [];
                dataSourceClasses.forEach((dataSource) => {
                    rows.push(
                        {
                            values: {
                                // eslint-disable-next-line @typescript-eslint/naming-convention
                                client_name: dataSource.client_name,
                                date: moment(dataSource.date, "YYYY-MM-DD").format("L"),
                                rgNum: dataSource.number,
                                id: dataSource.id,
                                total: formatCurrency(dataSource.full_price_with_vat, "de-DE", "EUR"),
                                // eslint-disable-next-line @typescript-eslint/naming-convention
                                payment_date: moment(dataSource.payment_date, "YYYY-MM-DD").format("L"),
                                condition: dataSource.paid
                            },
                            route: () => {
                                this.authService.currentUserHasRight("outgoing_invoices:modify").pipe(first()).subscribe(allowed => {
                                    if (allowed) {
                                        this.locker.getLockAndTryNavigate(
                                            this.api.islockedOutgoingInvoiceOutgoingInvoiceIslockedOutgoingInvoiceIdGet(dataSource.id),
                                            this.api.lockOutgoingInvoiceOutgoingInvoiceLockOutgoingInvoiceIdPost(dataSource.id),
                                            this.api.unlockOutgoingInvoiceOutgoingInvoiceUnlockOutgoingInvoiceIdPost(dataSource.id),
                                            "outgoing_invoice/edit/" + dataSource.id.toString()
                                        );
                                    }
                                });
                            }
                        });
                });
                return rows;
            },
            [
                {name: "client_name", headerName: "Kunde"},
                {name: "rgNum", headerName: "Nummer"},
                {name: "date", headerName: "Ausstellungsdatum"},
                {name: "payment_date", headerName: "Fälligkeitsdatum"},
                {name: "total", headerName: "Preis [mit MwSt.]"},
            ],
            (api) => api.countOutgoingInvoicesOutgoingInvoiceCountGet(true, this.selectedYear)
        );
        this.paidOutgoingInvoiceDataSource.loadData();
    }

    private initUnPaidOutgoingInvoiceDataSource(): void {
        this.unPaidOutgoingInvoiceDataSource = new TableDataSource(
            this.api,
            (api, filter, sortDirection, skip, limit) =>
                api.readOutgoingInvoicesOutgoingInvoiceGet(skip, filter, limit, false, this.selectedYear),
            (dataSourceClasses) => {
                const rows = [];
                dataSourceClasses.forEach((dataSource) => {
                    rows.push(
                        {
                            values: {
                                // eslint-disable-next-line @typescript-eslint/naming-convention
                                client_name: dataSource.client_name,
                                date: moment(dataSource.date, "YYYY-MM-DD").format("L"),
                                rgNum: dataSource.number,
                                id: dataSource.id,
                                total: formatCurrency(dataSource.full_price_with_vat, "de-DE", "EUR"),
                                // eslint-disable-next-line @typescript-eslint/naming-convention
                                payment_date: moment(dataSource.payment_date, "YYYY-MM-DD").format("L"),
                                condition: dataSource.paid
                            },
                            route: () => {
                                this.authService.currentUserHasRight("outgoing_invoices:modify").pipe(first()).subscribe(allowed => {
                                    if (allowed) {
                                        this.locker.getLockAndTryNavigate(
                                            this.api.islockedOutgoingInvoiceOutgoingInvoiceIslockedOutgoingInvoiceIdGet(dataSource.id),
                                            this.api.lockOutgoingInvoiceOutgoingInvoiceLockOutgoingInvoiceIdPost(dataSource.id),
                                            this.api.unlockOutgoingInvoiceOutgoingInvoiceUnlockOutgoingInvoiceIdPost(dataSource.id),
                                            "outgoing_invoice/edit/" + dataSource.id.toString()
                                        );
                                    }
                                });
                            }
                        });
                });
                return rows;
            },
            [
                {name: "client_name", headerName: "Kunde"},
                {name: "rgNum", headerName: "Nummer"},
                {name: "date", headerName: "Ausstellungsdatum"},
                {name: "payment_date", headerName: "Fälligkeitsdatum"},
                {name: "total", headerName: "Preis [mit MwSt.]"},
            ],
            (api) => api.countOutgoingInvoicesOutgoingInvoiceCountGet(false, this.selectedYear)
        );
        this.unPaidOutgoingInvoiceDataSource.loadData();
    }


}
