import { FormControl } from "@angular/forms";

export function selectRequires(control: FormControl): { required: true } | null {
  const val = control.value;
  if (val === null || val === undefined || val === "-1" || val === -1) {
    return { required: true };
  }
  return null;
}
