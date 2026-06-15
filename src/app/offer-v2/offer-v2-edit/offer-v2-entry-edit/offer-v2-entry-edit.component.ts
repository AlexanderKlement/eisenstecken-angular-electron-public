import { Component, inject, Input } from "@angular/core";
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatIcon } from "@angular/material/icon";
import {
  OfferFieldElementTypePillComponent
} from "../../offer-field-element-type-pill/offer-field-element-type-pill.component";
import { DefaultFlexDirective } from "ng-flex-layout";
import OfferElementSelectorComponent from "../../element-selector/offer-element-selector.component";
import { OfferElementListElement, OfferV2EntryOutput, OfferV2Service } from "../../../../api/openapi";
import { take } from "rxjs/operators";
import {
  EntryFieldEditComponent,
  mapEntryToEntryFieldGroup,
  newOfferEntryFieldGroupFormField,
  OfferEntryFieldGroup
} from "./entry-field-edit/entry-field-edit.component";
import { MatFormField, MatInput, MatLabel } from "@angular/material/input";
import { priceEvaluationElementGroup } from "../../calculation-input/offer-calculation-utils";
import { formatCurrency } from "@angular/common";

export declare type OfferEntryGroup = {
  alternative: FormControl<boolean>;
  id: FormControl<string>;
  name: FormControl<string>;
  elementId: FormControl<number>;
  elementType: FormControl<string>;
  amount: FormControl<number>;
  priceChangePercent: FormControl<number>;
  visibleOffer: FormControl<boolean>;
  children: FormArray<FormGroup<OfferEntryGroup>>;
  fields: FormArray<FormGroup<OfferEntryFieldGroup>>;
  description: FormControl<string>;
  price: FormControl<string>;
  offertext: FormControl<string>;
  priceCalculated: FormControl<number>;
  priceFormula: FormControl<string>;
}

export function newEmptyOfferEntryGroup() {
  const grp = new FormGroup<OfferEntryGroup>({
    name: new FormControl(""),
    id: new FormControl(""),
    elementId: new FormControl(-1),
    elementType: new FormControl(""),
    children: new FormArray([]),
    amount: new FormControl(1),
    visibleOffer: new FormControl(true),
    alternative: new FormControl(false),
    priceChangePercent: new FormControl(0),
    fields: new FormArray([]),
    description: new FormControl(""),
    price: new FormControl(""),
    offertext: new FormControl(""),
    priceCalculated: new FormControl(0),
    priceFormula: new FormControl("")
  });
  grp.valueChanges.subscribe(() => {
    priceEvaluationElementGroup(grp);
  });
  return grp;
}

export function mapEntryOfferEntryGroup(entry: OfferV2EntryOutput) {

  const grp = new FormGroup<OfferEntryGroup>({
    name: new FormControl(entry.name),
    id: new FormControl(entry.id),
    elementId: new FormControl(-1),
    elementType: new FormControl(entry.elementType),
    children: new FormArray(entry.children.map(c => mapEntryOfferEntryGroup(c))),
    amount: new FormControl(entry.amount),
    visibleOffer: new FormControl(entry.visibleOffer),
    alternative: new FormControl(entry.alternative),
    priceChangePercent: new FormControl(entry.priceChangePercent),
    fields: new FormArray(entry.fields.map(mapEntryToEntryFieldGroup)),
    description: new FormControl(entry.description),
    price: new FormControl(entry.price),
    offertext: new FormControl(entry.offertext),
    priceCalculated: new FormControl(0),
    priceFormula: new FormControl("")
  });
  grp.valueChanges.subscribe(() => {
    priceEvaluationElementGroup(grp);
  });
  return grp;
}

@Component({
  selector: "app-offer-v2-entry-edit",
  imports: [
    ReactiveFormsModule,
    MatIcon,
    OfferFieldElementTypePillComponent,
    DefaultFlexDirective,
    OfferElementSelectorComponent,
    EntryFieldEditComponent,
    MatFormField,
    MatLabel,
    MatInput
  ],
  templateUrl: "./offer-v2-entry-edit.component.html",
  styleUrl: "./offer-v2-entry-edit.component.scss"
})
export class OfferV2EntryEditComponent {
  private offerService = inject(OfferV2Service);
  @Input() entryGroup: FormGroup<OfferEntryGroup>;
  @Input() prefix: string;
  @Input() index: number;
  @Input() depth: number;
  @Input() onDeleteElem: (index: number) => void;
  @Input() onCopyElem: (index: number) => void;
  @Input() onAddNeighbour: (index: number) => void;
  open = true;

  toggleOpen() {
    this.open = !this.open;
  }

  percent = false;

  togglePercent() {
    this.percent = !this.percent;
  }

  toggleAlternative() {
    this.entryGroup.patchValue({ alternative: !this.entryGroup.get("alternative").value });
  }

  toggleVisibility() {
    this.entryGroup.patchValue({ visibleOffer: !this.entryGroup.get("visibleOffer").value });
  }

  onSetElement(val: OfferElementListElement) {
    this.entryGroup.patchValue({
      elementId: val.id,
      elementType: val.elementType.name,
      price: val.elementType.price,
      offertext: val.elementType.offertext,
      name: val.name
    });
    this.offerService.getOfferElementOfferV2ElementElementIdGet(val.id).pipe(take(1)).subscribe((elem) => {
      this.entryGroup.controls.fields.clear();
      elem.fields.forEach(field => {
        this.entryGroup.controls.fields.push(newOfferEntryFieldGroupFormField(field));
      });
    });
  }

  onAddChild() {
    this.entryGroup.controls.children.push(newEmptyOfferEntryGroup());
  }

  onAddNeighbourHere(index: number) {
    this.entryGroup.controls.children.insert(index + 1, newEmptyOfferEntryGroup());
  }

  onDeleteElemHere(index: number) {
    this.entryGroup.controls.children.removeAt(index);
  }

  protected readonly formatCurrency = formatCurrency;
}
