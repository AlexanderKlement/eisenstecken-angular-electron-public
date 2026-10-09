import { Component, inject, Input, OnInit } from "@angular/core";
import { TableDataSource } from "../../shared/components/table-builder/table-builder.datasource";
import { LockService } from "../../shared/services/lock.service";
import dayjs from "dayjs/esm";
import { TableBuilderComponent, TableButton } from "../../shared/components/table-builder/table-builder.component";
import { first } from "rxjs/operators";
import { ConfirmDialogComponent } from "../../shared/components/confirm-dialog/confirm-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { Observable, Subscription } from "rxjs";
import { Router } from "@angular/router";
import { AsyncPipe, formatCurrency } from "@angular/common";
import { DefaultService, IngoingInvoice } from "../../../api/openapi";
import {
  DefaultFlexDirective,
  DefaultLayoutAlignDirective,
  DefaultLayoutDirective,
  DefaultLayoutGapDirective
} from "ng-flex-layout";
import { MatFormField, MatLabel } from "@angular/material/input";
import { MatOption, MatSelect } from "@angular/material/select";
import { MatTabLink, MatTabNav, MatTabNavPanel } from "@angular/material/tabs";
import { ALL_INVOICES, INVOICE_TYPES, PAID_INVOICES, UNPAID_INVOICES } from "../../shared/types";
import { IngoingPaymentDialogComponent } from "./ingoing-payment-dialog/ingoing-payment-dialog.component";

@Component({
  selector: "app-ingoing",
  templateUrl: "./ingoing.component.html",
  styleUrls: ["./ingoing.component.scss"],
  imports: [DefaultLayoutDirective, DefaultLayoutAlignDirective, MatFormField, MatLabel, MatSelect, MatOption, TableBuilderComponent, AsyncPipe, DefaultFlexDirective, DefaultLayoutGapDirective, MatTabLink, MatTabNav, MatTabNavPanel]
})
export class IngoingComponent implements OnInit {
  private api = inject(DefaultService);
  private locker = inject(LockService);
  private dialog = inject(MatDialog);
  private router = inject(Router);


  @Input() updateTables$: Observable<void>;
  @Input() $refresh: Observable<void>;
  ingoingDataSource: TableDataSource<IngoingInvoice, DefaultService>;

  public selectedYear = dayjs().year();
  public $year: Observable<number[]>;

  activeType = UNPAID_INVOICES;
  buttons: TableButton[] = [
    {
      name: _ => "Zahlungen",
      class: (condition) => condition ? "paid" : "unpaid",
      navigate: ($event: any, id: number) => {
        this.openPaymentDetails($event, id);
      },
      color: (_) => "primary",
      selectedField: "id"
    },
    {
      name: (_) => "Löschen",
      class: (_) => "",
      navigate: ($event: any, id: number) => {
        this.deleteClicked($event, id);
      },
      color: (_) => "warn",
      selectedField: "id"
    }
  ];
  private subscription: Subscription;

  ngOnInit(): void {
    this.initDataSources();
    if (!this.updateTables$) {
      console.warn("OutgoingComponent: Cannot update tables");
      return;
    }
    this.subscription = new Subscription();
    this.subscription.add(this.updateTables$.subscribe(() => {
      this.ingoingDataSource.loadData();
    }));
    this.$year = this.api.getAvailableYearsIngoingInvoiceAvailableYearsGet();
  }

  initDataSources() {
    this.ingoingDataSource = new TableDataSource(
      this.api,
      (api, filter, sortDirection, skip, limit) =>
        api.readIngoingInvoicesIngoingInvoiceGet(skip, limit, filter, this.activeType === ALL_INVOICES ? undefined : this.activeType === PAID_INVOICES, this.selectedYear),
      (dataSourceClasses) => {
        const rows = [];
        dataSourceClasses.forEach((dataSource) => {
          const paid = dataSource.liabilities.filter(l => !l.paid).length === 0;
          const dueDate = dataSource.liabilities.length === 0 ? dataSource.payment_date : dataSource.liabilities.reduce<string>((prev, cur) => {
            if (prev === "") {
              return cur.due_date;
            }
            if (new Date(prev).getTime() < new Date(cur.due_date).getTime()) {
              return cur.due_date;
            }
            return prev;
          }, "");
          rows.push(
            {
              values: {
                rgNum: dataSource.number,
                name: dataSource.name,
                date: dayjs(dataSource.date).format("L"),
                payment_date: `${dayjs(dueDate).format("L")} (${dataSource.liabilities.length} Rate${dataSource.liabilities.length > 1 ? "n" : ""})`,
                id: dataSource.id,
                paid: paid ? "Ja" : "Nein",
                condition: paid,
                total: `${formatCurrency(dataSource.liabilities.reduce<number>((prev, cur) => !cur.paid ? cur.amount + prev : prev, 0), "de-DE", "EUR")} (${formatCurrency(dataSource.total, "de-DE", "EUR")})`
              },
              route: () => {
                this.router.navigateByUrl("/invoice/ingoing/" + dataSource.id.toString()).then();
              }
            });
        });
        return rows;
      },
      [
        { name: "name", headerName: "Firma" },
        { name: "rgNum", headerName: "Nummer" },
        { name: "date", headerName: "Rechnungsdatum" },
        { name: "payment_date", headerName: "Fälligkeitsdatum" },
        { name: "total", headerName: "Offen (Gesamtpreis) [mit MwSt.]" }
      ],
      (api) => api.countIngoingInvoicesIngoingInvoiceCountGet(this.activeType === ALL_INVOICES ? undefined : this.activeType === PAID_INVOICES, this.selectedYear)
    );
    this.ingoingDataSource.loadData();
  }

  openPaymentDetails(event: any, id: number) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(IngoingPaymentDialogComponent, {
      width: "1200px",
      data: {
        ingoingId: id
      }
    });
    dialogRef.afterClosed().subscribe(() => {
      this.ingoingDataSource.loadData();
    });
  }

  yearChanged() {
    this.ingoingDataSource.loadData();
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
            this.ingoingDataSource.loadData();
          });
        }
      };


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


  protected setActiveType(link: string) {
    this.activeType = link;
    this.initDataSources();
  }

  protected readonly INVOICE_TYPES = INVOICE_TYPES;
}
