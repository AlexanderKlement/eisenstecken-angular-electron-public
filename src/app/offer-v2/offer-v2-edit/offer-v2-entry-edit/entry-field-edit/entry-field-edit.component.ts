import { Component } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { OfferElementField } from "../../../../../api/openapi";

export declare type OfferEntryFieldGroup = {
  calculation: FormControl<string>,
  defaultValue: FormControl<string>,
  description: FormControl<string>,
  label: FormControl<string>,
  libraryId: FormControl<number>,
  mandatory: FormControl<boolean>,
  inherits: FormControl<boolean>,
  type: FormControl<string>,
  unitId: FormControl<number>,
  unitName: FormControl<string>,
  value: FormControl<string>,
}

export function newOfferEntryFieldGroupFormField(field: OfferElementField) {
  return new FormGroup<OfferEntryFieldGroup>({
    calculation: new FormControl(field.field.calculation),
    defaultValue: new FormControl(field.defaultValue),
    description: new FormControl(field.field.description),
    unitId: new FormControl(field.field.unit?.id ?? -1),
    unitName: new FormControl(field.field.unit?.name ?? ""),
    label: new FormControl(field.field.label),
    libraryId: new FormControl(field.library?.id ?? -1),
    mandatory: new FormControl(field.mandatory),
    inherits: new FormControl(field.inherits),
    type: new FormControl(field.field.fieldType),
    value: new FormControl("")
  });
}

@Component({
  selector: "app-entry-field-edit",
  imports: [],
  templateUrl: "./entry-field-edit.component.html",
  styleUrl: "./entry-field-edit.component.scss"
})
export class EntryFieldEditComponent {

}
