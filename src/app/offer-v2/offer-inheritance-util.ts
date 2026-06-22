import { FormArray, FormGroup } from "@angular/forms";
import { OfferEntryGroup } from "./offer-v2-edit/offer-v2-entry-edit/offer-v2-entry-edit.component";
import { OfferEntryFieldGroup } from "./offer-v2-edit/offer-v2-entry-edit/entry-field-edit/entry-field-edit.component";

export declare type FieldData = {
  label: string;
  value: string;
}

function evaluateOfferInheritanceField(field: FormGroup<OfferEntryFieldGroup>, parentFields: FieldData[]): FieldData {
  let label = field.get("label").value;
  if (label.indexOf(" ") !== -1) {
    label = label.split(" ")[0];
  }
  const value = field.get("value").value.toString();
  if (field.get("inherits").value) {
    const parent = parentFields.find(pf => pf.label === label);
    const fieldDefault = field.get("defaultValue").value;
    if (parent) {
      if (fieldDefault !== parent.value) {
        field.patchValue({ defaultValue: parent.value }, { emitEvent: false });
      }
    }
  }
  return {
    label,
    value
  };
}

export function evaluateOfferInheritance(groups: FormArray<FormGroup<OfferEntryGroup>>, parentFields: FieldData[]) {
  groups.controls.forEach(group => {
    const fields: FieldData[] = [];
    group.controls.fields.controls.forEach(fieldGroup => {
      fields.push(evaluateOfferInheritanceField(fieldGroup, parentFields));
    });

    evaluateOfferInheritance(group.controls.children, fields);
  });
}

export function autofillInheritance(group: FormGroup<OfferEntryGroup>) {
  group.controls.fields.controls.forEach(fieldGroup => {
    if (fieldGroup.get("inherits").value) {
      if (fieldGroup.get("value").value === "" && fieldGroup.get("value").value !== fieldGroup.get("defaultValue").value) {
        fieldGroup.patchValue({ value: fieldGroup.get("defaultValue").value });
      }
    }
  });
}

export function adjustInheritance(group: FormGroup<OfferEntryGroup>) {
  group.controls.fields.controls.forEach(fieldGroup => {
    if (fieldGroup.get("inherits").value) {
      if (fieldGroup.get("value").value !== fieldGroup.get("defaultValue").value && !fieldGroup.get("changedFromDefault").value) {
        fieldGroup.patchValue({ value: fieldGroup.get("defaultValue").value });
      }
    }
  });
}
