import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { OfferStatementEntryEntry } from "../../../../../api/openapi";
import { MatFormField, MatInput, MatLabel } from "@angular/material/input";
import { MatIcon } from "@angular/material/icon";
import { getNumericVal } from "../../../../shared/custom-validators";
import { randomUUID } from "../../../offer.util";
import { DefaultLayoutAlignDirective, DefaultLayoutDirective, DefaultLayoutGapDirective } from "ng-flex-layout";

export declare type StatementEntryFieldGroup = {
  additionSubstraction: FormControl<boolean>,
  amount: FormControl<number>,
  description: FormControl<string>,
  id: FormControl<string>,
  price: FormControl<number>,
}

export function newStatementEntryFieldGroupFormField(field: OfferStatementEntryEntry) {
  return new FormGroup<StatementEntryFieldGroup>({
    additionSubstraction: new FormControl(field.additionSubstraction),
    amount: new FormControl(field.amount),
    id: new FormControl(field.id),
    price: new FormControl(field.price),
    description: new FormControl(field.description)
  });
}

export function mapStatementEntryFieldToInput(grp: FormGroup<StatementEntryFieldGroup>): OfferStatementEntryEntry {
  return {
    additionSubstraction: grp.get("additionSubstraction").value,
    amount: getNumericVal(grp.get("amount")),
    price: getNumericVal(grp.get("price")),
    description: grp.get("description").value,
    id: grp.get("id").value
  };
}

export function newStatementEntryFieldGroup() {
  return new FormGroup<StatementEntryFieldGroup>({
    additionSubstraction: new FormControl(true),
    amount: new FormControl(1),
    id: new FormControl(randomUUID()),
    price: new FormControl(0),
    description: new FormControl("")
  });
}

@Component({
  selector: "app-statement-entry-field-edit",
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatIcon,
    DefaultLayoutDirective,
    DefaultLayoutAlignDirective,
    DefaultLayoutGapDirective,
    MatLabel
  ],
  templateUrl: "./statement-entry-field-edit.component.html",
  styleUrl: "./statement-entry-field-edit.component.scss"
})
export class StatementEntryFieldEditComponent {
  @Input() entryFormGroup: FormGroup<StatementEntryFieldGroup>;
  @Input() index: number;
  @Output() deleted = new EventEmitter<number>();

  protected toggleAdditionSubstraction() {
    this.entryFormGroup.patchValue({ additionSubstraction: !this.entryFormGroup.get("additionSubstraction").value });
  }

}
