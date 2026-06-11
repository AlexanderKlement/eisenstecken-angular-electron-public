import { Component, inject, OnInit } from "@angular/core";
import OfferContainerComponent from "../offer-container/offer-container.component";
import { AsyncPipe } from "@angular/common";
import {
  DefaultFlexDirective,
  DefaultLayoutAlignDirective,
  DefaultLayoutDirective,
  DefaultLayoutGapDirective
} from "ng-flex-layout";
import { MatButton } from "@angular/material/button";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { ActivatedRoute, Router } from "@angular/router";
import { DefaultService, OfferElementListElement, OfferV2Service, OfferV2Version } from "../../../api/openapi";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import { BehaviorSubject, concat, of, Subject } from "rxjs";
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { catchError, distinctUntilChanged, switchMap, take, tap } from "rxjs/operators";
import { confirmDeleteDialog } from "../offer.util";
import dayjs from "dayjs/esm";
import { SharedModule } from "../../shared/shared.module";
import { MatFormField, MatInput, MatLabel, MatSuffix } from "@angular/material/input";
import { MtxSelect } from "@ng-matero/extensions/select";
import {
  newEmptyOfferEntryGroup,
  OfferEntryGroup,
  OfferV2EntryEditComponent
} from "./offer-v2-entry-edit/offer-v2-entry-edit.component";
import { ListElementComponent } from "../../shared/components/list-element/list-element.component";
import { MatIcon } from "@angular/material/icon";

type OfferV2Group = {
  name: FormControl<string>;
  globalAddPercent: FormControl<number>;
  globalPriceDiff: FormControl<number>;
  globalSubPercent: FormControl<number>;
  jobId: FormControl<number>;
  content: FormArray<FormGroup<OfferEntryGroup>>
}

@Component({
  selector: "app-offer-v2-edit",
  imports: [
    OfferContainerComponent,
    AsyncPipe,
    DefaultFlexDirective,
    DefaultLayoutAlignDirective,
    DefaultLayoutDirective,
    DefaultLayoutGapDirective,
    MatButton,
    MatProgressSpinner,
    SharedModule,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MtxSelect,
    MatSuffix,
    OfferV2EntryEditComponent,
    ListElementComponent,
    MatIcon
  ],
  templateUrl: "./offer-v2-edit.component.html",
  styleUrl: "./offer-v2-edit.component.scss"
})
export class OfferV2EditComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private jobService = inject(DefaultService);
  private offerService = inject(OfferV2Service);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  subTitle = "Angebot erstellen";
  offerV2Id: number;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  offerGroup = new FormGroup<OfferV2Group>({
    name: new FormControl("", Validators.required),
    globalAddPercent: new FormControl(0),
    globalSubPercent: new FormControl(0),
    globalPriceDiff: new FormControl(0),
    jobId: new FormControl(-1),
    content: new FormArray([])
  });
  versions: OfferV2Version[] = [];
  jobsInput$ = new Subject<string>();

  jobsLoading = false;

  jobs$ = concat(
    of([]), // default items
    this.jobsInput$.pipe(
      distinctUntilChanged(),
      tap(() => (this.jobsLoading = true)),
      switchMap(term =>
        this.jobService.readJobsJobGet(0, 20, term, null, "JOBSTATUS_ACCEPTED, JOBSTATUS_CREATED").pipe(
          catchError(() => of([])), // empty list on error
          tap(() => (this.jobsLoading = false))
        )
      )
    )
  );

  trackByFn = (item: OfferElementListElement) => item.id;

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      try {
        this.offerV2Id = parseInt(params.id, 10);
      } catch {
        // is createMode
      }
      this.initData(params.method);
    });
  }

  initData(method?: string) {
    if (this.offerV2Id) {
      // TODO get version and single
      this.offerService.getOfferV2OfferV2OfferOfferIdGet(this.offerV2Id).pipe(take(1)).subscribe(
        {
          next: data => {
            this.offerService.getOfferVersionsOfferV2OfferV2IdVersionsGet(data.id).pipe(take(1)).subscribe({
              next: versions => {
                this.versions = versions;
                this.offerGroup = new FormGroup({
                  name: new FormControl(data.name),
                  globalPriceDiff: new FormControl(data.globalPriceDiff),
                  globalSubPercent: new FormControl(data.globalSubPercent),
                  globalAddPercent: new FormControl(data.globalAddPercent),
                  jobId: new FormControl(-1),
                  content: new FormArray([]) // TODO map
                });
              },
              error: () => {
                this.offerGroup = new FormGroup({
                  name: new FormControl(data.name),
                  globalPriceDiff: new FormControl(data.globalPriceDiff),
                  globalSubPercent: new FormControl(data.globalSubPercent),
                  globalAddPercent: new FormControl(data.globalAddPercent),
                  jobId: new FormControl(-1),
                  content: new FormArray([])
                });
              }
            });

          },
          error: error => {
            this.snackBar.open("Das Angebot konnte nicht gefunden werden: " + error, "Ok", { duration: 8000 });
            this.offerV2Id = undefined;
            this.initData();
          }
        }
      );
      this.subTitle = "Angebot bearbeiten";
      if (method === "copy") {
        this.offerV2Id = undefined;
        this.subTitle = "Angebot erstellen";
      } else if (method === "delete") {
        this.onDelete();
      }
    } else {
      this.subTitle = "Angebot erstellen";
    }
  }

  onDelete() {
    if (this.offerV2Id) {
      this.loadingSubject.next(true);
      confirmDeleteDialog(this.offerV2Id, this.dialog, "Angebot", this.offerService.deleteOfferTemplateOfferV2TemplateTemplateIdDelete,
        {
          loadData: this.subscription.next
        }, this.snackBar);
    }
  }

  onSave() {
    this.loadingSubject.next(true);

    if (!this.offerGroup.valid) {
      this.snackBar.open("Bitte alle Felder kontrollieren: ", "Ok", { duration: 8000 });
      this.loadingSubject.next(false);
      return;
    }
    if (this.offerV2Id) {
      this.offerService.patchOfferV2OfferV2OfferOfferIdPost(this.offerV2Id, true, {
        name: this.offerGroup.get("name").value,
        globalAddPercent: this.offerGroup.get("globalAddPercent").value ?? 0,
        globalPriceDiff: this.offerGroup.get("globalPriceDiff").value ?? 0,
        globalSubPercent: this.offerGroup.get("globalSubPercent").value ?? 0,
        content: [],
        versionName: `Speicherung - ${dayjs().format()}`
      }).pipe(take(1)).subscribe(this.subscription);
    } else {
      const jobId = this.offerGroup.get("jobId").value;
      if (jobId === -1) {
        this.snackBar.open("Bitte einen Auftrag auswählen: ", "Ok", { duration: 8000 });
        this.loadingSubject.next(false);
        return;
      }
      this.offerService.createOfferV2OfferV2OfferPut({
        name: this.offerGroup.get("name").value,
        jobId
      }).pipe(take(1)).subscribe({
        next: data => {
          this.offerGroup = new FormGroup({
            name: new FormControl(data.name),
            jobId: new FormControl(jobId),
            globalAddPercent: new FormControl(data.globalAddPercent),
            globalSubPercent: new FormControl(data.globalSubPercent),
            globalPriceDiff: new FormControl(data.globalPriceDiff),
            content: new FormArray([])
          });
          this.offerV2Id = data.id;
          this.subTitle = "Angebot bearbeiten";
        },
        error: this.subscription.error
      });
    }
  }

  onAddContent(index = 0) {
    this.offerGroup.controls.content.insert(index, newEmptyOfferEntryGroup());
  }

  onDeleteContent(index: number) {
    this.offerGroup.controls.content.removeAt(index);
  }

  subscription = {
    next: () => {
      this.loadingSubject.next(false);
      this.router.navigateByUrl("/offer_v2").then();
    },
    error: (error: any) => {
      this.loadingSubject.next(false);
      this.snackBar.open("Etwas ist schief gelaufen: " + error, "Ok", { duration: 8000 });
    }
  };
}
