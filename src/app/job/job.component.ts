import { Component,  OnInit} from "@angular/core";
import { TableDataSource } from "../shared/components/table-builder/table-builder.datasource";
import {  Router } from "@angular/router";
import { Observable, Subscriber } from "rxjs";
import dayjs from "dayjs/esm";
import { FileService } from "../shared/services/file.service";
import { DefaultService, Job, Stock } from "../../api/openapi";
import { ToolbarComponent } from "../shared/components/toolbar/toolbar.component";
import { DefaultLayoutDirective, DefaultLayoutAlignDirective } from "ng-flex-layout";
import { MatFormField, MatLabel } from "@angular/material/input";
import { MatSelect, MatOption } from "@angular/material/select";
import { MatTabGroup, MatTab } from "@angular/material/tabs";
import { TableBuilderComponent } from "../shared/components/table-builder/table-builder.component";
import { AsyncPipe } from "@angular/common";

@Component({
    selector: "app-job",
    templateUrl: "./job.component.html",
    styleUrls: ["./job.component.scss"],
    imports: [
        ToolbarComponent,
        DefaultLayoutDirective,
        DefaultLayoutAlignDirective,
        MatFormField,
        MatLabel,
        MatSelect,
        MatOption,
        MatTabGroup,
        MatTab,
        TableBuilderComponent,
        AsyncPipe,
    ],
})
export class JobComponent implements OnInit {
  createdJobDataSource: TableDataSource<Job, DefaultService>;
  acceptedJobDataSource: TableDataSource<Job, DefaultService>;
  finishedJobDataSource: TableDataSource<Job, DefaultService>;
  declinedJobDataSource: TableDataSource<Job, DefaultService>;
  stockTableDataSource: TableDataSource<Stock, DefaultService>;

  public $refresh: Observable<void>;
  public $year: Observable<number[]>;
  public selectedYear = dayjs().year();

  buttons = [
    {
      name: "Angenommen Aufträge - PDF generieren",
      navigate: (): void => {
        this.api.generateJobPdfJobPdfPost().subscribe((pdf) => {
          this.file.open(pdf);
        });
      },
    },
  ];

  private $refreshSubscriber: Subscriber<void>;

  constructor(
    private api: DefaultService,
    private router: Router,
    private file: FileService,
  ) {}

  ngOnInit(): void {
    this.initJobTables();
    this.initStocks();
    this.initRefreshObservables();
    this.$year = this.api.readAvailableYearsJobYearGet();
  }

  initJobTables(): void {
    this.initJobCreated();
    this.initJobsAccepted();
    this.initJobsFinished();
    this.initJobsDeclined();
  }

  initRefreshObservables(): void {
    this.$refresh = new Observable<void>((subscriber) => {
      this.$refreshSubscriber = subscriber;
    });
  }

  onAttach(): void {
    this.$refreshSubscriber.next();
  }

  yearChanged() {
    this.initJobTables();
  }

  private initJobCreated(): void {
    this.createdJobDataSource = new TableDataSource(
      this.api,
      (api, filter, sortDirection, skip, limit) =>
        api.readJobsJobGet(
          skip,
          limit,
          filter,
          undefined,
          "JOBSTATUS_CREATED",
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
              completion: dataSource.completion,
            },
            route: () => {
              this.router.navigateByUrl("/job/" + dataSource.id.toString());
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
        { name: "completion", headerName: "Fertigstellung" },
      ],
      (api) =>
        api.readJobCountJobCountGet(
          "JOBSTATUS_CREATED",
          true,
          undefined,
          this.selectedYear,
        ),
    );
    this.createdJobDataSource.loadData();
  }

  private initJobsAccepted(): void {
    this.acceptedJobDataSource = new TableDataSource(
      this.api,
      (api, filter, sortDirection, skip, limit) =>
        api.readJobsJobGet(
          skip,
          limit,
          filter,
          undefined,
          "JOBSTATUS_ACCEPTED",
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
              completion: dataSource.completion,
            },
            route: () => {
              this.router.navigateByUrl("/job/" + dataSource.id.toString());
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
        { name: "completion", headerName: "Fertigstellung" },
      ],
      (api) =>
        api.readJobCountJobCountGet(
          "JOBSTATUS_ACCEPTED",
          true,
          undefined,
          this.selectedYear,
        ),
    );
    this.acceptedJobDataSource.loadData();
  }

  private initJobsFinished() {
    this.finishedJobDataSource = new TableDataSource(
      this.api,
      (api, filter, sortDirection, skip, limit) =>
        api.readJobsJobGet(
          skip,
          limit,
          filter,
          undefined,
          "JOBSTATUS_COMPLETED",
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
              completion: dataSource.completion,
            },
            route: () => {
              this.router.navigateByUrl("/job/" + dataSource.id.toString());
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
        { name: "completion", headerName: "Fertigstellung" },
      ],
      (api) =>
        api.readJobCountJobCountGet(
          "JOBSTATUS_COMPLETED",
          true,
          undefined,
          this.selectedYear,
        ),
    );
    this.finishedJobDataSource.loadData();
  }

  private initJobsDeclined() {
    this.declinedJobDataSource = new TableDataSource(
      this.api,
      (api, filter, sortDirection, skip, limit) =>
        api.readJobsJobGet(
          skip,
          limit,
          filter,
          undefined,
          "JOBSTATUS_DECLINED",
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
              completion: dataSource.completion,
            },
            route: () => {
              this.router.navigateByUrl("/job/" + dataSource.id.toString());
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
        { name: "completion", headerName: "Fertigstellung" },
      ],
      (api) =>
        api.readJobCountJobCountGet(
          "JOBSTATUS_DECLINED",
          true,
          undefined,
          this.selectedYear,
        ),
    );
    this.declinedJobDataSource.loadData();
  }

  private initStocks() {
    this.stockTableDataSource = new TableDataSource(
      this.api,
      (api, filter, sortDirection, skip, limit) =>
        api.readStocksStockGet(skip, limit, filter),
      (dataSourceClasses) => {
        const rows = [];
        dataSourceClasses.forEach((dataSource) => {
          rows.push({
            values: {
              id: dataSource.id,
              name: dataSource.name,
            },
            route: () => {
              this.router.navigateByUrl("stock/" + dataSource.id.toString());
            },
          });
        });
        return rows;
      },
      [{ name: "name", headerName: "Name" }],
      (api) => api.readStockCountStockCountGet(),
    );
    this.stockTableDataSource.loadData();
  }
}
