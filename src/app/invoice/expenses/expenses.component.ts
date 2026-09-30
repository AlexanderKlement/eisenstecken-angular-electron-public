import { Component, inject, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { DefaultService, Liability, LiabilityService } from "../../../api/openapi";
import { AsyncPipe } from "@angular/common";
import {
  DefaultFlexDirective,
  DefaultLayoutAlignDirective,
  DefaultLayoutDirective,
  DefaultLayoutGapDirective
} from "ng-flex-layout";
import { MatFormField, MatLabel } from "@angular/material/input";
import { MatOption } from "@angular/material/core";
import { MatSelect } from "@angular/material/select";
import { MatTabLink, MatTabNav, MatTabNavPanel } from "@angular/material/tabs";
import { TableBuilderComponent, TableButton } from "../../shared/components/table-builder/table-builder.component";
import dayjs from "dayjs/esm";
import { TableDataSource } from "../../shared/components/table-builder/table-builder.datasource";
import { ALL_INVOICES, INVOICE_TYPES, PAID_INVOICES, UNPAID_INVOICES } from "../../shared/types";
import { first } from "rxjs/operators";
import { ConfirmDialogComponent } from "../../shared/components/confirm-dialog/confirm-dialog.component";
import { MatDialog } from "@angular/material/dialog";

const MONTHS = [
  { key: 0, label: "Januar" },
  { key: 1, label: "Februar" },
  { key: 2, label: "März" },
  { key: 3, label: "April" },
  { key: 4, label: "Mai" },
  { key: 5, label: "Juni" },
  { key: 6, label: "Juli" },
  { key: 7, label: "August" },
  { key: 8, label: "September" },
  { key: 9, label: "October" },
  { key: 10, label: "November" },
  { key: 11, label: "Dezember" }
];

const ADD_PAYMENT_STR = "Zahlung hinzufügen";


@Component({
  selector: "app-expenses",
  imports: [
    AsyncPipe,
    DefaultLayoutAlignDirective,
    DefaultLayoutDirective,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    TableBuilderComponent,
    DefaultLayoutGapDirective,
    MatTabNav,
    MatTabLink,
    MatTabNavPanel,
    DefaultFlexDirective
  ],
  templateUrl: "./expenses.component.html",
  styleUrl: "./expenses.component.scss"
})
export class ExpensesComponent implements OnInit {
  private expensesService = inject(LiabilityService);
  private api = inject(DefaultService);
  private dialog = inject(MatDialog);
  public $year: Observable<number[]>;

  public selectedYear = dayjs().year();
  public selectedMonth = -1; //dayjs().month();

  expensesDataSource: TableDataSource<Liability, LiabilityService>;
  activeType = UNPAID_INVOICES;
  createActive = false;
  headerButtons: TableButton[] = [
    {
      name: () => "Neue Spese hinzufügen",
      color: () => "primary",
      selectedField: "",
      navigate: () => {
        this.createActive = true;
        this.expensesDataSource.loadData();
      },
      class: () => ""
    }
  ];

  dateFromRaw() {
    if (this.selectedMonth === -1) {
      return dayjs().set("minute", 1).set("hour", 2).set("date", 1).set("month", 0).set("year", this.selectedYear);
    }
    return dayjs().set("minute", 1).set("hour", 2).set("date", 1).set("month", this.selectedMonth).set("year", this.selectedYear);
  }

  dateFrom() {
    return this.dateFromRaw().toISOString().split("T")[0];
  }

  dateTo() {
    if (this.selectedMonth === -1) {
      return this.dateFromRaw().clone().set("year", this.selectedYear + 1).toISOString().split("T")[0];
    }
    return this.dateFromRaw().clone().set("month", this.selectedMonth + 1).set("date", 0).toISOString().split("T")[0];
  }

  editedData: { name?: string, dueDate?: Date, amount?: number, id: number }[] = [];

  buttons: TableButton[] = [
    {
      name: _ => "Speichern",
      class: (id) => {
        const edited = this.editedData.find(data => data.id === id);
        if (edited) {
          return "";
        } else {
          return "hidden";
        }
      },
      navigate: (_, id) => {
        this.saveClicked(id);
      },
      color: _ => "primary",
      selectedField: "id"
    },
    {
      name: (_) => "Löschen",
      class: (_) => "",
      navigate: (_, id) => {
        this.deleteClicked(id);
      },
      color: (_) => "warn",
      selectedField: "id"
    }
  ];

  ngOnInit() {
    this.initDataSources();
    this.$year = this.api.getAvailableYearsIngoingInvoiceAvailableYearsGet();
  }

  initDataSources() {
    this.expensesDataSource = new TableDataSource(
      this.expensesService,
      (api, filter, sortDirection, skip, limit) => {
        return api.getLiabilities(skip, limit, filter, this.activeType === ALL_INVOICES ? undefined : this.activeType === PAID_INVOICES, this.dateFrom(), this.dateTo(), undefined, true);
      },
      (dataSourceClasses) => {
        const rows = [];
        if (this.createActive) {
          rows.push({
            values: {
              id: -1,
              name: "",
              payment_date: new Date(),
              total: 0,
              status: "Neu",
              condition: -1
            },
            route: () => {
              // nothing
            }
          });
        }
        dataSourceClasses.forEach((dataSource) => {
          const edited = this.editedData.find(data => data.id === dataSource.id);
          rows.push({
            values: {
              id: dataSource.id,
              name: edited?.name ?? dataSource.name,
              payment_date: (edited?.dueDate ?? new Date(dataSource.due_date)),
              total: edited?.amount ?? dataSource.amount,
              status: dataSource.paid ? "Zahlung löschen" : ADD_PAYMENT_STR,
              condition: dataSource.id
            },
            route: () => {
              // nothing
            }
          });
        });
        return rows;
      },
      [
        {
          name: "name",
          headerName: "Beschreibung",
          asInput: {
            type: "text",
            onChange: (value, id) => {
              let found = false;
              this.editedData = this.editedData.map((data) => {
                if (data.id === id) {
                  return {
                    ...data,
                    name: value
                  };
                }
                return data;
              }).concat(found ? [] : [{ id: id as number, name: value, dueDate: undefined, amount: undefined }]);
            },
            label: "Beschreibung"
          }
        },
        {
          name: "payment_date",
          headerName: "Fälligkeitsdatum",
          asInput: {
            type: "date",
            onChange: (value, id) => {
              let found = false;
              this.editedData = this.editedData.map((data) => {
                if (data.id === id) {
                  return {
                    ...data,
                    dueDate: value
                  };
                }
                return data;
              }).concat(found ? [] : [{ id: id as number, name: undefined, dueDate: value, amount: undefined }]);
            },
            label: "Fälligkeitsdatum"
          }
        },
        {
          name: "total",
          headerName: "Betrag",
          asInput: {
            type: "number",
            onChange: (value, id) => {
              let found = false;
              this.editedData = this.editedData.map((data) => {
                if (data.id === id) {
                  return {
                    ...data,
                    amount: value
                  };
                }
                return data;
              }).concat(found ? [] : [{ id: id as number, name: undefined, dueDate: undefined, amount: value }]);
            },
            label: "Betrag",
            suffix: "euro"
          }
        },
        {
          name: "status",
          headerName: "Status",
          asButton: {
            name: (val: any) => val,
            class: (val: any) => (val === ADD_PAYMENT_STR) ? "paid" : " unpaid",
            navigate: ($event: PointerEvent, id) => {

              if (id !== -1) {
                if ($event.target) {
                  const val = ($event.target as HTMLButtonElement).innerText;
                  if (val === ADD_PAYMENT_STR) {
                    this.paidClicked(id);
                  } else {
                    this.paidClicked(id, true);
                  }
                }
              } else {
                alert("Spese zuerst speichern");
              }
            },
            color: (_) => "primary",
            selectedField: "id"
          }
        }
      ],
      (api) => api.countLiabilities(undefined, this.activeType === ALL_INVOICES ? undefined : this.activeType === PAID_INVOICES, this.dateFrom(), this.dateTo(), undefined, true)
    );
    this.expensesDataSource.loadData();
  }

  dateChanged() {
    this.expensesDataSource.loadData();
  }

  private paidClicked(id: number, removePayment = false) {
    this.expensesService.getLiability(id).pipe(first()).subscribe(res => {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: "400px",
        data: {
          title: removePayment ? "Zahlung löschen?" : "Spesen bezahlt?",
          text: removePayment ?
            `Möchtest du die Zahlung für "${res.name}" vom ${dayjs(res.due_date).format("DD.MM.YYYY")} löschen?` :
            `Möchtest du die Spesen "${res.name}" vom ${dayjs(res.due_date).format("DD.MM.YYYY")} als bezahlt markieren?`
        }
      });
      dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          if (removePayment) {
            this.expensesService.unpayLiability(id).pipe(first()).subscribe(() => {
              this.expensesDataSource.loadData();
            });
          } else {
            this.expensesService.payLiability(id).pipe(first()).subscribe(() => {
              this.expensesDataSource.loadData();
            });
          }
        }
      });
    });
  }

  private deleteClicked(id: number) {
    if (id === -1) {
      this.createActive = false;
      this.expensesDataSource.loadData();
      this.editedData = this.editedData.filter(data => data.id !== id);
    } else {
      this.expensesService.getLiability(id).pipe(first()).subscribe(res => {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          width: "400px",
          data: {
            title: "Spesen Löschen?",
            text: `Möchtest du die Spesen "${res.name}" vom ${dayjs(res.due_date).format("DD.MM.YYYY")} löschen? Diese Operation kann rückgängig gemacht werden.`
          }
        });
        dialogRef.afterClosed().subscribe((result: boolean) => {
          if (result) {
            this.expensesService.deleteLiability(id).pipe(first()).subscribe(() => {
              this.expensesDataSource.loadData();
            });
          }
        });
      });
    }
  }

  private saveClicked(id: number) {
    const edited = this.editedData.find(data => data.id === id);
    console.log(edited);
    if (edited) {
      const due_date = edited.dueDate ? new Date(edited.dueDate.getTime() + 7300_000).toISOString().split("T")[0] : undefined;
      if (id === -1) {
        if (edited.name && edited.dueDate && edited.amount) {
          this.expensesService.createLiability({
            name: edited.name,
            due_date,
            amount: edited.amount
          }).pipe(first()).subscribe(() => {
            this.selectedYear = edited.dueDate.getFullYear();
            if (this.selectedMonth !== -1) {
              this.selectedMonth = edited.dueDate.getMonth();
            }
            this.activeType = UNPAID_INVOICES;
            this.createActive = false;
            this.editedData = this.editedData.filter(data => data.id !== id);
            this.expensesDataSource.loadData();
          });
        }
      } else {
        this.expensesService.patchLiability(id, {
          name: edited.name,
          due_date,
          amount: edited.amount
        }).pipe(first()).subscribe(() => {
          this.editedData = this.editedData.filter(data => data.id !== id);
          this.expensesDataSource.loadData();
        });
      }
    }
  }

  protected setActiveType(link: string) {
    this.activeType = link;
    this.expensesDataSource.loadData();
  }

  protected readonly INVOICE_TYPES = INVOICE_TYPES;
  protected readonly MONTHS = MONTHS;
}
