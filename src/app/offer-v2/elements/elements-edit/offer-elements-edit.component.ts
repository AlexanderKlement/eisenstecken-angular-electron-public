import { Component, ElementRef, inject, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import OfferContainerComponent from "../../offer-container/offer-container.component";
import {
  OfferElementField,
  OfferElementType,
  OfferField,
  OfferFieldEnum,
  OfferLibraryListElement,
  OfferV2Service,
  SchemasOfferV2OfferElementFieldSchemaOfferElementCreatePatch
} from "../../../../api/openapi";
import { take } from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  DefaultFlexDirective,
  DefaultLayoutAlignDirective,
  DefaultLayoutDirective,
  DefaultLayoutGapDirective,
  FlexLayoutModule
} from "ng-flex-layout";
import { MatFormField, MatInput, MatLabel } from "@angular/material/input";
import { MatButton } from "@angular/material/button";
import OfferFieldsComponent from "../../fields/offer-fields.component";
import {
  OfferFieldElementTypePillComponent
} from "../../offer-field-element-type-pill/offer-field-element-type-pill.component";
import { MatDialog } from "@angular/material/dialog";
import { AsyncPipe } from "@angular/common";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { BehaviorSubject, Observable } from "rxjs";
import { confirmDeleteDialog, fieldTypeToString } from "../../offer.util";
import { MatOption, MatSelect } from "@angular/material/select";
import { createConsolaReporter } from "@sentry/angular";
import { MatCheckbox } from "@angular/material/checkbox";
import OfferCalculationInputComponent from "../../calculation-input/offer-calculation-input.component";
import { MatRadioButton, MatRadioGroup } from "@angular/material/radio";
import { selectRequires } from "../../../shared/custom-validators";

type ElementFieldGroup = {
  value: FormControl<string>,
  id: FormControl<number>,
  fieldId: FormControl<number>,
  label: FormControl<string>,
  fieldType: FormControl<OfferFieldEnum>,
  useManualList: FormControl<boolean>,
  manualList: FormArray<FormControl<string>>,
  unit: FormControl<string>,
  inherits: FormControl<boolean>,
  mandatory: FormControl<boolean>,
  library: FormControl<number>,
}

type ElementGroup = {
  name: FormControl<string>;
  elementType: FormControl<number>;
  fields: FormArray<FormGroup<ElementFieldGroup>>
}

@Component({
  selector: "app-offer-elemens-edit",
  templateUrl: "./offer-elements-edit.component.html",
  styleUrls: ["./offer-elements-edit.component.scss"],
  imports: [
    ReactiveFormsModule,
    OfferContainerComponent,
    DefaultFlexDirective,
    DefaultLayoutAlignDirective,
    DefaultLayoutDirective,
    DefaultLayoutGapDirective,
    MatFormField,
    MatInput,
    MatLabel,
    MatButton,
    AsyncPipe,
    MatProgressSpinner,
    MatSelect,
    MatOption,
    FlexLayoutModule,
    MatCheckbox,
    OfferCalculationInputComponent,
    MatRadioGroup,
    MatRadioButton
  ]
})
export default class OfferElementsEditComponent implements OnInit {

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private offerService = inject(OfferV2Service);
  subTitle = "Element erstellen";
  elementId: number;
  private snackBar = inject(MatSnackBar);
  elementGroup: FormGroup<ElementGroup> = new FormGroup({
    name: new FormControl(""),
    elementType: new FormControl(-1),
    fields: new FormArray([])
  });
  elementTypes$: Observable<OfferElementType[]>;
  libraries$: Observable<OfferLibraryListElement[]>;
  selectedFields: OfferElementField[] = [];
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  @ViewChild("search") searchInput: ElementRef<HTMLInputElement>;
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      try {
        this.elementId = parseInt(params.id, 10);
      } catch {
        // is createMode
      }
      this.initData(params.method);
    });
    this.elementTypes$ = this.offerService.getOfferElementTypesOfferV2ElementTypesGet();
    this.libraries$ = this.offerService.getOfferLibrariesOfferV2LibrariesGet();
  }

  initData(method?: string) {
    if (this.elementId) {
      this.offerService.getOfferElementOfferV2ElementElementIdGet(this.elementId).pipe(take(1)).subscribe(
        {
          next: data => {
            this.elementGroup = new FormGroup({
              name: new FormControl(data.name),
              elementType: new FormControl(data.elementType.id),
              fields: new FormArray(data.fields.map(field => new FormGroup<ElementFieldGroup>({
                value: new FormControl(field.defaultValue),
                mandatory: new FormControl(field.mandatory),
                inherits: new FormControl(field.inherits),
                fieldId: new FormControl(field.field.id),
                label: new FormControl(field.field.label),
                useManualList: new FormControl(field.library?.name?.startsWith(`Manuelle Liste: ${data.name}`) ?? false),
                manualList: new FormArray(field.library?.name?.startsWith(`Manuelle Liste: ${data.name}`) ? field.library.entries.map<FormControl<string>>(entry => new FormControl(entry.name)) : []),
                unit: new FormControl(field.field.unit?.short ?? ""),
                fieldType: new FormControl(field.field.fieldType),
                id: new FormControl(field.id),
                library: new FormControl(field.library?.id ?? -1, field.field.fieldType === OfferFieldEnum.Select ? selectRequires : null)
              })))
            });
            this.selectedFields = data.fields;
          },
          error: error => {
            this.snackBar.open("Der Element konnte nicht gefunden werden: " + error, "Ok", { duration: 8000 });
            this.elementId = undefined;
            this.initData();
          }
        }
      );
      this.subTitle = "Element bearbeiten";
      if (method === "copy") {
        this.elementId = undefined;
        this.subTitle = "Element erstellen";
      } else if (method === "delete") {
        this.onDelete();
      }
    } else {
      this.subTitle = "Element erstellen";
    }
  }

  onDelete() {
    if (this.elementId) {
      this.loadingSubject.next(true);
      confirmDeleteDialog(this.elementId, this.dialog, "Element", this.offerService.deleteOfferElementOfferV2ElementElementIdDelete,
        {
          loadData: this.subscription.next
        }, this.snackBar);
    }
  }

  onSave() {
    this.loadingSubject.next(true);
    let missingLibrary = false;
    const fields = this.elementGroup.controls.fields.controls.map<SchemasOfferV2OfferElementFieldSchemaOfferElementCreatePatch>(grp => {
      const library = grp.get("library").value;
      if (grp.get("fieldType").value === OfferFieldEnum.Select && library === -1) {
        missingLibrary = true;
      }
      return {
        defaultValue: grp.get("value").value ?? "",
        fieldId: grp.get("fieldId").value,
        inherits: grp.get("inherits").value ?? false,
        mandatory: grp.get("mandatory").value ?? false,
        libraryId: library === -1 ? undefined : library
      };
    });
    if (missingLibrary) {
      this.snackBar.open("Eine Bibliothek muss ausgewählt werden für Auswahl Felder: ", "Ok", { duration: 8000 });
      this.loadingSubject.next(false);
      return;
    }
    if (!this.elementGroup.valid) {
      this.snackBar.open("Bitte alle Felder kontrollieren: ", "Ok", { duration: 8000 });
      this.loadingSubject.next(false);
      return;
    }
    if (this.elementId) {
      this.offerService.patchOfferElementOfferV2ElementElementIdPost(this.elementId, {
        name: this.elementGroup.get("name").value,
        elementTypeId: this.elementGroup.get("elementType").value,
        fields
      }).pipe(take(1)).subscribe(this.subscription);
    } else {
      this.offerService.createOfferElementOfferV2ElementPut({
        name: this.elementGroup.get("name").value,
        elementTypeId: this.elementGroup.get("elementType").value,
        fields
      }).pipe(take(1)).subscribe(this.subscription);
    }
  }

  mapFieldsToGroup(fields: OfferField[]) {
    const curFields = this.elementGroup.controls.fields.controls;
    this.elementGroup.controls.fields.clear();
    fields.forEach(f => {
      const curField = curFields.find(grp => grp.get("fieldId")?.value === f.id);
      if (curField)
        this.elementGroup.controls.fields.push(curField);
      else
        this.elementGroup.controls.fields.push(new FormGroup<ElementFieldGroup>({
          mandatory: new FormControl(false),
          fieldId: new FormControl(f.id),
          id: new FormControl(-1),
          inherits: new FormControl(false),
          value: new FormControl(f.fieldType === OfferFieldEnum.Calculation ? f.calculation : f.fieldType === OfferFieldEnum.Offertext ? f.calculation : ""),
          library: new FormControl(-1, f.fieldType === OfferFieldEnum.Select ? selectRequires : null),
          label: new FormControl(f.label),
          unit: new FormControl(f.unit?.short ?? ""),
          fieldType: new FormControl(f.fieldType),
          useManualList: new FormControl(false),
          manualList: new FormArray([])
        }));
    });
  }

  setDefaultVal(idx: number, value: string) {
    this.elementGroup.controls.fields.at(idx).patchValue({ value });
  }

  onChangeType() {
    const id = this.elementGroup.get("elementType").value;
    if (id !== -1) {
      this.offerService.getOfferElementTypeOfferV2ElementTypeElementTypeIdGet(id).pipe(take(1)).subscribe({
        next: data => {
          this.mapFieldsToGroup(data.fields);
        }
      });
    }
  }

  subscription = {
    next: () => {
      this.loadingSubject.next(false);
      this.router.navigateByUrl("/offer_v2/elements").then();
    },
    error: (error: any) => {
      this.loadingSubject.next(false);
      this.snackBar.open("Etwas ist schief gelaufen: " + error, "Ok", { duration: 8000 });
    }
  };

  onNavElementType() {
    const id = this.elementGroup.get("elementType").value;
    if (id !== -1) {
      this.router.navigateByUrl(`/offer_v2/element_types/${id}`).then();
    }
  }

  protected readonly OfferFieldsComponent = OfferFieldsComponent;
  protected readonly OfferFieldEnum = OfferFieldEnum;

  protected readonly OfferFieldTypePillComponent = OfferFieldElementTypePillComponent;

  protected readonly fieldTypeToString = fieldTypeToString;
  protected readonly createConsolaReporter = createConsolaReporter;
}
