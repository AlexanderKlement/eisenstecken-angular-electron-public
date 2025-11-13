import { Component, Input, OnInit } from "@angular/core";
import { TableDataSource } from "../../shared/components/table-builder/table-builder.datasource";
import { LockService } from "../../shared/services/lock.service";
import dayjs from "dayjs/esm";
import { TableButton, TableBuilderComponent } from "../../shared/components/table-builder/table-builder.component";
import { first } from "rxjs/operators";
import { ConfirmDialogComponent } from "../../shared/components/confirm-dialog/confirm-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { Observable, Subscription } from "rxjs";
import { Router } from "@angular/router";
import { formatCurrency, AsyncPipe } from "@angular/common";
import { DefaultService, IngoingInvoice } from "../../../api/openapi";
import { DefaultLayoutDirective, DefaultLayoutAlignDirective } from "ng-flex-layout";
import { MatFormField, MatLabel } from "@angular/material/input";
import { MatSelect, MatOption } from "@angular/material/select";
import { MatTabGroup, MatTab } from "@angular/material/tabs";

@Component({
    selector: 'app-ingoing',
    templateUrl: './ingoing.component.html',
    styleUrls: ['./ingoing.component.scss'],
    imports: [DefaultLayoutDirective, DefaultLayoutAlignDirective, MatFormField, MatLabel, MatSelect, MatOption, MatTabGroup, MatTab, TableBuilderComponent, AsyncPipe]
})
export class IngoingComponent implements OnInit {

  @Input() updateTables$: Observable<void>;
  @Input() $refresh: Observable<void>;
  allIngoingInvoiceDataSource: TableDataSource<IngoingInvoice>;
  paidIngoingInvoiceDataSource: TableDataSource<IngoingInvoice>;
  unPaidIngoingInvoiceDataSource: TableDataSource<IngoingInvoice>;

  public selectedYear = dayjs().year();
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
    {
      name: (_) => "Löschen",
      class: (_) => "",
      navigate: ($event: any, id: number) => {
        this.deleteClicked($event, id);
      },
      color: (_) => "primary",
      selectedField: "id",
    },
  ];
  private subscription: Subscription;

  constructor(private api: DefaultService, private locker: LockService, private dialog: MatDialog, private router: Router) {
  }

  ngOnInit(): void {
    this.initDataSources();
    if (!this.updateTables$) {
      console.warn("OutgoingComponent: Cannot update tables");
      return;
    }
    this.subscription = new Subscription();
    this.subscription.add(this.updateTables$.subscribe(() => {
      this.loadTables();
    }));
    this.$year = this.api.getAvailableYearsIngoingInvoiceAvailableYearsGet();
  }

  initDataSources() {
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
      let text = `Die Rechnung ${ingoingInvoice.number} vom ${dayjs(ingoingInvoice.date, "YYYY-MM-DD")
        .format("L")} an ${ingoingInvoice.name} `;
      let title = "Zahlung ";
      let returnFunction = (result) => {
        console.info(result);
      };
      if (!ingoingInvoice.paid) {
        text += "als bezahlt markieren?";
        title += " hinzufügen";
        returnFunction = (result) => {
          if (result) {
            this.api.payIngoingInvoicePaymentIngoingInvoiceIdPayPost(id).pipe(first()).subscribe(() => {
              this.loadTables();
            });
          }
        };

      } else {
        text += "als NICHT bezahlt markieren?";
        title += " entfernen";
        returnFunction = (result) => {
          if (result) {
            this.api.unpayIngoingInvoicePaymentIngoingInvoiceIdUnpayPost(id).pipe(first()).subscribe(() => {
              this.loadTables();
            });
          }
        };
      }

      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: "400px",
        data: {
          title,
          text,
        },
      });

      dialogRef.afterClosed().subscribe(result => {
        returnFunction(result);
      });

    });
  }

  yearChanged() {
    this.initDataSources();
  }

  private initAllIngoingInvoiceDataSource(): void {
    this.allIngoingInvoiceDataSource = new TableDataSource(
      this.api,
      (api, filter, sortDirection, skip, limit) =>
        api.readIngoingInvoicesIngoingInvoiceGet(skip, limit, filter, undefined, this.selectedYear),
      (dataSourceClasses) => {
        const rows = [];
        dataSourceClasses.forEach((dataSource) => {
          rows.push(
            {
              values: {
                rgNum: dataSource.number,
                name: dataSource.name,
                date: dayjs(dataSource.date).format("L"),
                // eslint-disable-next-line @typescript-eslint/naming-convention
                payment_date: dayjs(dataSource.payment_date).format("L"),
                id: dataSource.id,
                total: formatCurrency(dataSource.total, "de-DE", "EUR"),
                paid: dataSource.paid ? "Ja" : "Nein",
                condition: dataSource.paid,
              },
              route: () => {
                this.router.navigateByUrl("/invoice/ingoing/" + dataSource.id.toString());
              },
            });
        });
        return rows;
      },
      [
        { name: "name", headerName: "Firma" },
        { name: "rgNum", headerName: "Nummer" },
        { name: "date", headerName: "Rechnungsdatum" },
        { name: "payment_date", headerName: "Fälligkeitsdatum" },
        { name: "total", headerName: "Gesamtpreis [mit MwSt.]" },
      ],
      (api) => api.countIngoingInvoicesIngoingInvoiceCountGet(undefined, this.selectedYear),
    );
    this.allIngoingInvoiceDataSource.loadData();
  }

  private initPaidIngoingInvoiceDataSource(): void {
    this.paidIngoingInvoiceDataSource = new TableDataSource(
      this.api,
      (api, filter, sortDirection, skip, limit) =>
        api.readIngoingInvoicesIngoingInvoiceGet(skip, limit, filter, true, this.selectedYear),
      (dataSourceClasses) => {
        const rows = [];
        dataSourceClasses.forEach((dataSource) => {
          rows.push(
            {
              values: {
                rgNum: dataSource.number,
                name: dataSource.name,
                date: dayjs(dataSource.date).format("L"),
                id: dataSource.id,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                payment_date: dayjs(dataSource.payment_date).format("L"),
                total: formatCurrency(dataSource.total, "de-DE", "EUR"),
                condition: dataSource.paid,
              },
              route: () => {
                this.router.navigateByUrl("/invoice/ingoing/" + dataSource.id.toString());
              },
            });
        });
        return rows;
      },
      [
        { name: "name", headerName: "Firma" },
        { name: "rgNum", headerName: "Nummer" },
        { name: "date", headerName: "Rechnungsdatum" },
        { name: "payment_date", headerName: "Fälligkeitsdatum" },
        { name: "total", headerName: "Gesamtpreis [mit MwSt.]" },
      ],
      (api) => api.countIngoingInvoicesIngoingInvoiceCountGet(true, this.selectedYear),
    );
    this.paidIngoingInvoiceDataSource.loadData();
  }

  private initUnPaidIngoingInvoiceDataSource(): void {
    this.unPaidIngoingInvoiceDataSource = new TableDataSource(
      this.api,
      (api, filter, sortDirection, skip, limit) =>
        api.readIngoingInvoicesIngoingInvoiceGet(skip, limit, filter, false, this.selectedYear),
      (dataSourceClasses) => {
        const rows = [];
        dataSourceClasses.forEach((dataSource) => {
          rows.push(
            {
              values: {
                rgNum: dataSource.number,
                name: dataSource.name,
                date: dayjs(dataSource.date).format("L"),
                total: formatCurrency(dataSource.total, "de-DE", "EUR"),
                id: dataSource.id,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                payment_date: dayjs(dataSource.payment_date).format("L"),
                condition: dataSource.paid,
              },
              route: () => {
                this.router.navigateByUrl("/invoice/ingoing/" + dataSource.id.toString());
              },
            });
        });
        return rows;
      },
      [
        { name: "name", headerName: "Firma" },
        { name: "rgNum", headerName: "Nummer" },
        { name: "date", headerName: "Rechnungsdatum" },
        { name: "payment_date", headerName: "Fälligkeitsdatum" },
        { name: "total", headerName: "Gesamtpreis [mit MwSt.]" },
      ],
      (api) => api.countIngoingInvoicesIngoingInvoiceCountGet(false, this.selectedYear),
    );
    this.unPaidIngoingInvoiceDataSource.loadData();
  }


  private deleteClicked($event: any, id: number) {
    $event.stopPropagation();
    this.api.readIngoingInvoiceIngoingInvoiceIngoingInvoiceIdGet(id).pipe(first()).subscribe(ingoingInvoice => {
      const text = `Die Rechnung ${ingoingInvoice.number} vom ${dayjs(ingoingInvoice.date, "YYYY-MM-DD")
        .format("L")} von ${ingoingInvoice.name} löschen?`;
      const title = "Rechnung löschen";

      const returnFunction = (result) => {
        if (result) {
          this.api.deleteIngoingInvoiceIngoingInvoiceIngoingInvoiceIdDelete(id).pipe(first()).subscribe(() => {
            this.loadTables();
          });
        }
      };


      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: "400px",
        data: {
          title,
          text,
        },
      });

      dialogRef.afterClosed().subscribe(result => {
        returnFunction(result);
      });
    });
  }


}
