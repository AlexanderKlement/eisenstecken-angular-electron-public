import { Component, inject, OnInit } from "@angular/core";
import OfferContainerComponent from "../offer-container/offer-container.component";
import { AsyncPipe, formatCurrency } from "@angular/common";
import {
  DefaultFlexDirective,
  DefaultLayoutAlignDirective,
  DefaultLayoutDirective,
  DefaultLayoutGapDirective,
  FlexLayoutModule
} from "ng-flex-layout";
import { MatButton, MatIconButton } from "@angular/material/button";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { ActivatedRoute, Router } from "@angular/router";
import {
  DefaultService,
  JobSmall,
  OfferElementListElement,
  OfferElementType,
  OfferLibrary,
  OfferTemplate,
  OfferTemplateEntryInput,
  OfferV2,
  OfferV2Service,
  OfferV2Version,
  OfferV2WithVersion,
  Parameter
} from "../../../api/openapi";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import { BehaviorSubject, concat, Observable, of, Subject } from "rxjs";
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { catchError, distinctUntilChanged, map, switchMap, take, tap } from "rxjs/operators";
import { confirmDeleteDialog, randomUUID } from "../offer.util";
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
import { createOffertext } from "../offer-offertext-utils";
import { MatTab, MatTabGroup } from "@angular/material/tabs";
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from "@angular/material/datepicker";
import { MatOption, MatSelect } from "@angular/material/select";
import { Vat } from "../../model/vat";
import { getNumericVal, selectRequires } from "../../shared/custom-validators";
import { ConfirmDialogComponent } from "../../shared/components/confirm-dialog/confirm-dialog.component";
import { autofillInheritance, evaluateOfferInheritance } from "../offer-inheritance-util";
import {
  TemplateCreateDialogComponent
} from "../templates/template-create-dialog/template-create-dialog/template-create-dialog.component";
import { newOfferEntryFieldGroupFormField } from "./offer-v2-entry-edit/entry-field-edit/entry-field-edit.component";
import OfferV2PreviewDialogComponent from "./offer-v2-preview-dialog/offer-v2-preview-dialog.component";
import { CdkTextareaAutosize } from "@angular/cdk/text-field";

type OfferV2Group = {
  id: FormControl<number>;
  name: FormControl<string>;
  globalAddPercent: FormControl<number>;
  globalPriceDiff: FormControl<number>;
  globalSubPercent: FormControl<number>;
  jobId: FormControl<number>;
  content: FormArray<FormGroup<OfferEntryGroup>>;
  date: FormControl<string>;
  inPriceIncluded: FormControl<string>;
  materialDescription: FormControl<string>;
  materialDescriptionTitle: FormControl<string>;
  number: FormControl<number>;
  hoursSconto: FormControl<number>;
  hourlyRate: FormControl<number>;
  payment: FormControl<string>;
  validity: FormControl<string>;
  delivery: FormControl<string>;
  vatId: FormControl<number>;
  vatName: FormControl<string>;
}

function newEmptyOfferGroup() {
  return new FormGroup<OfferV2Group>({
    name: new FormControl("", [Validators.minLength(3), Validators.required]),
    globalAddPercent: new FormControl(0),
    globalSubPercent: new FormControl(0),
    globalPriceDiff: new FormControl(0),
    hourlyRate: new FormControl(0),
    hoursSconto: new FormControl(0),
    jobId: new FormControl(-1, selectRequires),
    content: new FormArray([]),
    date: new FormControl(""),
    number: new FormControl(1, [Validators.required, Validators.pattern(/^[0-9]+$/)]),
    inPriceIncluded: new FormControl(""),
    materialDescription: new FormControl(""),
    materialDescriptionTitle: new FormControl(""),
    payment: new FormControl(""),
    validity: new FormControl(""),
    delivery: new FormControl(""),
    vatId: new FormControl(-1),
    vatName: new FormControl("Bitte wählen"),
    id: new FormControl(-1)
  });
}

function newOfferGroup(data: OfferV2, version?: OfferV2Version) {
  return new FormGroup<OfferV2Group>({
    id: new FormControl(data.id),
    name: new FormControl(data.name, [Validators.minLength(3), Validators.required]),
    globalPriceDiff: new FormControl(data.globalPriceDiff),
    globalSubPercent: new FormControl(data.globalSubPercent),
    globalAddPercent: new FormControl(data.globalAddPercent),
    hoursSconto: new FormControl(data.hoursSconto),
    hourlyRate: new FormControl(data.hourlyRate),
    jobId: new FormControl(data.job.id, selectRequires),
    content: new FormArray(version ? version.content.map(c => mapEntryOfferEntryGroup(c, 0, data.globalAddPercent)) : []),
    validity: new FormControl(data.validity),
    inPriceIncluded: new FormControl(data.inPriceIncluded),
    materialDescriptionTitle: new FormControl(data.materialDescriptionTitle),
    materialDescription: new FormControl(data.materialDescription),
    payment: new FormControl(data.payment),
    delivery: new FormControl(data.delivery),
    date: new FormControl(data.date),
    number: new FormControl(data.number),
    vatId: new FormControl(data.vat?.id ?? -1),
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
    const lastPrefix = `${prefix}${arr.controls.length + 1}`;
    if (lastPrefix === insertedPrefix) {
      arr.push(toInsert);
      arr.markAsDirty();
      return true;
    }
    return false;
  }


  if (insetAtPrefixRecursively(group.controls.content, "", entry)) {
    removeIdRecursively(entry.get("id").value, group.controls.content, "");
  }
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
    MatOption,
    MatIconButton,
    FlexLayoutModule,
    CdkTextareaAutosize
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
  jobId: number;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  offerGroup = newEmptyOfferGroup();
  versions: OfferV2Version[] = [];
  allLibraries: OfferLibrary[] = [];
  allElementTypes: OfferElementType[] = [];
  allElements: OfferElementListElement[] = [];
  allTemplates: OfferTemplate[] = [];
  lastVersion: OfferV2Version;
  parameters: Parameter[] = [];
  selectedElements: string[] = [];
  priceAsCurrency: string = "0,00 €";
  priceAsCurrencySconted: string = "0,00 €";
  priceAsFloat: number = 0;
  priceAsCurrencyHourSconted: string = "0,00 €";
  hours: number = 0;
  jobsInput$ = new Subject<string>();
  formula: string = "";
  jobsLoading = false;
  job: JobSmall | undefined = undefined;
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
    this.api.readParametersParameterGet(0, 1000).pipe(take(1)).subscribe(parameters => {
      this.parameters = parameters;
      this.offerService.getAllOfferLibrariesWithEntriesOfferV2LibrariesEntriesGet().pipe(take(1)).subscribe((libs) => {
        this.allLibraries = libs;
        this.offerService.getOfferElementTypesOfferV2ElementTypesGet().pipe(take(1)).subscribe((elementTypes) => {
          this.allElementTypes = elementTypes;
          this.offerService.getOfferElementsOfferV2ElementsGet(0, undefined, 1000).pipe(take(1)).subscribe((elements) => {
            this.allElements = elements;
            this.offerService.getOfferTemplatesOfferV2TemplatesGet(0, undefined, 1000).pipe(take(1)).subscribe((templates) => {
              this.allTemplates = templates;
              this.route.params.subscribe((params) => {
                try {

                  this.offerV2Id = parseInt(params.id, 10);
                } catch {
                  // is createMode
                }
                try {
                  this.jobId = parseInt(params.job_id, 10);
                } catch {
                  // no JobID emitted
                }
                this.initData(params.method);
              });
            });
          });
        });
      });

    });

  }

  initData(method?: string) {
    if (this.offerV2Id) {
      this.offerService.getOfferV2OfferV2OfferOfferIdGet(this.offerV2Id).pipe(take(1)).subscribe(
        {
          next: data => {
            this.job = data.job;
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
      if (this.jobId) {
        this.jobs$ = this.api.readJobJobJobIdGet(this.jobId).pipe(
          tap(() => this.offerGroup.patchValue({
            jobId: this.jobId
          })), map(j => {
            this.job = {
              name: j.name,
              description: j.description,
              type: j.type,
              id: j.id,
              client: j.client,
              code: j.code,
              is_main: j.is_main,
              is_mini: j.is_mini,
              is_sub: j.is_sub,
              lock: j.lock,
              year: j.year,
              displayable_name: j.displayable_name,
              responsible: j.responsible
            };
            return [j];
          }));

      }
      this.offerGroup.valueChanges.subscribe(() => {
        this.offerGroupValidator();
        this.unsavedChanges = true;
      });
    }
  }

  patchGroupGlobalAdd(globalAdd: number, group: FormGroup<OfferEntryGroup>) {
    const grpGlobal = getNumericVal(group.get("globalAddPercent"));
    const grpAdd = getNumericVal(group.get("priceAddPercent"));
    if (grpAdd === grpGlobal) {
      group.patchValue({ priceAddPercent: globalAdd, globalAddPercent: globalAdd });
    } else {
      group.patchValue({ globalAddPercent: globalAdd });
    }
    group.controls.children.controls.forEach(grp => this.patchGroupGlobalAdd(globalAdd, grp));
  }

  changeGlobalAdd() {
    const globalAdd = getNumericVal(this.offerGroup.get("globalAddPercent"));
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
      formulaCalculated = `(${formulaCalculated}) ${addAmount > 0 ? "+" : "-"} ${formatCurrency(addAmount, "de-DE", "€")}`;
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
      evaluateOfferInheritance(this.offerGroup.controls.content, []);
      if (this.job) {
        const lang = this.job.client.language.code.toLowerCase();
        let validity = this.offerGroup.get("validity").value;
        if (validity === "") {
          validity = this.parameters.find(par => par.key === `offer_validity_${lang}`)?.value ?? validity;
        }
        let inPriceIncluded = this.offerGroup.get("inPriceIncluded").value;
        if (inPriceIncluded === "") {
          inPriceIncluded = this.parameters.find(par => par.key === `offer_in_price_included_${lang}`)?.value ?? inPriceIncluded;
        }
        let delivery = this.offerGroup.get("delivery").value;
        if (delivery === "") {
          delivery = this.parameters.find(par => par.key === `offer_delivery_${lang}`)?.value ?? delivery;
        }
        let payment = this.offerGroup.get("payment").value;
        if (payment === "") {
          payment = this.parameters.find(par => par.key === `offer_payment_${lang}`)?.value ?? payment;
        }
        this.offerGroup.patchValue({
          payment,
          delivery,
          inPriceIncluded,
          validity
        }, { emitEvent: false });
      }
      let priceCalculated = 0;
      let sums: string[] = [];
      for (let i = 0; i < this.offerGroup.controls.content.length; i++) {
        let entry = this.offerGroup.controls.content.at(i);
        const grpPrice = entry.get("priceCalculated").value;
        const grpAlternative = entry.get("alternative").value;
        if (!grpAlternative) {
          priceCalculated += grpPrice;
        }
        sums.push(`${grpPrice.toFixed(2)}(${entry.get("name").value})`);
        if (!entry.controls.offertextChanged.value) {
          entry.controls.children.controls.forEach(child => {
            if (!child.controls.offertextChanged.value) {
              const txt = createOffertext(child);
              child.patchValue({ offertextEvaluated: txt.join("\n") }, { emitEvent: false });
            }
          });
          const txt = createOffertext(entry);
          entry.patchValue({ offertextEvaluated: txt.join("\n") }, { emitEvent: false });
        }
      }
      this.priceAsCurrency = formatCurrency(priceCalculated, "de-DE", "€");
      const hoursSconto = priceCalculated * (getNumericVal(this.offerGroup.get("hoursSconto")) / 100);
      const hourlySconted = priceCalculated - hoursSconto;
      this.priceAsCurrencyHourSconted = formatCurrency(hourlySconted, "de-DE", "€");
      const hourlyRate = getNumericVal(this.offerGroup.get("hourlyRate"));
      if (hourlyRate !== 0 && !Number.isNaN(hourlyRate)) {
        this.hours = hourlySconted / hourlyRate;
      } else {
        this.hours = 0;
      }
      const { price, formula } = this.applySconto(priceCalculated, sums.join(" + "));
      this.priceAsFloat = price;
      this.priceAsCurrencySconted = formatCurrency(price, "de-DE", "€");
      this.formula = formula;
    }
  }

  onDelete() {
    if (this.offerV2Id) {
      confirmDeleteDialog(this.offerV2Id,
        this.dialog,
        "Angebot",
        (id) => this.offerService.deleteOfferV2OfferV2OfferOfferIdDelete(id),
        () => {
          this.loadingSubject.next(false);
          this.router.navigateByUrl("/offer_v2").then();
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
      const vatId = this.offerGroup.get("vatId").value;
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.offerService.patchOfferV2OfferV2OfferOfferIdPost(this.offerV2Id, true, {
        name: this.offerGroup.get("name").value,

        globalAddPercent: getNumericVal(this.offerGroup.get("globalAddPercent")),
        globalPriceDiff: getNumericVal(this.offerGroup.get("globalPriceDiff")),
        globalSubPercent: getNumericVal(this.offerGroup.get("globalSubPercent")),
        hoursSconto: getNumericVal(this.offerGroup.get("hoursSconto")),
        hourlyRate: getNumericVal(this.offerGroup.get("hourlyRate")),
        content: this.offerGroup.controls.content.controls.map(e => mapOfferEntryToInput(e, 0)).filter(inp => !!inp),
        versionName: this.isCustomVersion ? `Wiederherstellung - ${this.lastVersion.name}` : `Speicherung - ${dayjs().format("DD.MM.YYYY HH:mm")}`,
        delivery: this.offerGroup.get("delivery").value,
        inPriceIncluded: this.offerGroup.get("inPriceIncluded").value,
        materialDescription: this.offerGroup.get("materialDescription").value,
        materialDescriptionTitle: this.offerGroup.get("materialDescriptionTitle").value,
        number: getNumericVal(this.offerGroup.get("number")),
        payment: this.offerGroup.get("payment").value,
        validity: this.offerGroup.get("validity").value,
        vatId,
        date: this.offerGroup.get("date").value,
        price: this.priceAsFloat
      }).pipe(take(1)).subscribe({
        next: (data) => {

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
          this.subTitle = "Angebot bearbeiten";
          this.isCustomVersion = false;
          this.unsavedChanges = false;
          this.lastSave = new Date();
          this.loadingSubject.next(false);
          this.timeout = setTimeout(this.autosave.bind(this), 10000);
        },
        error: (error) => {
          this.loadingSubject.next(false);
          this.snackBar.open("Etwas ist schief gelaufen: " + error, "Ok", { duration: 8000 });
        }
      });
    } else {
      const jobId = this.offerGroup.get("jobId").value;
      if (jobId === -1) {
        this.snackBar.open("Bitte einen Auftrag auswählen: ", "Ok", { duration: 8000 });
        this.loadingSubject.next(false);
        return;
      }
      this.offerService.createOfferV2OfferV2OfferPut({
        name: this.offerGroup.get("name").value,
        number: this.offerGroup.get("number").value,
        jobId
      }).pipe(take(1)).subscribe({
        next: (offer) => {
          this.loadingSubject.next(false);
          this.offerV2Id = offer.id;
          this.jobId = offer.job.id;
          this.job = offer.job;
          this.versions = [];
          this.lastVersion = undefined;
          this.offerGroup = newOfferGroup(offer);
          this.timeout = setTimeout(this.autosave.bind(this), 10000);
          this.unsavedChanges = false;
        },
        error: error => {
          this.loadingSubject.next(false);
          this.snackBar.open("Etwas ist schief gelaufen: " + error, "Ok", { duration: 8000 });
        }
      });
    }
  }

  onAddTemplateContentRecursive(index: number, parentArray: FormArray<FormGroup<OfferEntryGroup>>, entry: OfferTemplateEntryInput, depth: number) {
    const newGrp = newEmptyOfferEntryGroup(getNumericVal(this.offerGroup.get("globalAddPercent")), depth);
    this.offerService.getOfferElementOfferV2ElementElementIdGet(entry.elementId).pipe(take(1)).subscribe((elem) => {
      newGrp.patchValue({
        elementId: entry.elementId,
        elementType: entry.elementType,
        price: elem.elementType.price,
        offertext: elem.elementType.offertext,
        name: entry.name
      }, { emitEvent: false });
      elem.fields.forEach(field => {
        newGrp.controls.fields.push(newOfferEntryFieldGroupFormField(field));
      });
      autofillInheritance(newGrp, depth);
      entry.children.forEach((child, index) => {
        this.onAddTemplateContentRecursive(index, newGrp.controls.children, child, depth + 1);
      });
      parentArray.insert(index + 1, newGrp);
    });
  }

  onAddContent(index = -1, template?: OfferTemplateEntryInput) {
    if (template) {
      this.onAddTemplateContentRecursive(index + 1, this.offerGroup.controls.content, template, 0);
    } else {
      this.offerGroup.controls.content.insert(index + 1, newEmptyOfferEntryGroup(getNumericVal(this.offerGroup.get("globalAddPercent")), 0));
    }
  }

  onCopyContent(index: number) {
    this.offerGroup.controls.content.insert(index + 1, mapEntryOfferEntryGroup(mapOfferEntryToInput(this.offerGroup.controls.content.at(index), 0), 0, getNumericVal(this.offerGroup.get("globalAddPercent")), true));
  }

  onDeleteContent(index: number) {
    const child = this.offerGroup.controls.content.at(index);
    if (child.controls.children.length !== 0) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: "400px",
        data: {
          title: `Element löschen?`,
          text: `Wenn du '${child.get("description").value}' löschst, werden auch alle Kinder dieses Elements gelöscht`
        }
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.offerGroup.controls.content.removeAt(index);
        }
      });
    } else {
      this.offerGroup.controls.content.removeAt(index);
    }
  }

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
      const vatId = this.offerGroup.get("vatId").value;
      this.savingSubject.next(true);
      this.offerService.patchOfferV2OfferV2OfferOfferIdPost(this.offerV2Id, false, {
        name: this.offerGroup.get("name").value,
        globalAddPercent: getNumericVal(this.offerGroup.get("globalAddPercent")),
        globalPriceDiff: getNumericVal(this.offerGroup.get("globalPriceDiff")),
        globalSubPercent: getNumericVal(this.offerGroup.get("globalSubPercent")),
        hoursSconto: getNumericVal(this.offerGroup.get("hoursSconto")),
        hourlyRate: getNumericVal(this.offerGroup.get("hourlyRate")),
        content: this.offerGroup.controls.content.controls.map(e => mapOfferEntryToInput(e, 0)).filter(inp => !!inp),
        versionName: this.lastVersion?.name ?? `Speicherung - ${dayjs().format("DD.MM.YYYY HH:mm")}`,
        delivery: this.offerGroup.get("delivery").value,
        inPriceIncluded: this.offerGroup.get("inPriceIncluded").value,
        materialDescription: this.offerGroup.get("materialDescription").value,
        materialDescriptionTitle: this.offerGroup.get("materialDescriptionTitle").value,
        number: getNumericVal(this.offerGroup.get("number")),
        payment: this.offerGroup.get("payment").value,
        validity: this.offerGroup.get("validity").value,
        vatId,
        date: this.offerGroup.get("date").value,
        price: this.priceAsFloat
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
    this.offerGroup.controls.content = new FormArray(version.content.map((c) => mapEntryOfferEntryGroup(c, 0, getNumericVal(this.offerGroup.get("globalAddPercent")))));
  }

  protected onBackToOriginal() {
    this.lastVersion = this.versions.length !== 0 ? [...this.versions].sort((a, b) => {
      return (new Date(b.timestamp)).getTime() - (new Date(a.timestamp)).getTime();
    })[0] : undefined;
    this.timeout = setTimeout(this.autosave.bind(this), 10000);
    this.offerGroup.controls.content = new FormArray(this.lastVersion.content.map(c => mapEntryOfferEntryGroup(c, 0, getNumericVal(this.offerGroup.get("globalAddPercent")))));
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

  draggedObject: FormGroup<OfferEntryGroup> | null = null;
  insertedPrefix: string | null = null;

  dragStart(e: FormGroup<OfferEntryGroup> | null) {
    if (!e && this.draggedObject && this.insertedPrefix) {
      moveObjectInGroup(this.offerGroup, this.draggedObject, this.insertedPrefix);
    }
    this.draggedObject = e;
  }

  protected elementInserted(prefix: string) {
    this.insertedPrefix = prefix;
  }

  protected elementUninserted() {
    this.insertedPrefix = null;
  }

  protected onSelectElem(id: string) {
    if (this.selectedElements.includes(id)) {
      this.selectedElements = this.selectedElements.filter(i => i !== id);
    } else {
      this.selectedElements.push(id);
    }
  }

  protected onUnselectAll() {
    this.selectedElements = [];
  }

  protected onCreateTemplate() {
    function findGrpRecursive(id: string, arr: FormArray<FormGroup<OfferEntryGroup>>): null | FormGroup<OfferEntryGroup> {
      for (let i = 0; i < arr.controls.length; i++) {
        const child = arr.at(i);
        if (child.get("id").value == id) {
          return child;
        } else {
          let grp = findGrpRecursive(id, child.controls.children);
          if (grp) {
            return grp;
          }
        }
      }
      return null;
    }

    const rootGrps: (FormGroup<OfferEntryGroup> | null)[] = [];
    this.selectedElements.forEach(id => {
      rootGrps.push(findGrpRecursive(id, this.offerGroup.controls.content));
    });

    function convertRecursive(arr: (FormGroup<OfferEntryGroup> | null)[]): OfferTemplateEntryInput[] {
      return arr.map<OfferTemplateEntryInput>(grp => {
        if (!grp)
          return null;
        const element = grp.get("elementId").value;
        if (element === -1) {
          return null;
        }
        return {
          name: grp.get("name").value,
          id: randomUUID(),
          elementType: grp.get("elementType").value,
          elementId: element,
          children: convertRecursive(grp.controls.children.controls).filter(elem => !!elem)
        };
      });
    }

    const structure = convertRecursive(rootGrps);
    const dialogRef = this.dialog.open(TemplateCreateDialogComponent, {
      width: "1000px",
      data: { structure }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.router.navigateByUrl("/offer_v2/templates").then();
      }
    });
  }

  protected openPreview() {
    if (this.job) {
      this.vats$.pipe(take(1)).subscribe(vats => {
        const vatId = this.offerGroup.get("vatId").value;
        const vat = vats.find(v => v.id === vatId) ?? vats[0];
        const offer: OfferV2WithVersion = {
          name: this.offerGroup.get("name").value,
          date: this.offerGroup.get("date").value,
          number: this.offerGroup.get("number").value,
          delivery: this.offerGroup.get("delivery").value,
          inPriceIncluded: this.offerGroup.get("inPriceIncluded").value,
          materialDescription: this.offerGroup.get("materialDescription").value,
          materialDescriptionTitle: this.offerGroup.get("materialDescriptionTitle").value,
          validity: this.offerGroup.get("validity").value,
          payment: this.offerGroup.get("payment").value,
          lastChanged: new Date().toISOString(),
          globalAddPercent: getNumericVal(this.offerGroup.get("globalAddPercent")),
          globalPriceDiff: getNumericVal(this.offerGroup.get("globalPriceDiff")),
          globalSubPercent: getNumericVal(this.offerGroup.get("globalSubPercent")),
          hourlyRate: 1,
          hoursSconto: 1,
          id: this.offerGroup.get("id").value,
          job: this.job,
          pdf: "",
          price: -1,
          vat,
          content: this.offerGroup.controls.content.controls.map(grp => mapOfferEntryToInput(grp, 0)).filter(inp => !!inp)
        };
        const dialogRef = this.dialog.open(OfferV2PreviewDialogComponent, {
          width: "1100px",
          data: {
            offer, parameters: this.parameters
          }
        });
        dialogRef.afterClosed().subscribe(() => {
          // nothing
        });
      });
    }
  }

  protected readonly dayjs = dayjs;
  protected readonly getNumericVal = getNumericVal;
  protected readonly formatCurrency = formatCurrency;

  protected onChangeOffertext(idx: number, idx2?: number) {
    if (this.offerGroup) {
      const grp = typeof idx2 === "undefined" ? this.offerGroup.controls.content.at(idx) : this.offerGroup.controls.content.at(idx).controls.children.at(idx2);
      if (grp) {
        grp.patchValue({ offertextChanged: true }, { emitEvent: false });
      }
    }
  }

  protected resetOffertext(idx: number, idx2?: number) {
    if (this.offerGroup) {
      const grp = typeof idx2 === "undefined" ? this.offerGroup.controls.content.at(idx) : this.offerGroup.controls.content.at(idx).controls.children.at(idx2);
      if (grp) {
        const txt = createOffertext(grp);
        grp.patchValue({ offertextChanged: false, offertextEvaluated: txt.join("\n") }, { emitEvent: false });
      }
    }
  }

  protected onElementAdded(element: OfferElementListElement) {
    this.allElements.push(element);
  }
}
