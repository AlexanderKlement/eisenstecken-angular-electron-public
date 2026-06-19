import { Component, inject, OnInit } from "@angular/core";
import OfferContainerComponent from "../offer-container/offer-container.component";
import { AsyncPipe, formatCurrency } from "@angular/common";
import {
  DefaultFlexDirective,
  DefaultLayoutAlignDirective,
  DefaultLayoutDirective,
  DefaultLayoutGapDirective
} from "ng-flex-layout";
import { MatButton } from "@angular/material/button";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { ActivatedRoute, Router } from "@angular/router";
import {
  DefaultService,
  OfferElementListElement,
  OfferElementType,
  OfferLibrary,
  OfferV2,
  OfferV2Service,
  OfferV2Version
} from "../../../api/openapi";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import { BehaviorSubject, concat, Observable, of, Subject } from "rxjs";
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { catchError, distinctUntilChanged, switchMap, take, tap } from "rxjs/operators";
import { confirmDeleteDialog } from "../offer.util";
import dayjs from "dayjs/esm";
import { SharedModule } from "../../shared/shared.module";
import { MatFormField, MatInput, MatLabel, MatSuffix } from "@angular/material/input";
import { MtxSelect } from "@ng-matero/extensions/select";
import {
  mapEntryOfferEntryGroup,
  mapOfferEntryToInput,
  newEmptyOfferEntryGroup,
  OfferEntryGroup,
  OfferV2EntryEditComponent
} from "./offer-v2-entry-edit/offer-v2-entry-edit.component";
import { ListElementComponent } from "../../shared/components/list-element/list-element.component";
import { MatIcon } from "@angular/material/icon";
import { Offertext, offertextEvaluationElementGroup } from "../offer-offertext-utils";
import { MatTab, MatTabGroup } from "@angular/material/tabs";
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from "@angular/material/datepicker";
import { MatOption, MatSelect } from "@angular/material/select";
import { Vat } from "../../model/vat";
import { selectRequires } from "../../shared/custom-validators";
import { ConfirmDialogComponent } from "../../shared/components/confirm-dialog/confirm-dialog.component";

type OfferV2Group = {
  name: FormControl<string>;
  globalAddPercent: FormControl<number>;
  globalPriceDiff: FormControl<number>;
  globalSubPercent: FormControl<number>;
  jobId: FormControl<string>;
  content: FormArray<FormGroup<OfferEntryGroup>>;
  date: FormControl<string>;
  inPriceIncluded: FormControl<string>;
  materialDescription: FormControl<string>;
  materialDescriptionTitle: FormControl<string>;
  number: FormControl<number>;
  payment: FormControl<string>;
  validity: FormControl<string>;
  delivery: FormControl<string>;
  vatId: FormControl<string>;
  vatName: FormControl<string>;
}

function newEmptyOfferGroup() {
  return new FormGroup<OfferV2Group>({
    name: new FormControl("", [Validators.minLength(3), Validators.required]),
    globalAddPercent: new FormControl(0),
    globalSubPercent: new FormControl(0),
    globalPriceDiff: new FormControl(0),
    jobId: new FormControl("-1", selectRequires),
    content: new FormArray([]),
    date: new FormControl(""),
    number: new FormControl(1, [Validators.required, Validators.pattern(/^[0-9]+$/)]),
    inPriceIncluded: new FormControl(""),
    materialDescription: new FormControl(""),
    materialDescriptionTitle: new FormControl(""),
    payment: new FormControl(""),
    validity: new FormControl(""),
    delivery: new FormControl(""),
    vatId: new FormControl("-1"),
    vatName: new FormControl("Bitte wählen")
  });
}

function newOfferGroup(data: OfferV2, version?: OfferV2Version) {
  return new FormGroup<OfferV2Group>({
    name: new FormControl(data.name, [Validators.minLength(3), Validators.required]),
    globalPriceDiff: new FormControl(data.globalPriceDiff),
    globalSubPercent: new FormControl(data.globalSubPercent),
    globalAddPercent: new FormControl(data.globalAddPercent),
    jobId: new FormControl(data.job.id.toString(10), selectRequires),
    content: new FormArray(version ? version.content.map(mapEntryOfferEntryGroup) : []),
    validity: new FormControl(data.validity),
    inPriceIncluded: new FormControl(data.inPriceIncluded),
    materialDescriptionTitle: new FormControl(data.materialDescriptionTitle),
    materialDescription: new FormControl(data.materialDescription),
    payment: new FormControl(data.payment),
    delivery: new FormControl(data.delivery),
    date: new FormControl(data.date),
    number: new FormControl(data.number),
    vatId: new FormControl(data.vat?.id?.toString(10) ?? "-1"),
    vatName: new FormControl(data.vat?.name ?? "Bitte wählen")
  });
}

function moveObjectInGroup(group: FormGroup<OfferV2Group>, entry: FormGroup<OfferEntryGroup>, insertedPrefix: string): FormGroup<OfferV2Group> {
  function removeIdRecursively(id: string, arr: FormArray<FormGroup<OfferEntryGroup>>, prefix: string): boolean {
    for (let i = 0; i < arr.controls.length; i++) {
      const innerPrefix = `${prefix}${i + 1}`;
      const child = arr.at(i);
      if (child.get("id").value == id && innerPrefix !== insertedPrefix) {
        arr.removeAt(i);
        return true;
      } else {
        if (removeIdRecursively(id, child.controls.children, `${innerPrefix}.`)) {
          return true;
        }
      }
    }
    return false;
  }

  function insetAtPrefixRecursively(arr: FormArray<FormGroup<OfferEntryGroup>>, prefix: string, toInsert: FormGroup<OfferEntryGroup>): boolean {
    if (arr.controls.length === 0) {
      if (`${prefix}1` === insertedPrefix) {
        arr.push(toInsert);
        return true;
      } else {
        return false;
      }
    }
    for (let i = 0; i < arr.controls.length; i++) {
      const innerPrefix = `${prefix}${i + 1}`;
      if (innerPrefix === insertedPrefix) {
        arr.insert(i, toInsert);
        arr.markAsDirty();
        return true;
      }
      if (insetAtPrefixRecursively(arr.at(i).controls.children, `${innerPrefix}.`, toInsert)) {
        return true;
      }
    }
    return false;
  }


  insetAtPrefixRecursively(group.controls.content, "", entry);
  removeIdRecursively(entry.get("id").value, group.controls.content, "");
  return group;
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
    MatIcon,
    MatTab,
    MatTabGroup,
    MatDatepicker,
    MatDatepickerToggle,
    MatDatepickerInput,
    MatSelect,
    MatOption
  ],
  templateUrl: "./offer-v2-edit.component.html",
  styleUrl: "./offer-v2-edit.component.scss"
})
export class OfferV2EditComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private api = inject(DefaultService);
  private offerService = inject(OfferV2Service);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  subTitle = "Angebot erstellen";
  offerV2Id: number;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  offerGroup = newEmptyOfferGroup();
  versions: OfferV2Version[] = [];
  allLibraries: OfferLibrary[] = [];
  allElementTypes: OfferElementType[] = [];
  lastVersion: OfferV2Version;
  offertext: Offertext[] = [];
  priceAsCurrency: string = "0,00 €";
  priceAsCurrencySconted: string = "0,00 €";
  jobsInput$ = new Subject<string>();
  formula: string = "";
  jobsLoading = false;
  private waitForChildren: number = 0;
  vats$: Observable<Vat[]>;
  jobs$ = concat(
    of([]), // default items
    this.jobsInput$.pipe(
      distinctUntilChanged(),
      tap(() => (this.jobsLoading = true)),
      switchMap(term =>
        this.api.readJobsJobGet(0, 20, term, null, "JOBSTATUS_ACCEPTED, JOBSTATUS_CREATED").pipe(
          catchError(() => of([])), // empty list on error
          tap(() => (this.jobsLoading = false))
        )
      )
    )
  );

  trackByFn = (item: OfferElementListElement) => item.id;

  ngOnInit(): void {
    this.vats$ = this.api.readVatsVatGet();
    this.offerService.getAllOfferLibrariesWithEntriesOfferV2LibrariesEntriesGet().pipe(take(1)).subscribe((libs) => {
      this.allLibraries = libs;
    });
    this.offerService.getOfferElementTypesOfferV2ElementTypesGet().pipe(take(1)).subscribe((elementTypes) => {
      this.allElementTypes = elementTypes;
    });
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
      this.offerService.getOfferV2OfferV2OfferOfferIdGet(this.offerV2Id).pipe(take(1)).subscribe(
        {
          next: data => {
            this.offerService.getOfferVersionsOfferV2OfferV2IdVersionsGet(data.id).pipe(take(1)).subscribe({
              next: versions => {
                this.versions = versions;
                this.lastVersion = versions.length !== 0 ? [...versions].sort((a, b) => {
                  return (new Date(b.timestamp)).getTime() - (new Date(a.timestamp)).getTime();
                })[0] : undefined;
                this.timeout = setTimeout(this.autosave.bind(this), 10000);
                this.offerGroup = newOfferGroup(data, this.lastVersion);
                this.offerGroup.valueChanges.subscribe(() => {
                  this.offerGroupValidator();
                  this.unsavedChanges = true;
                });
                if (this.offerGroup.controls.content.length !== 0) {
                  this.waitForChildren = this.offerGroup.controls.content.length;
                }
              },
              error: () => {
                this.offerGroup = newEmptyOfferGroup();
                this.offerGroup.valueChanges.subscribe(() => {
                  this.offerGroupValidator();
                  this.unsavedChanges = true;
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
      this.offerGroup.valueChanges.subscribe(() => {
        this.offerGroupValidator();
        this.unsavedChanges = true;
      });
    }
  }

  patchGroupGlobalAdd(globalAdd: number, group: FormGroup<OfferEntryGroup>) {
    const grpGlobal = group.get("globalAddPercent").value;
    const grpAdd = group.get("priceAddPercent").value;
    if (grpAdd === grpGlobal) {
      group.patchValue({ priceAddPercent: globalAdd, globalAddPercent: globalAdd });
    }
    group.controls.children.controls.forEach(grp => this.patchGroupGlobalAdd(globalAdd, grp));
  }

  changeGlobalAdd() {
    const globalAdd = this.offerGroup.get("globalAddPercent").value;
    this.offerGroup.controls.content.controls.forEach(grp => this.patchGroupGlobalAdd(globalAdd, grp));
  }

  applySconto(price: number, formula: string): { price: number, formula: string } {
    let priceCalculated = price;
    let formulaCalculated = formula;
    const sub = this.offerGroup.get("globalSubPercent").value;
    if (sub !== 0) {
      const priceSubstraction = priceCalculated * (sub / 100);
      if (priceSubstraction !== 0) {
        priceCalculated -= priceSubstraction;
        formulaCalculated = `(${formulaCalculated}) - ${sub}%`;
      }
    }
    const addAmount = parseFloat(this.offerGroup.get("globalPriceDiff").value.toString(10));
    if (addAmount !== 0 && !Number.isNaN(addAmount)) {
      priceCalculated += addAmount;
      formulaCalculated = `(${formulaCalculated}) ${addAmount > 0 ? "+" : "-"} ${formatCurrency(addAmount, "de-DE", "EUR")}`;
    }

    return { price: priceCalculated, formula: formulaCalculated };
  }

  contentEvaluated() {
    this.waitForChildren--;
    if (this.waitForChildren <= 0) {
      this.offerGroupValidator();
    }
  }

  offerGroupValidator() {
    if (this.offerGroup) {
      let priceCalculated = 0;
      let sums: string[] = [];
      let offertext: Offertext[] = [];
      for (let i = 0; i < this.offerGroup.controls.content.length; i++) {
        let entry = this.offerGroup.controls.content.at(i);
        const grpPrice = entry.get("priceCalculated").value;
        const grpAlternative = entry.get("alternative").value;
        if (!grpAlternative) {
          priceCalculated += grpPrice;
        }
        offertext.push(offertextEvaluationElementGroup(entry, 0, i + 1, 0));
        sums.push(`${grpPrice.toFixed(2)}(${entry.get("name").value})`);
      }
      const { price, formula } = this.applySconto(priceCalculated, sums.join(" + "));
      this.priceAsCurrency = formatCurrency(priceCalculated, "de-DE", "EUR");
      this.priceAsCurrencySconted = formatCurrency(price, "de-DE", "EUR");
      this.formula = formula;
      this.offertext = offertext;
    }
  }

  onDelete() {
    if (this.offerV2Id) {
      confirmDeleteDialog(this.offerV2Id,
        this.dialog,
        "Angebot",
        (id) => this.offerService.deleteOfferTemplateOfferV2TemplateTemplateIdDelete(id),
        () => {
          this.subscription.next();
        },
        this.snackBar);
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
      const vatId = parseInt(this.offerGroup.get("vatId").value, 10);
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.offerService.patchOfferV2OfferV2OfferOfferIdPost(this.offerV2Id, true, {
        name: this.offerGroup.get("name").value,
        globalAddPercent: this.offerGroup.get("globalAddPercent").value ?? 0,
        globalPriceDiff: this.offerGroup.get("globalPriceDiff").value ?? 0,
        globalSubPercent: this.offerGroup.get("globalSubPercent").value ?? 0,
        content: this.offerGroup.controls.content.controls.map(mapOfferEntryToInput),
        versionName: this.isCustomVersion ? `Wiederherstellung - ${this.lastVersion.name}` : `Speicherung - ${dayjs().format("DD.MM.YYYY HH:mm")}`,
        delivery: this.offerGroup.get("delivery").value,
        inPriceIncluded: this.offerGroup.get("inPriceIncluded").value,
        materialDescription: this.offerGroup.get("materialDescription").value,
        materialDescriptionTitle: this.offerGroup.get("materialDescriptionTitle").value,
        number: this.offerGroup.get("number").value,
        payment: this.offerGroup.get("payment").value,
        validity: this.offerGroup.get("validity").value,
        vatId,
        date: this.offerGroup.get("date").value
      }).pipe(take(1)).subscribe(this.subscription);
    } else {
      const jobId = parseInt(this.offerGroup.get("jobId").value, 10);
      if (jobId === -1) {
        this.snackBar.open("Bitte einen Auftrag auswählen: ", "Ok", { duration: 8000 });
        this.loadingSubject.next(false);
        return;
      }
      this.offerService.createOfferV2OfferV2OfferPut({
        name: this.offerGroup.get("name").value,
        number: this.offerGroup.get("number").value,
        jobId
      }).pipe(take(1)).subscribe(this.subscription);
    }
  }

  onAddContent(index = -1) {
    this.offerGroup.controls.content.insert(index + 1, newEmptyOfferEntryGroup());
  }

  onCopyContent(index: number) {
    this.offerGroup.controls.content.insert(index + 1, mapEntryOfferEntryGroup(mapOfferEntryToInput(this.offerGroup.controls.content.at(index)), this.offerGroup.get("globalAddPercent").value));
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

  timeout: NodeJS.Timeout | null = null;

  unsavedChanges: boolean = false;
  lastSave: Date | null = null;

  private savingSubject = new BehaviorSubject<boolean>(false);
  public saving$ = this.loadingSubject.asObservable();

  private autosave() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    if (this.offerGroup && this.offerGroup.valid && this.unsavedChanges && !this.isCustomVersion) {
      const vatId = parseInt(this.offerGroup.get("vatId").value, 10);
      this.savingSubject.next(true);
      this.offerService.patchOfferV2OfferV2OfferOfferIdPost(this.offerV2Id, false, {
        name: this.offerGroup.get("name").value,
        globalAddPercent: this.offerGroup.get("globalAddPercent").value ?? 0,
        globalPriceDiff: this.offerGroup.get("globalPriceDiff").value ?? 0,
        globalSubPercent: this.offerGroup.get("globalSubPercent").value ?? 0,
        content: this.offerGroup.controls.content.controls.map(mapOfferEntryToInput),
        versionName: this.lastVersion?.name ?? `Speicherung - ${dayjs().format("DD.MM.YYYY HH:mm")}`,
        delivery: this.offerGroup.get("delivery").value,
        inPriceIncluded: this.offerGroup.get("inPriceIncluded").value,
        materialDescription: this.offerGroup.get("materialDescription").value,
        materialDescriptionTitle: this.offerGroup.get("materialDescriptionTitle").value,
        number: this.offerGroup.get("number").value,
        payment: this.offerGroup.get("payment").value,
        validity: this.offerGroup.get("validity").value,
        vatId,
        date: this.offerGroup.get("date").value
      }).pipe(take(1)).subscribe({
        next: (data) => {
          if (!this.lastVersion) {
            this.offerService.getOfferVersionsOfferV2OfferV2IdVersionsGet(data.id).pipe(take(1)).subscribe({
              next: versions => {
                this.versions = versions;
                this.lastVersion = versions.length !== 0 ? [...versions].sort((a, b) => {
                  return (new Date(b.timestamp)).getTime() - (new Date(a.timestamp)).getTime();
                })[0] : undefined;
              },
              error: () => {
              }
            });
          }
          this.unsavedChanges = false;
          this.lastSave = new Date();
          this.savingSubject.next(false);
          this.timeout = setTimeout(this.autosave.bind(this), 10000);
        },
        error: () => {
          this.savingSubject.next(false);
          this.timeout = setTimeout(this.autosave.bind(this), 10000);
        }
      });
    } else {
      this.timeout = setTimeout(this.autosave.bind(this), 10000);
    }
  }

  historyDialogOpen = false;
  isCustomVersion = false;

  protected toggleHistory() {
    this.historyDialogOpen = !this.historyDialogOpen;
  }

  protected onShowHistory(version: OfferV2Version) {
    this.lastVersion = version;
    this.isCustomVersion = true;
    this.historyDialogOpen = false;
    this.subTitle = version.name;
    this.offerGroup.controls.content = new FormArray(version.content.map(mapEntryOfferEntryGroup));
  }

  protected onBackToOriginal() {
    this.lastVersion = this.versions.length !== 0 ? [...this.versions].sort((a, b) => {
      return (new Date(b.timestamp)).getTime() - (new Date(a.timestamp)).getTime();
    })[0] : undefined;
    this.timeout = setTimeout(this.autosave.bind(this), 10000);
    this.offerGroup.controls.content = new FormArray(this.lastVersion.content.map(mapEntryOfferEntryGroup));
    this.isCustomVersion = false;
    this.subTitle = "Angebot bearbeiten";
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(this.autosave.bind(this), 10000);
  }

  protected onRestoreVersion() {
    if (this.isCustomVersion) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: "400px",
        data: {
          title: "Vorherige Version wiederherstellen?",
          text: `Willst du wirklich die Version ${this.lastVersion.name} wiederherstellen?`
        }
      });
      dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          this.onSave();
        }
      });
    }
  }

  addIndex: number = Infinity;
  draggedObject: Node | null = null;
  insertedPrefix: string | null = null;

  dragStart(e: Node | null) {

    this.draggedObject = e;
  }

  protected contentDroppedBefore(index: number) {
    this.addIndex = index;
  }

  protected contentUndroppedAddedBefore() {
    this.addIndex = Infinity;
  }


  protected elementDropped(entry: FormGroup<OfferEntryGroup>) {
    if (this.insertedPrefix) {
      moveObjectInGroup(this.offerGroup, entry, this.insertedPrefix);
    }
  }

  protected elementInserted(prefix: string) {
    this.insertedPrefix = prefix;
  }

  protected elementUninserted() {
    this.insertedPrefix = null;
  }

  protected readonly dayjs = dayjs;
}
