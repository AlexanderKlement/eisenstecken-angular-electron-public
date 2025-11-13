import { Component,  OnInit } from "@angular/core";
import { TableDataSource } from "../shared/components/table-builder/table-builder.datasource";
import {  Router } from "@angular/router";
import { Observable, Subscriber } from "rxjs";
import { CustomButton, ToolbarComponent } from "../shared/components/toolbar/toolbar.component";
import { DefaultService, Job } from "../../api/openapi";
import dayjs from "dayjs/esm";
import { DefaultLayoutDirective, DefaultLayoutAlignDirective } from "ng-flex-layout";
import { MatFormField, MatLabel } from "@angular/material/input";
import { MatSelect, MatOption } from "@angular/material/select";
import { TableBuilderComponent } from "../shared/components/table-builder/table-builder.component";
import { AsyncPipe } from "@angular/common";

@Component({
    selector: "app-recalculation",
    templateUrl: "./recalculation.component.html",
    styleUrls: ["./recalculation.component.scss"],
    imports: [
        ToolbarComponent,
        DefaultLayoutDirective,
        DefaultLayoutAlignDirective,
        MatFormField,
        MatLabel,
        MatSelect,
        MatOption,
        TableBuilderComponent,
        AsyncPipe,
    ],
})
export class RecalculationComponent implements OnInit {
  jobDataSource: TableDataSource<Job>;
  buttons: CustomButton[] = [
    {
      name: "Oberflächen-Vorlage",
      navigate: () => {
        this.router.navigateByUrl("paint-template");
      },
    },
  ];

  public $refresh: Observable<void>;
  public $year: Observable<number[]>;
  private $refreshSubscriber: Subscriber<void>;
  public selectedYear = dayjs().year();

  constructor(
    private api: DefaultService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.initJobDataSource();
    this.initRefreshObservables();
    this.$year = this.api.readAvailableYearsJobYearGet();
  }

  initRefreshObservables(): void {
    this.$refresh = new Observable<void>((subscriber) => {
      this.$refreshSubscriber = subscriber;
    });
  }

  onAttach(): void {
    this.$refreshSubscriber.next();
  }

  initJobDataSource(): void {
    this.jobDataSource = new TableDataSource(
      this.api,
      (api, filter, sortDirection, skip, limit) =>
        api.readJobsJobGet(
          skip,
          limit,
          filter,
          undefined,
          "JOBSTATUS_ACCEPTED, JOBSTATUS_COMPLETED",
          true,
          this.selectedYear,
        ),
      (dataSourceClasses) => {
        const rows = [];
        dataSourceClasses.forEach((dataSource) => {
          rows.push({
            values: {
              name: dataSource.name,
              code: dataSource.code,
              "client.name": dataSource.client.fullname,
              "responsible.fullname": dataSource.responsible.fullname,
            },
            route: () => {
              this.router.navigateByUrl(
                "/recalculation/" + dataSource.id.toString(),
              );
            },
          });
        });
        return rows;
      },
      [
        { name: "code", headerName: "Kommissionsnummer" },
        { name: "name", headerName: "Kommission" },
        { name: "client.name", headerName: "Kunde" },
        { name: "responsible.fullname", headerName: "Zuständig" },
      ],
      (api) => api.readJobCountJobCountGet("JOBSTATUS_COMPLETED", true),
    );
    this.jobDataSource.loadData();
  }

  yearChanged() {
    this.initJobDataSource();
  }
}
