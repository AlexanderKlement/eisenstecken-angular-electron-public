import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { OfferElementField, OfferFieldEnum, OfferLibrary, OfferV2EntryField } from "../../../../../api/openapi";
import { MatFormField, MatInput, MatLabel, MatSuffix } from "@angular/material/input";
import { MatIcon } from "@angular/material/icon";
import { CdkTextareaAutosize } from "@angular/cdk/text-field";
import OfferLibraryEntrySelectorComponent, {
  LibraryEntryDropDownItem
} from "../../../library-entry-selector/offer-library-entry-selector.component";

export declare type OfferEntryFieldGroup = {
  calculation: FormControl<string>,
  defaultValue: FormControl<string>,
  label: FormControl<string>,
  libraryId: FormControl<number>,
  mandatory: FormControl<boolean>,
  inherits: FormControl<boolean>,
  changedFromDefault: FormControl<boolean>,
  type: FormControl<string>,
  value: FormControl<string>,
  valueString: FormControl<string>,
  valuePrice: FormControl<number>,
}

export function newOfferEntryFieldGroupFormField(field: OfferElementField) {
  return new FormGroup<OfferEntryFieldGroup>({
    calculation: new FormControl(field.field.calculation),
    defaultValue: new FormControl(field.defaultValue),
    label: new FormControl(`${field.field.label} ${field.field.unit ? `(${field.field.unit.short})` : ""}`),
    libraryId: new FormControl(field.library?.id ?? -1),
    mandatory: new FormControl(field.mandatory),
    inherits: new FormControl(field.inherits),
    changedFromDefault: new FormControl(false),
    type: new FormControl(field.field.fieldType),
    value: new FormControl(field.field.fieldType === OfferFieldEnum.Calculation ? "0" : field.defaultValue),
    valuePrice: new FormControl(0),
    valueString: new FormControl("")
  });
}

export function mapOfferEntryFieldToInput(grp: FormGroup<OfferEntryFieldGroup>): OfferV2EntryField {
  const type = grp.get("type").value as OfferFieldEnum;
  return {
    calculation: grp.get("calculation").value,
    type,
    value: type === OfferFieldEnum.Select ? JSON.stringify(
      {
        id: grp.get("value").value,
        name: grp.get("valueString").value,
        price: grp.get("valuePrice").value
      }
    ) : grp.get("value").value,
    default_value: grp.get("defaultValue").value,
    mandatory: grp.get("mandatory").value,
    inherits: grp.get("inherits").value,
    libraryId: grp.get("libraryId").value,
    label: grp.get("label").value
  };
}

export function mapEntryToEntryFieldGroup(field: OfferV2EntryField) {
  return new FormGroup<OfferEntryFieldGroup>({
    calculation: new FormControl(field.calculation),
    defaultValue: new FormControl(field.default_value),
    label: new FormControl(field.label),
    libraryId: new FormControl(field.libraryId),
    mandatory: new FormControl(field.mandatory),
    inherits: new FormControl(field.inherits),
    changedFromDefault: new FormControl(field.default_value !== field.value),
    type: new FormControl(field.type),
    value: new FormControl(field.type === OfferFieldEnum.Select ? JSON.parse(field.value).id : field.value),
    valueString: new FormControl(field.type === OfferFieldEnum.Select ? JSON.parse(field.value).name : ""),
    valuePrice: new FormControl(field.type === OfferFieldEnum.Select ? parseFloat(JSON.parse(field.value).price) : 0)
  });
}

@Component({
  selector: "app-entry-field-edit",
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatIcon,
    MatSuffix,
    CdkTextareaAutosize,
    OfferLibraryEntrySelectorComponent,
    OfferLibraryEntrySelectorComponent
  ],
  templateUrl: "./entry-field-edit.component.html",
  styleUrl: "./entry-field-edit.component.scss"
})
export class EntryFieldEditComponent implements OnInit {
  @Input() entryFormGroup: FormGroup<OfferEntryFieldGroup>;
  @Input() allLibraries: OfferLibrary[];
  @Output() fieldChanged: EventEmitter<void> = new EventEmitter();


  ngOnInit() {
    this.entryFormGroup.valueChanges.subscribe(() => {
      this.entryFormGroup.patchValue({ changedFromDefault: this.entryFormGroup.get("value").value !== this.entryFormGroup.get("defaultValue").value }, { emitEvent: false });
      setTimeout(() => {
        this.fieldChanged.emit();
      }, 100);
    });
  }

  protected get resettable(): boolean {
    return this.entryFormGroup.get("type").value !== OfferFieldEnum.Calculation && this.entryFormGroup.get("inherits").value && this.entryFormGroup.get("defaultValue").value !== "" && this.entryFormGroup.get("value").value !== this.entryFormGroup.get("defaultValue").value;
  }

  onReset(): void {
    if (this.resettable)
      this.entryFormGroup.patchValue({
        value: this.entryFormGroup.get("defaultValue").value,
        changedFromDefault: false
      });
  }

  onSelectionChanged(event: LibraryEntryDropDownItem) {
    this.entryFormGroup.patchValue({
      value: event.id.toString(10),
      valueString: event.name,
      valuePrice: event.price
    });
  }

  protected readonly OfferFieldEnum = OfferFieldEnum;
  protected readonly parseInt = parseInt;
}
