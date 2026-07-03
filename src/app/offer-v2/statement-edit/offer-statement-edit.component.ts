import { Component, inject, OnInit } from "@angular/core";
import { DefaultService, OfferStatement, OfferV2, OfferV2Service, OfferV2WithVersion } from "../../../api/openapi";
import { ActivatedRoute } from "@angular/router";
import { catchError, distinctUntilChanged, switchMap, take, tap } from "rxjs/operators";
import { BehaviorSubject, concat, of, Subject } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { confirmDeleteDialog } from "../offer.util";
import OfferContainerComponent from "../offer-container/offer-container.component";
import {
  DefaultFlexDirective,
  DefaultLayoutAlignDirective,
  DefaultLayoutDirective,
  DefaultLayoutGapDirective,
  FlexModule
} from "ng-flex-layout";
import { AsyncPipe, formatCurrency, Location } from "@angular/common";
import { MatButton, MatIconButton } from "@angular/material/button";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatFormField, MatHint, MatInput, MatLabel, MatSuffix } from "@angular/material/input";
import { getNumericVal } from "../../shared/custom-validators";
import { MtxSelect } from "@ng-matero/extensions/select";
import {
  mapStatementEntryToGroup,
  mapStatementEntryToInput,
  OfferStatementEntryEditComponent,
  StatementEntryGroup
} from "./statement-entry-edit/offer-statement-entry-edit.component";
import { MatIcon } from "@angular/material/icon";
import { evaluateStatementPrice } from "./statement-utils";
import OfferV2PreviewDialogComponent from "../offer-v2-edit/offer-v2-preview-dialog/offer-v2-preview-dialog.component";

type StatementGroup = {
  id: FormControl<number>;
  name: FormControl<string>;
  price: FormControl<number>;
  subPercent: FormControl<number>;
  priceSubtraction: FormControl<number>;
  originalPrice: FormControl<number>;
  offerId: FormControl<number>;
  offerName: FormControl<string>;
  clientName: FormControl<string>;
  content: FormArray<FormGroup<StatementEntryGroup>>;
}

function newStatementGroup() {
  return new FormGroup<StatementGroup>({
    id: new FormControl(-1),
    name: new FormControl(""),
    price: new FormControl(0),
    subPercent: new FormControl(0),
    priceSubtraction: new FormControl(0),
    originalPrice: new FormControl(0),
    offerId: new FormControl(0),
    offerName: new FormControl(""),
    clientName: new FormControl(""),
    content: new FormArray([])
  });
}


function mapStatementGroup(data: OfferStatement) {
  return new FormGroup<StatementGroup>({
    id: new FormControl(data.id),
    name: new FormControl(data.name),
    price: new FormControl(data.price),
    subPercent: new FormControl(data.subPercent),
    priceSubtraction: new FormControl(data.priceSubtraction),
    originalPrice: new FormControl(data.originalPrice),
    offerId: new FormControl(data.offer.id),
    offerName: new FormControl(data.offer.name),
    clientName: new FormControl(data.offer.job.client.fullname),
    content: new FormArray(data.content.map(mapStatementEntryToGroup))
  });
}

@Component({
  selector: "app-offer-statement-edit",
  imports: [
    OfferContainerComponent,
    DefaultLayoutAlignDirective,
    DefaultLayoutDirective,
    DefaultLayoutGapDirective,
    AsyncPipe,
    DefaultFlexDirective,
    MatButton,
    MatProgressSpinner,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatHint,
    FlexModule,
    MtxSelect,
    OfferStatementEntryEditComponent,
    MatIcon,
    MatSuffix,
    MatIconButton
  ],
  templateUrl: "./offer-statement-edit.component.html",
  styleUrl: "./offer-statement-edit.component.scss"
})
export class OfferStatementEditComponent implements OnInit {
  private offerService = inject(OfferV2Service);
  private api = inject(DefaultService);
  private location = inject(Location);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  statementGroup: FormGroup<StatementGroup> = newStatementGroup();
  offer: OfferV2WithVersion;
  subTitle = "Aufstellung erstellen";
  statementId: number;
  jobId: number | undefined = undefined;
  offersInput$ = new Subject<string>();
  hasChanged = false;
  offersLoading = false;
  trackByFn = (item: OfferV2) => item.id;

  offers$ = concat(
    of([]), // default items
    this.offersInput$.pipe(
      distinctUntilChanged(),
      tap(() => (this.offersLoading = true)),
      switchMap(term =>
        this.offerService.getOffersOfferV2OffersGet(this.jobId, 0, term, 20).pipe(
          catchError(() => of([])), // empty list on error
          tap(() => (this.offersLoading = false))
        )
      )
    )
  );

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      try {

        this.statementId = parseInt(params.id, 10);
        if (Number.isNaN(this.statementId)) {
          this.statementId = undefined;
        }
      } catch {
        // is createMode
      }
      try {
        this.jobId = parseInt(params.job_id, 10);
        if (Number.isNaN(this.jobId)) {
          this.jobId = undefined;
        }
      } catch {
        // no JobID emitted
      }
      this.initData(params.method);
    });
  }

  initData(method?: string) {
    if (this.statementId) {
      this.offerService.getStatementOfferV2StatementStatementIdGet(this.statementId).pipe(take(1)).subscribe(
        {
          next: data => {
            this.offer = {
              ...data.offer,
              content: data.offerContent
            };
            this.statementGroup = mapStatementGroup(data);
            this.statementGroup.valueChanges.subscribe(() => {
              this.statementGroupValidator();
            });
          },
          error: error => {
            this.snackBar.open("Die Aufstellung konnte nicht gefunden werden: " + error, "Ok", { duration: 8000 });
            this.statementId = undefined;
            this.initData();
          }
        }
      );
      this.subTitle = "Aufstellung bearbeiten";
      if (method === "copy") {
        this.statementId = undefined;
        this.subTitle = "Aufstellung erstellen";
      } else if (method === "delete") {
        this.onDelete();
      }
    } else {
      this.subTitle = "Aufstellung erstellen";
      this.statementGroup = newStatementGroup();
      this.statementGroup.valueChanges.subscribe(() => {
        this.statementGroupValidator();
      });
    }
  }

  get betweenPrice() {
    const price = getNumericVal(this.statementGroup.get("price"));
    const priceSubtraction = getNumericVal(this.statementGroup.get("priceSubtraction"));
    const subPercent = getNumericVal(this.statementGroup.get("subPercent"));
    return (price + priceSubtraction) / (1 - (subPercent / 100));
  }

  statementGroupValidator() {
    if (this.statementGroup) {
      this.hasChanged = true;
      evaluateStatementPrice(this.statementGroup.controls.content);
      const priceSubtraction = getNumericVal(this.statementGroup.get("priceSubtraction"));
      const subPercent = getNumericVal(this.statementGroup.get("subPercent"));
      const newBetweenPrice = this.statementGroup.controls.content.controls.reduce((prev, cur) => {
        return prev + getNumericVal(cur.get("price"));
      }, 0);
      const newPercentedPrice = newBetweenPrice - (newBetweenPrice * (subPercent / 100));
      this.statementGroup.patchValue({
        price: newPercentedPrice - priceSubtraction
      }, { emitEvent: false });
    }
  }

  onSave(callback?: (succ: boolean) => void) {
    if (this.statementGroup.valid) {
      this.loadingSubject.next(true);
      if (this.statementId) {
        this.offerService.patchOfferStatementOfferV2StatementStatementIdPost(this.statementId, {
          name: this.statementGroup.get("name").value ?? "",
          price: getNumericVal(this.statementGroup.get("price")),
          subPercent: getNumericVal(this.statementGroup.get("subPercent")),
          priceSubtraction: getNumericVal(this.statementGroup.get("priceSubtraction")),
          content: this.statementGroup.controls.content.controls.map(mapStatementEntryToInput)
        }).pipe(take(1)).subscribe({
          next: (data) => {
            this.offer = {
              ...data.offer,
              content: data.offerContent
            };
            this.loadingSubject.next(false);
            this.statementGroup = mapStatementGroup(data);
            this.hasChanged = false;
            this.statementGroup.valueChanges.subscribe(() => {
              this.statementGroupValidator();
            });
            if (callback) {
              callback(true);
            }
          },
          error: (error) => {
            this.loadingSubject.next(false);
            this.snackBar.open("Etwas ist schief gelaufen: " + error, "Ok", { duration: 8000 });
          }
        });
      } else {
        const offerId = getNumericVal(this.statementGroup.get("offerId"));
        if (offerId !== -1) {
          this.offerService.createOfferStatementOfferV2StatementPut({
            offerId,
            name: this.statementGroup.get("name").value ?? ""
          }).pipe(take(1)).subscribe({
            next: (data) => {
              this.offer = {
                ...data.offer,
                content: data.offerContent
              };
              this.loadingSubject.next(false);
              this.statementGroup = mapStatementGroup(data);
              this.statementId = data.id;
              this.hasChanged = false;
              this.statementGroup.valueChanges.subscribe(() => {
                this.statementGroupValidator();
              });
            },
            error: error => {
              this.loadingSubject.next(false);
              this.snackBar.open("Etwas ist schief gelaufen: " + error, "Ok", { duration: 8000 });
            }
          });
        }
      }
    }
  }

  onChangePrice() {
    console.log(this.statementGroup.controls.priceSubtraction.value);
  }

  onDelete() {
    if (this.statementId) {
      confirmDeleteDialog(this.statementId,
        this.dialog,
        "Aufstellung",
        (id) => this.offerService.deleteOfferStatementOfferV2StatementStatementIdDelete(id),
        () => {
          this.loadingSubject.next(false);
          this.location.back();
        },
        this.snackBar);
    }
  }

  protected openPreview() {
    if (this.offer && this.statementId) {
      const generate = (success: boolean) => {
        if (success) {
          this.api.readParametersParameterGet(0, 1000).pipe(take(1)).subscribe(parameters => {
            const dialogRef = this.dialog.open(OfferV2PreviewDialogComponent, {
              width: "1100px",
              data: {
                offer: this.offer,
                statement: {
                  id: this.statementId,
                  content: this.statementGroup.controls.content.controls.map(mapStatementEntryToInput)
                },
                parameters
              }
            });
            dialogRef.afterClosed().subscribe(() => {
              // nothing
            });
          });
        }
      };
      if (this.hasChanged) {
        this.onSave(generate);
      } else {
        generate(true);
      }
    }
  }

  protected readonly getNumericVal = getNumericVal;
  protected readonly formatCurrency = formatCurrency;
}
