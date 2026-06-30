import { AbstractControl, FormControl } from "@angular/forms";

export function selectRequires(control: FormControl): { required: true } | null {
  const val = control.value;
  if (val === null || val === undefined || val === "-1" || val === -1) {
    return { required: true };
  }
  return null;
}

export function getNumericVal(control: AbstractControl): number {
  const val = control.value as number | string;
  if (typeof val === "number") {
    if (!Number.isNaN(val)) {
      return val;
    }
    return 0;

  }
  const numeric = parseFloat(val);
  if (!Number.isNaN(numeric)) {
    return numeric;
  }
  return 0;

}
