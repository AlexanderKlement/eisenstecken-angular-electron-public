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
import { INVOICE_TYPES } from "../../shared/types";
import { Dayjs } from "dayjs";

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
  public $year: Observable<number[]>;

  public selectedYear = dayjs().year();
  public selectedMonth = dayjs().month();

  expensesDataSource: TableDataSource<Liability, LiabilityService>;
  activeType = "Unbezahlt";
  headerButtons: TableButton[] = [
    {
      name: () => "Neue Spese hinzufügen",
      color: () => "primary",
      selectedField: "",
      navigate: () => {
        // TODO
      },
      class: () => ""
    }
  ];

  dateFromRaw() {
    return dayjs().set("minute", 1).set("hour", 2).set("date", 1).set("month", this.selectedMonth).set("year", this.selectedYear);
  }

  dateFrom() {
    return this.dateFromRaw().toISOString().split("T")[0];
  }

  dateTo() {
    return this.dateFromRaw().clone().set("month", this.selectedMonth + 1).set("date", 0).toISOString().split("T")[0];
  }

  editedData: { name?: string, dueDate?: Dayjs, amount?: number, id: number }[] = [];

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
      navigate: ($event, id) => {
        const edited = this.editedData.find(data => data.id === id);
        if (edited) {
          // TODO save edited
        }
      },
      color: _ => "primary",
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

  ngOnInit() {
    this.initDataSources();
    this.$year = this.api.getAvailableYearsIngoingInvoiceAvailableYearsGet();
  }

  initDataSources() {
    this.expensesDataSource = new TableDataSource(
      this.expensesService,
      (api, filter, sortDirection, skip, limit) => {
        return api.getLiabilities(skip, limit, filter, this.activeType === "Unbezahlt" ? false : this.activeType === "Bezahlt" ? true : undefined, this.dateFrom(), this.dateTo());
      },
      (dataSourceClasses) => {
        const rows = [];
        dataSourceClasses.forEach((dataSource) => {
          rows.push({
            values: {
              id: dataSource.id,
              name: dataSource.name,
              payment_date: dayjs(dataSource.due_date).format("YYYY-MM-DD"),
              total: dataSource.amount,
              status: dataSource.paid ? "Zahlung löschen" : ADD_PAYMENT_STR,
              condition: dataSource.id
            },
            route: () => {
              //  this.router.navigateByUrl("/invoice/ingoing/" + dataSource.id.toString());
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
            navigate: ($event, id) => {
              this.paidClicked($event, id);
            },
            color: (_) => "primary",
            selectedField: "id"
          }
        }
      ],
      (api) => api.countLiabilities(undefined, undefined, this.dateFrom(), this.dateTo())
    );
    this.expensesDataSource.loadData();
  }

  dateChanged() {
    this.expensesDataSource.loadData();
  }

  private paidClicked($event: any, id: number) {

  }

  private deleteClicked($event: any, id: number) {

  }

  protected setActiveType(link: string) {
    this.activeType = link;
    this.expensesDataSource.loadData();
  }

  protected readonly INVOICE_TYPES = INVOICE_TYPES;
  protected readonly MONTHS = MONTHS;
}
