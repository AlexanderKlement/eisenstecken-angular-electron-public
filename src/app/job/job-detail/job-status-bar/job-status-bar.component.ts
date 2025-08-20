import { Component, Input, OnInit } from "@angular/core";
import { Observable, ReplaySubject, Subject } from "rxjs";
import { first, map } from "rxjs/operators";
import { ConfirmDialogComponent } from "../../../shared/components/confirm-dialog/confirm-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { JobStatus, DefaultService, JobStatusType } from "../../../../api/openapi";

@Component({
  selector: 'app-job-status-bar',
  templateUrl: './job-status-bar.component.html',
  styleUrls: ['./job-status-bar.component.scss'],
})
export class JobStatusBarComponent implements OnInit {

  @Input() jobId: number;
  public jobStatusList: ReplaySubject<JobStatus[]>;
  public toolBarColor = "created";
  public selectedStatus: JobStatus;
  public loading = true;


  private colorMap = [
    [JobStatusType.JobstatusCreated, "created"],
    [JobStatusType.JobstatusAccepted, "accepted"],
    [JobStatusType.JobstatusCompleted, "completed"],
    [JobStatusType.JobstatusDeclined, "declined"],
  ];

  constructor(private api: DefaultService, private dialog: MatDialog) {
  }


  ngOnInit(): void {
    this.jobStatusList = new ReplaySubject<JobStatus[]>(1);
    this.api.getStatusOptionsJobStatusOptionsGet().pipe(first()).subscribe((jobStatusList) => {
      this.jobStatusList.next(jobStatusList);
    });
    this.api.readJobStatusJobStatusJobIdGet(this.jobId).pipe(first()).subscribe(jobStatus => {
      this.selectedStatus = jobStatus;
      this.refresh();
      this.loading = false;
    });
  }

  public onStatusClicked(clickedJobStatus: JobStatus): void {
    this.api.updateJobStatusJobStatusJobIdPost(this.jobId, clickedJobStatus.status).pipe(first()).subscribe(jobStatusUpdateResponse => {
      if (jobStatusUpdateResponse.success) {
        this.getStatus(jobStatusUpdateResponse.status).pipe(first()).subscribe(newJobStatus => {
          this.selectedStatus = newJobStatus;
          this.refresh();
        });
      } else {
        let errorText = "";
        for (const singleError of jobStatusUpdateResponse.errors) {
          errorText += singleError + "\n";
        }
        this.dialog.open(ConfirmDialogComponent, {
          width: "400px",

          data: {
            title: "Status konnte nicht geändert werden",
            text: errorText,
          },
        });
      }
    });
  }


  private getStatus(statusName: string): Observable<JobStatus> {
    return this.jobStatusList.pipe(map((jobStatusList) => {
      for (const jobStatus of jobStatusList) {
        if (jobStatus.status === statusName) {
          return jobStatus;
        }
      }
      console.error("JobStatusBar: Did not find status of job");
      return null;
    }));
  }

  private refresh(): void {
    this.toolBarColor = this.getColorWithEnum(this.selectedStatus.status);
  }

  private getColorWithEnum(enumString: string): string {
    for (const color of this.colorMap) {
      if (color[0] === enumString) {
        return color[1];
      }
    }
  }

}
