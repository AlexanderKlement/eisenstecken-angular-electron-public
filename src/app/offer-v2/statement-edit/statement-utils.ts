import { FormArray, FormGroup } from "@angular/forms";
import { StatementEntryGroup } from "./statement-entry-edit/offer-statement-entry-edit.component";
import { getNumericVal } from "../../shared/custom-validators";

export function evaluateStatementPrice(array: FormArray<FormGroup<StatementEntryGroup>>): number {
  let p = 0;
  array.controls.forEach((control) => {
    const original = getNumericVal(control.get("originalPrice"));
    if (control.get("notMade").value) {
      control.patchValue({ price: 0 }, { emitEvent: false });
      p -= original;
    } else {
      let substraction = 0;
      substraction += evaluateStatementPrice(control.controls.children);
      control.controls.entries.controls.forEach((entry) => {
        substraction += (entry.get("additionSubstraction").value ? 1 : -1) * getNumericVal(entry.get("amount")) * getNumericVal(entry.get("price"));
      });
      control.patchValue({ price: original + substraction }, { emitEvent: false });
      p += substraction;
    }
  });
  return p;
}
