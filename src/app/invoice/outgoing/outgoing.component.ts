import { Component, inject, OnInit } from "@angular/core";
import { TableDataSource } from "../../shared/components/table-builder/table-builder.datasource";
import { LockService } from "../../shared/services/lock.service";
import { first } from "rxjs/operators";
import { AuthStateService } from "../../shared/services/auth-state.service";
import dayjs from "dayjs/esm";
import { TableBuilderComponent, TableButton } from "../../shared/components/table-builder/table-builder.component";
import { ConfirmDialogComponent } from "../../shared/components/confirm-dialog/confirm-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { AsyncPipe, formatCurrency } from "@angular/common";
import { DefaultService, OutgoingInvoice, ScopeEnum } from "../../../api/openapi";
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
import { OutgoingPaymentDialogComponent } from "./outgoing-payment-dialog/outgoing-payment-dialog.component";

@Component({
  selector: "app-outgoing",
  templateUrl: "./outgoing.component.html",
  styleUrls: ["./outgoing.component.scss"],
  imports: [DefaultLayoutDirective, DefaultLayoutAlignDirective, MatFormField, MatLabel, MatSelect, MatOption, TableBuilderComponent, AsyncPipe, DefaultFlexDirective, DefaultLayoutGapDirective, MatTabLink, MatTabNav, MatTabNavPanel]
})
export class OutgoingComponent implements OnInit {
  private api = inject(DefaultService);
  private locker = inject(LockService);
  private authService = inject(AuthStateService);
  private dialog = inject(MatDialog);


  outgoingDataSource: TableDataSource<OutgoingInvoice, DefaultService>;

  activeType = UNPAID_INVOICES;
  public selectedYear = dayjs().year();
  public $year: Observable<number[]>;

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

  ngOnInit(): void {
    this.initDataSources();
    this.$year = this.api.getAvailableYearsOutgoingInvoiceAvailableYearsGet();
  }

  initDataSources() {
    this.outgoingDataSource = new TableDataSource(
      this.api,
      (api, filter, sortDirection, skip, limit) =>
        api.readOutgoingInvoicesOutgoingInvoiceGet(skip, filter, limit, this.activeType === ALL_INVOICES ? undefined : this.activeType === PAID_INVOICES, this.selectedYear),
      (dataSourceClasses) => {
        const rows = [];
        dataSourceClasses.forEach((dataSource) => {
          const paid = dataSource.receivables.filter(r => !r.paid).length === 0;
          const dueDate = dataSource.receivables.length === 0 ? dataSource.payment_date : dataSource.receivables.reduce<string>((prev, cur) => {
            if (prev === "") {
              return cur.due_date;
            }
            if (new Date(prev).getTime() > new Date(cur.due_date).getTime()) {
              return cur.due_date;
            }
            return prev;
          }, "");
          rows.push(
            {
              values: {
                rgNum: dataSource.number,
                client_name: dataSource.client_name,
                date: dayjs(dataSource.date).format("L"),
                payment_date: `${dayjs(dueDate).format("L")} (${dataSource.receivables.length} Rate${dataSource.receivables.length > 1 ? "n" : ""})`,
                id: dataSource.id,
                paid: paid ? "Ja" : "Nein",
                total: `${formatCurrency(dataSource.receivables.reduce<number>((prev, cur) => !cur.paid ? cur.amount + prev : prev, 0), "de-DE", "EUR")} (${formatCurrency(dataSource.full_price_with_vat, "de-DE", "EUR")})`,
                condition: paid
              },
              route: () => {
                this.authService.currentUserHasScope(ScopeEnum.Office).pipe(first()).subscribe(allowed => {
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
        { name: "client_name", headerName: "Kunde" },
        { name: "rgNum", headerName: "Nummer" },
        { name: "date", headerName: "Ausstellungsdatum" },
        { name: "payment_date", headerName: "Fälligkeitsdatum" },
        { name: "total", headerName: "Offen (Gesamtpreis) [mit MwSt.]" }
      ],
      (api) => api.countOutgoingInvoicesOutgoingInvoiceCountGet(undefined, this.selectedYear)
    );
    this.outgoingDataSource.loadData();
  }

  loadTables(): void {
    this.outgoingDataSource.loadData();
  }


  private deleteClicked($event: any, id: number) {
    $event.stopPropagation();
    this.api.readOutgoingInvoiceOutgoingInvoiceOutgoingInvoiceIdGet(id).pipe(first()).subscribe(outgoingInvoice => {
      const text = `Die Rechnung ${outgoingInvoice.number} vom ${dayjs(outgoingInvoice.date, "YYYY-MM-DD")
        .format("L")} von ${outgoingInvoice.client_name} löschen?`;
      const title = "Rechnung löschen";

      const returnFunction = (result) => {
        if (result) {
          this.api.deleteOutgoingInvoiceOutgoingInvoiceOutgoingInvoiceIdDelete(id).pipe(first()).subscribe(() => {
            this.outgoingDataSource.loadData();
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

  openPaymentDetails(event: any, id: number) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(OutgoingPaymentDialogComponent, {
      width: "1200px",
      data: {
        outgoingId: id
      }
    });
    dialogRef.afterClosed().subscribe(() => {
      this.outgoingDataSource.loadData();
    });
  }

  yearChanged() {
    this.initDataSources();
  }


  protected setActiveType(link: string) {
    this.activeType = link;
    this.initDataSources();
  }

  protected readonly INVOICE_TYPES = INVOICE_TYPES;
}
