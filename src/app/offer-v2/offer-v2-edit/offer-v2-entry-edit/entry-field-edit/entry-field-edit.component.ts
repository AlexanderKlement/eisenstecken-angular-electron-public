import { Component, inject, Input, OnInit } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import {
  OfferElementField,
  OfferFieldEnum,
  OfferLibrary,
  OfferV2EntryField,
  OfferV2Service
} from "../../../../../api/openapi";
import { MatFormField, MatInput, MatLabel, MatSuffix } from "@angular/material/input";
import { Observable } from "rxjs";
import { AsyncPipe } from "@angular/common";
import { MatOption, MatSelect } from "@angular/material/select";
import { MatIcon } from "@angular/material/icon";
import { take } from "rxjs/operators";

export declare type OfferEntryFieldGroup = {
  calculation: FormControl<string>,
  defaultValue: FormControl<string>,
  label: FormControl<string>,
  libraryId: FormControl<number>,
  mandatory: FormControl<boolean>,
  inherits: FormControl<boolean>,
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
    AsyncPipe,
    MatSelect,
    MatOption,
    MatIcon,
    MatSuffix
  ],
  templateUrl: "./entry-field-edit.component.html",
  styleUrl: "./entry-field-edit.component.scss"
})
export class EntryFieldEditComponent implements OnInit {
  @Input() entryFormGroup: FormGroup<OfferEntryFieldGroup>;

  private service = inject(OfferV2Service);

  library$: Observable<OfferLibrary>;

  ngOnInit() {
    if (this.entryFormGroup.get("type").value === OfferFieldEnum.Select) {
      this.library$ = this.service.getOfferLibraryOfferV2LibraryLibraryIdGet(this.entryFormGroup.get("libraryId").value);
    }
  }

  onSetValue(value: string): void {
    this.entryFormGroup.patchValue({ value });
  }

  onReset(): void {
    if (this.entryFormGroup.get("type").value === OfferFieldEnum.Calculation)
      return;
    this.entryFormGroup.patchValue({ value: this.entryFormGroup.get("defaultValue").value });
  }

  onSelectionChanged() {
    const id = parseInt(this.entryFormGroup.get("value").value, 10);
    if (id !== -1 && !Number.isNaN(id)) {
      this.library$.pipe(take(1)).subscribe((library) => {
        const entry = library.entries.find(entry => entry.id === id);
        if (entry) {
          this.entryFormGroup.patchValue({
            valueString: entry.name,
            valuePrice: entry.price
          });
        }
      });
    }
  }

  protected readonly OfferFieldEnum = OfferFieldEnum;
}
