import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DefaultLayoutAlignDirective, DefaultLayoutDirective, FlexLayoutModule } from "ng-flex-layout";
import { MatFormField, MatInput, MatLabel, MatSuffix } from "@angular/material/input";
import { MatButton } from "@angular/material/button";
import { LocalConfigRenderer } from "../../LocalConfigRenderer";
import { MatOption, MatSelect } from "@angular/material/select";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FileService } from "../../shared/services/file.service";
import { MatIcon } from "@angular/material/icon";
import { MtxSelect } from "@ng-matero/extensions/select";
import { AsyncPipe } from "@angular/common";
import { concat, Observable, of, Subject } from "rxjs";
import { DefaultService, Job, OutgoingInvoice } from "../../../api/openapi";
import { catchError, distinctUntilChanged, first, switchMap, tap } from "rxjs/operators";

@Component({
  selector: "app-program-settings",
  imports: [
    FormsModule,
    DefaultLayoutDirective,
    DefaultLayoutAlignDirective,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatButton,
    MatSelect,
    MatOption,
    MatIcon,
    MatSuffix,
    MtxSelect,
    AsyncPipe,
    FlexLayoutModule
  ],
  templateUrl: "./program-settings.component.html",
  styleUrl: "./program-settings.component.scss"
})
export class ProgramSettingsComponent {
  submitted = false;
  private file = inject(FileService);
  protected snackBar = inject(MatSnackBar);
  protected api = inject(DefaultService);
  programSettingsGroup = new FormGroup<{
    environment: FormControl<string>,
    cadPath: FormControl<string>,
    vwPath: FormControl<string>,
  }>({
    environment: new FormControl(LocalConfigRenderer.getInstance().getApi()),
    cadPath: new FormControl(LocalConfigRenderer.getInstance().getCADPath()),
    vwPath: new FormControl(LocalConfigRenderer.getInstance().getVWPath())
  });
  jobsInput$ = new Subject<string>();
  jobsLoading = false;
  jobs$: Observable<Job[]> = concat(
    of([]), // default items
    this.jobsInput$.pipe(
      distinctUntilChanged(),
      tap(() => (this.jobsLoading = true)),
      switchMap(term =>
        this.api.readJobsJobGet(0, 20, term, undefined, "JOBSTATUS_ACCEPTED").pipe(
          catchError(() => of([])), // empty list on error
          tap(() => (this.jobsLoading = false))
        )
      )
    )
  );
  trackByFnJob = (item: Job) => `job-${item.id}`;

  invoiceInput$ = new Subject<string>();
  invoiceLoading = false;
  invoices$: Observable<OutgoingInvoice[]> = concat(
    of([]), // default items
    this.invoiceInput$.pipe(
      distinctUntilChanged(),
      tap(() => (this.invoiceLoading = true)),
      switchMap(term =>
        this.api.readOutgoingInvoicesOutgoingInvoiceGet(0, term, 20).pipe(
          catchError(() => of([])), // empty list on error
          tap(() => (this.invoiceLoading = false))
        )
      )
    )
  );
  trackByFnInvoice = (item: Job) => `job-${item.id}`;

  selectCADPathClicked() {
    this.file.selectFolder().then((path) => {
      this.programSettingsGroup.patchValue({ cadPath: path });
    });
  }

  selectVWPathClicked() {
    this.file.selectFolder().then((path) => {
      this.programSettingsGroup.patchValue({ vwPath: path });
    });
  }

  public onSubmit(): void {
    this.submitted = true;
    LocalConfigRenderer.getInstance().setMultiple({
      api: this.programSettingsGroup.get("environment").value,
      cadPath: this.programSettingsGroup.get("cadPath").value,
      vwPath: this.programSettingsGroup.get("vwPath").value
    });
    this.snackBar.open("Speichern erfolgreich!", "Ok", {
      duration: 3000
    });
  }

  protected onSelectJob($event: Job) {
    this.api.readOffersByJobOfferJobJobIdGet($event.id).pipe(first()).subscribe(offers => {
      const offerWithPdf = offers.find(o => !!o.pdf);
      if (offerWithPdf) {
        this.file.open(offerWithPdf.pdf).then(() => {
          this.snackBar.open("PDF wird geöffnet!", "Ok", {
            duration: 3000
          });
        });
      } else {
        this.snackBar.open("Dieser Auftrag het kein Angebot mit hinterlegten PDF!", "Ok", {
          duration: 3000
        });
      }
    });
  }

  protected onSelectInvoice($event: OutgoingInvoice) {
    if ($event.pdf) {
      this.file.open($event.pdf).then(() => {
        this.snackBar.open("PDF wird geöffnet!", "Ok", {
          duration: 3000
        });
      });
    } else {
      this.snackBar.open("Diese Rechnung hat kein PDF hinterlegt!", "Ok", {
        duration: 3000
      });
    }
  }
}
