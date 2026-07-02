import { Component, inject, Input } from "@angular/core";
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { FlexModule } from "ng-flex-layout";
import { OfferStatementEntryInput, OfferStatementEntryOutput, OfferV2Service } from "../../../../api/openapi";
import { MatFormField, MatInput } from "@angular/material/input";
import { formatCurrency } from "@angular/common";
import { MatDialog } from "@angular/material/dialog";
import { getNumericVal } from "../../../shared/custom-validators";
import { MatCheckbox } from "@angular/material/checkbox";
import { MatIcon } from "@angular/material/icon";
import {
  newStatementEntryFieldGroup,
  newStatementEntryFieldGroupFormField,
  StatementEntryFieldEditComponent
} from "./statement-entry-field-edit/statement-entry-field-edit.component";

export declare type StatementEntryGroup = {
  id: FormControl<string>;
  name: FormControl<string>;
  children: FormArray<FormGroup<StatementEntryGroup>>;
  entries: FormArray<FormGroup>;
  price: FormControl<number>;
  originalPrice: FormControl<number>;
  notMade: FormControl<boolean>;
}

export function mapStatementEntryToInput(grp: FormGroup<StatementEntryGroup>): OfferStatementEntryInput | null {
  return {
    id: grp.get("id").value,
    price: getNumericVal(grp.get("price")),
    originalPrice: getNumericVal(grp.get("originalPrice")),
    name: grp.get("name").value,
    notMade: grp.get("notMade").value,
    children: grp.controls.children.controls.map(mapStatementEntryToInput),
    entries: []
  };
}

export function mapStatementEntryToGroup(entry: OfferStatementEntryOutput): FormGroup<StatementEntryGroup> {
  return new FormGroup<StatementEntryGroup>({
    name: new FormControl(entry.name),
    id: new FormControl(entry.id),
    price: new FormControl(entry.price),
    originalPrice: new FormControl(entry.originalPrice),
    children: new FormArray(entry.children.map(mapStatementEntryToGroup)),
    entries: new FormArray(entry.entries.map(newStatementEntryFieldGroupFormField)),
    notMade: new FormControl(entry.notMade)
  });
}


@Component({
  selector: "app-offer-statement-entry-edit",
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatCheckbox,
    FlexModule,
    MatIcon,
    StatementEntryFieldEditComponent
  ],
  templateUrl: "./offer-statement-entry-edit.component.html",
  styleUrl: "./offer-statement-entry-edit.component.scss"
})
export class OfferStatementEntryEditComponent {
  private offerService = inject(OfferV2Service);
  private dialog = inject(MatDialog);
  @Input() entryGroup: FormGroup<StatementEntryGroup>;
  @Input() prefix: string;
  @Input() index: number;
  @Input() depth: number;


  protected onDelete(idx: number) {
    this.entryGroup.controls.entries.removeAt(idx);
  }

  protected onAdd() {
    this.entryGroup.controls.entries.push(newStatementEntryFieldGroup());
  }

  protected readonly formatCurrency = formatCurrency;

  protected readonly getNumericVal = getNumericVal;
}
