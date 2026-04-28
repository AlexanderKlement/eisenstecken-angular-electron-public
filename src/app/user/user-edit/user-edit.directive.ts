import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  ValidationErrors,
  Validator
} from "@angular/forms";
import { Directive, forwardRef, input } from "@angular/core";
import { HourlyRate } from "../../../api/openapi";
import dayjs from "dayjs/esm";


export type HourlyControl = {
  id: FormControl<number>;
  cost: FormControl<number>;
  start_date: FormControl<string>;
  end_date: FormControl<string>;
}
export type EmploymentRelationshipControl = {
  id: FormControl<number>;
  start_date: FormControl<string>;
  end_date: FormControl<string>;
}


@Directive({
  selector: "[appWorkmodelInvalid]",
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => WorkmodelValidatorDirective),
      multi: true
    }
  ]
})
export class WorkmodelValidatorDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    const parts = (control as FormControl<string>).value.split("-");
    if (parts.length === 6 && parts.findIndex(h => Number.isNaN(parseFloat(h))) === -1)
      return null;
    return { workmodelInvalid: true };
  }
}

const dateReg = /[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{4}/g;

function parseDate(value: string | AbstractControl | number): number {
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "string") {
    if (dateReg.test(value)) {
      return dayjs(value, "DD.MM.YYYY").unix();
    }
    return new Date(value).getTime();
  }
  if (value instanceof Date) {
    return value.getTime();
  }
  const val = value.value;
  if (typeof val === "string" && dateReg.test(val)) {
    return dayjs(val, "DD.MM.YYYY").unix();
  }
  if (val instanceof Date) {
    return val.getTime();
  }
  return new Date(val).getTime();
}

function validateDates(thisStart: number, thisEnd: number, prevEnd: number, nextStart: number) {
  if (Number.isNaN(prevEnd) || Number.isNaN(thisStart) || thisStart == 0) {
    return { dateInvalid: true };
  }
  if (Number.isNaN(thisEnd) || thisEnd == 0) {
    const dateBefore = prevEnd > thisStart || nextStart !== Infinity;
    if (dateBefore)
      return { dateBefore };
    return null;
  }
  const startBeforeEnd = thisStart >= thisEnd;
  const dateBefore = prevEnd > thisStart || thisEnd > nextStart;
  if (dateBefore || startBeforeEnd)
    return { dateBefore, startBeforeEnd };
  return null;
}

@Directive({
  selector: "[appHourlyInvalid]",
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => HourlyValidatorDirective),
      multi: true
    }
  ]
})
export class HourlyValidatorDirective implements Validator {
  readonly beforeRow = input<FormGroup<HourlyControl> | undefined>();
  readonly afterRow = input<FormGroup<HourlyControl> | undefined>();

  validate(control: AbstractControl): ValidationErrors | null {

    const typedControl = (control as FormGroup<HourlyControl>);

    const prevEnd = parseDate(this.beforeRow ? (this.beforeRow()?.get("end_date") ?? 0) : 0);
    const thisStart = parseDate(typedControl.get("start_date"));
    const thisEnd = parseDate(typedControl.get("end_date"));
    const nextStart = parseDate(this.afterRow ? this.afterRow()?.get("start_date") ?? Infinity : Infinity);
    return validateDates(thisStart, thisEnd, prevEnd, nextStart);

  }
}

@Directive({
  selector: "[appEmploymentInvalid]",
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => EmploymentValidatorDirective),
      multi: true
    }
  ]
})
export class EmploymentValidatorDirective implements Validator {
  readonly beforeRow = input<FormGroup<EmploymentRelationshipControl> | undefined>();
  readonly afterRow = input<FormGroup<EmploymentRelationshipControl> | undefined>();

  validate(control: AbstractControl): ValidationErrors | null {

    const typedControl = (control as FormGroup<EmploymentRelationshipControl>);

    const prevEnd = parseDate(this.beforeRow ? (this.beforeRow()?.get("end_date") ?? 0) : 0);
    const thisStart = parseDate(typedControl.get("start_date"));
    const thisEnd = parseDate(typedControl.get("end_date"));
    const nextStart = parseDate(this.afterRow ? this.afterRow()?.get("start_date") ?? Infinity : Infinity);
    return validateDates(thisStart, thisEnd, prevEnd, nextStart);

  }
}
