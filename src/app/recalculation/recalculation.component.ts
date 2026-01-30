import { Component, OnInit } from "@angular/core";
import { TableDataSource } from "../shared/components/table-builder/table-builder.datasource";
import { Router } from "@angular/router";
import { Observable, Subscriber } from "rxjs";
import { CustomButton, ToolbarComponent } from "../shared/components/toolbar/toolbar.component";
import { DefaultService, RecalculationService, RecalculationSmall } from "../../api/openapi";
import dayjs from "dayjs/esm";
import { DefaultLayoutDirective, DefaultLayoutAlignDirective } from "ng-flex-layout";
import { MatFormField, MatLabel } from "@angular/material/input";
import { MatSelect, MatOption } from "@angular/material/select";
import { TableBuilderComponent } from "../shared/components/table-builder/table-builder.component";
import { AsyncPipe } from "@angular/common";

@Component({
  selector: 'app-recalculation',
  templateUrl: './recalculation.component.html',
  styleUrls: ['./recalculation.component.scss'],
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
  recalculationDataSource: TableDataSource<RecalculationSmall, RecalculationService>;
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
    private recalculationService: RecalculationService,
  ) {
  }

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
    this.recalculationDataSource = new TableDataSource(
      this.recalculationService,
      (recalculationService, filter, sortDirection, skip, limit) =>
        recalculationService.getRecalculations(
          skip,
          limit,
          filter,
          this.selectedYear,
        ),
      (dataSourceClasses) => {
        const rows = [];
        dataSourceClasses.forEach((dataSource) => {
          rows.push({
            values: {
              names: dataSource.jobs.map(job => job.name).join(", "),
              codes: dataSource.jobs.map(job => job.code).join(", "),
              name: dataSource.name,
              "client.name": dataSource.jobs[0].client.fullname,
              "responsible.fullname": dataSource.jobs[0].responsible.fullname,
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
        { name: "codes", headerName: "Kommissionsnummern" },
        { name: "names", headerName: "Kommissionen" },
        { name: "name", headerName: "Beschreibung" },
        { name: "client.name", headerName: "Kunde" },
        { name: "responsible.fullname", headerName: "Zuständig" },
      ],
      (api) => api.getRecalculationCount(this.selectedYear),
    );
    this.recalculationDataSource.loadData();
  }

  yearChanged() {
    this.initJobDataSource();
  }
}
