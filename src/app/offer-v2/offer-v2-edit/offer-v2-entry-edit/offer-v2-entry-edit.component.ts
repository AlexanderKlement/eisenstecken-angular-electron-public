import { AfterViewInit, Component, EventEmitter, inject, Input, Output } from "@angular/core";
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatIcon } from "@angular/material/icon";
import {
  OfferFieldElementTypePillComponent
} from "../../offer-field-element-type-pill/offer-field-element-type-pill.component";
import { DefaultFlexDirective } from "ng-flex-layout";
import OfferElementSelectorComponent from "../../element-selector/offer-element-selector.component";
import {
  OfferElementListElement,
  OfferV2EntryInput,
  OfferV2EntryOutput,
  OfferV2Service
} from "../../../../api/openapi";
import { take } from "rxjs/operators";
import {
  EntryFieldEditComponent,
  mapEntryToEntryFieldGroup,
  mapOfferEntryFieldToInput,
  newOfferEntryFieldGroupFormField,
  OfferEntryFieldGroup
} from "./entry-field-edit/entry-field-edit.component";
import { MatFormField, MatInput, MatLabel } from "@angular/material/input";
import { priceEvaluationElementGroup } from "../../offer-calculation-utils";
import { formatCurrency } from "@angular/common";

export declare type OfferEntryGroup = {
  alternative: FormControl<boolean>;
  id: FormControl<string>;
  name: FormControl<string>;
  elementId: FormControl<number>;
  elementType: FormControl<string>;
  amount: FormControl<number>;
  priceSubPercent: FormControl<number>;
  priceAddPercent: FormControl<number>;
  globalAddPercent: FormControl<number>;
  visibleOffer: FormControl<boolean>;
  children: FormArray<FormGroup<OfferEntryGroup>>;
  fields: FormArray<FormGroup<OfferEntryFieldGroup>>;
  description: FormControl<string>;
  price: FormControl<string>;
  offertext: FormControl<string>;
  priceCalculated: FormControl<number>;
  priceFormula: FormControl<string>;
}

export function mapOfferEntryToInput(grp: FormGroup<OfferEntryGroup>): OfferV2EntryInput {
  return {
    alternative: grp.get("alternative").value,
    id: grp.get("id").value,
    description: grp.get("description").value,
    elementType: grp.get("elementType").value,
    name: grp.get("name").value,
    children: grp.controls.children.controls.map(mapOfferEntryToInput),
    offertext: grp.get("offertext").value,
    price: grp.get("price").value,
    amount: grp.get("amount").value,
    fields: grp.controls.fields.controls.map(mapOfferEntryFieldToInput),
    priceSubPercent: grp.get("priceSubPercent").value,
    priceAddPercent: grp.get("priceAddPercent").value,
    visibleOffer: grp.get("visibleOffer").value
  };
}

function randomUUID(): string {
  return (globalThis.crypto ?? require("crypto")).randomUUID();
}

export function newEmptyOfferEntryGroup(globalAddPercent = 0) {
  const grp = new FormGroup<OfferEntryGroup>({
    name: new FormControl(""),
    id: new FormControl(randomUUID()),
    elementId: new FormControl(-1),
    elementType: new FormControl(""),
    children: new FormArray([]),
    amount: new FormControl(1),
    visibleOffer: new FormControl(true),
    alternative: new FormControl(false),
    priceSubPercent: new FormControl(0),
    priceAddPercent: new FormControl(globalAddPercent),
    globalAddPercent: new FormControl(globalAddPercent),
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

export function mapEntryOfferEntryGroup(entry: OfferV2EntryOutput, globalAddPercent = 0): FormGroup<OfferEntryGroup> {
  const grp = new FormGroup<OfferEntryGroup>({
    name: new FormControl(entry.name),
    id: new FormControl(entry.id),
    elementId: new FormControl(-1),
    elementType: new FormControl(entry.elementType),
    children: new FormArray(entry.children.map(c => mapEntryOfferEntryGroup(c))),
    amount: new FormControl(entry.amount),
    visibleOffer: new FormControl(entry.visibleOffer),
    alternative: new FormControl(entry.alternative),
    priceSubPercent: new FormControl(entry.priceSubPercent),
    priceAddPercent: new FormControl(entry.priceAddPercent),
    globalAddPercent: new FormControl(globalAddPercent),
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
export class OfferV2EntryEditComponent implements AfterViewInit {
  private offerService = inject(OfferV2Service);
  @Input() entryGroup: FormGroup<OfferEntryGroup>;
  @Input() prefix: string;
  @Input() index: number;
  @Input() depth: number;
  @Input() onDeleteElem: (index: number) => void;
  @Input() onCopyElem: (index: number) => void;
  @Input() onAddNeighbour: (index: number) => void;
  open = true;
  @Output() priceEvaluated = new EventEmitter<void>();
  private waitForChildren: number = 0;

  ngAfterViewInit() {
    if (this.entryGroup) {
      if (this.entryGroup.controls.children.length === 0) {
        priceEvaluationElementGroup(this.entryGroup);
        this.priceEvaluated.emit();
      } else {
        this.waitForChildren = this.entryGroup.controls.children.length;
      }
    }

  }

  childrenEvaluated() {
    console.log(`Children evaluated ${this.waitForChildren}`);
    this.waitForChildren--;
    if (this.waitForChildren <= 0) {
      priceEvaluationElementGroup(this.entryGroup);
      this.priceEvaluated.emit();
    }
  }

  toggleOpen() {
    this.open = !this.open;
  }

  percent = false;

  togglePercent() {
    this.percent = !this.percent;
    this.entryGroup.patchValue({
      priceSubPercent: 0,
      priceAddPercent: this.entryGroup.get("globalAddPercent").value
    });
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

  onCopyElemHere(index: number) {
    this.entryGroup.controls.children.insert(index + 1, this.entryGroup.controls.children.at(index));
  }

  onDeleteElemHere(index: number) {
    this.entryGroup.controls.children.removeAt(index);
  }

  protected readonly formatCurrency = formatCurrency;
}
