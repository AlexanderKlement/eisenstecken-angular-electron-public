import { Component, OnInit } from "@angular/core";
import { VietJobList, VietLog, VietService } from "../../api/openapi";
import { BehaviorSubject } from "rxjs";
import { first } from "rxjs/operators";
import { MatTab, MatTabGroup } from "@angular/material/tabs";
import { AsyncPipe, DatePipe } from "@angular/common";
import { MatButton } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { Industry40CreateDialogComponent } from "./industry-4-0-create-dialog/industry-4-0-create-dialog.component";

@Component({
  selector: 'app-industry-4-0',
  imports: [
    MatTab,
    MatTabGroup,
    AsyncPipe,
    MatButton,
    DatePipe,
  ],
  templateUrl: './industry-4-0.component.html',
  styleUrl: './industry-4-0.component.scss',
})
export class Industry40Component implements OnInit {

  constructor(private viet: VietService, private dialog: MatDialog) {
  }

  public jobSubject = new BehaviorSubject<VietJobList>({
    pending: [],
    running: [],
    completed: [],
  });
  public jobs$ = this.jobSubject.asObservable();

  public readonly logLimit = 25;
  public logOffset = 0;
  public hasNextLogPage = false;

  public logSubject = new BehaviorSubject<VietLog[]>([]);
  public logs$ = this.logSubject.asObservable();



  ngOnInit(): void {
    this.refreshJobList();
    this.refreshLogList();
  }

  private refreshLogList(): void {
    this.viet
      .getLogsVietLogsGet(this.logLimit, this.logOffset)
      .pipe(first())
      .subscribe((logs) => {
        const safeLogs = logs ?? [];
        this.logSubject.next(safeLogs);
        this.hasNextLogPage = safeLogs.length === this.logLimit;
      });
  }

  prevLogPage(): void {
    this.logOffset = Math.max(0, this.logOffset - this.logLimit);
    this.refreshLogList();
  }

  nextLogPage(): void {
    if (!this.hasNextLogPage) return;
    this.logOffset = this.logOffset + this.logLimit;
    this.refreshLogList();
  }

  private refreshJobList() {
    this.viet.getJobsVietJobsGet().pipe(first()).subscribe((jobList) => this.jobSubject.next(jobList));
  }

  createJobClicked() {
    const dialogRef = this.dialog.open(Industry40CreateDialogComponent, {
      width: "400px",
    });

    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe((result) => {
        if (!result) return; // user cancelled

        this.viet
          .uploadJobVietPost(
            result.job_id,
            result.thickness,
            result.recipe,
            result.pieces,
          )
          .pipe(first())
          .subscribe({
            next: () => this.refreshJobList(),
            error: (err) => {
              console.error("Job konnte nicht erstellt werden", err);
            },
          });
      });
  }
}
