import { Component, ComponentRef, OnInit } from "@angular/core";
import { TableDataSource } from "../../shared/components/table-builder/table-builder.datasource";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { WorkHourEditDialogComponent } from "./work-hour-edit-dialog/work-hour-edit-dialog.component";
import { CustomButton, ToolbarComponent } from "../../shared/components/toolbar/toolbar.component";
import { AuthService } from "../../shared/services/auth.service";
import { first } from "rxjs/operators";
import { minutesToDisplayableString } from "../../shared/date.util";
import { Observable, Subscriber } from "rxjs";
import { Workload, DefaultService } from "../../../api/openapi";
import { TableBuilderComponent } from "../../shared/components/table-builder/table-builder.component";

@Component({
    selector: 'app-work-hours',
    templateUrl: './work-hours.component.html',
    styleUrls: ['./work-hours.component.scss'],
    imports: [ToolbarComponent, TableBuilderComponent]
})
export class WorkHoursComponent implements OnInit {
  buttons: CustomButton[] = [];
  workloadDataSource: TableDataSource<Workload, DefaultService>;
  jobId: number;
  public $refresh: Observable<void>;
  private $refreshSubscriber: Subscriber<void>;


  constructor(private api: DefaultService, private route: ActivatedRoute,
              private router: Router, public dialog: MatDialog, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.jobId = parseInt(params.job_id, 10);
      if (isNaN(this.jobId)) {
        console.error("RecalculationDetail: Cannot parse jobId");
        this.router.navigateByUrl("recalculation");
        return;
      }
      this.initWorkloadTable();
    });

    this.authService.currentUserHasRight("work_hours:create").pipe(first()).subscribe(allowed => {
      if (allowed) {
        this.buttons.push({
          name: "Arbeitsstunden hinzufügen",
          navigate: () => {
            this.workHourClicked(-1);
          },
        });
      }
    });
    this.initRefreshObservables();
  }

  initRefreshObservables(): void {
    this.$refresh = new Observable<void>((subscriber => {
      this.$refreshSubscriber = subscriber;
    }));
  }

  onAttach(ref: ComponentRef<any>, activatedRoute: ActivatedRoute): void {
    this.$refreshSubscriber.next();
  }

  workHourClicked(userId: number): void {
    const dialogRef = this.dialog.open(WorkHourEditDialogComponent, {
      width: "600px",
      data: {
        userId,
        jobId: this.jobId,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.workloadDataSource.loadData();
      }
    });
  }

  private initWorkloadTable(): void {
    this.workloadDataSource = new TableDataSource(
      this.api,
      (api, filter, sortDirection, skip, limit) =>
        api.readWorkloadsWorkloadGet(skip, limit, filter, undefined, this.jobId),
      (dataSourceClasses) => {
        const rows = [];
        dataSourceClasses.forEach((dataSource) => {
          rows.push(
            {
              values: {
                "user.fullname": dataSource.user.fullname,
                minutes: minutesToDisplayableString(dataSource.minutes),
                // eslint-disable-next-line @typescript-eslint/naming-convention
                minutes_direction: minutesToDisplayableString(dataSource.minutes_direction),
                cost: dataSource.cost,
              },
              route: () => {
                this.authService.currentUserHasRight("work_hours:modify").pipe(first()).subscribe(allowed => {
                  if (allowed) {
                    this.workHourClicked(dataSource.user.id);
                  }
                });

              },
            });
        });
        return rows;
      },
      [
        { name: "user.fullname", headerName: "Name" },
        { name: "minutes", headerName: "Zeit" },
        { name: "minutes_direction", headerName: "Regie" },
        { name: "cost", headerName: "Kosten [€]" },
      ],
      (api) => api.readWorkloadCountWorkloadCountGet(undefined, this.jobId),
    );
    this.workloadDataSource.loadData();
  }

}
