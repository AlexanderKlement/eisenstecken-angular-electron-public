import { Component, inject, Input } from "@angular/core";
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatIcon } from "@angular/material/icon";
import {
  OfferFieldElementTypePillComponent
} from "../../offer-field-element-type-pill/offer-field-element-type-pill.component";
import { DefaultFlexDirective } from "ng-flex-layout";
import OfferElementSelectorComponent from "../../element-selector/offer-element-selector.component";
import { OfferElementListElement, OfferV2Service } from "../../../../api/openapi";
import { take } from "rxjs/operators";
import {
  EntryFieldEditComponent,
  newOfferEntryFieldGroupFormField,
  OfferEntryFieldGroup
} from "./entry-field-edit/entry-field-edit.component";
import { MatFormField, MatInput, MatLabel } from "@angular/material/input";

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
  fields: FormArray<FormGroup<OfferEntryFieldGroup>>; //TODO i think i need description here
}

export function newEmptyOfferEntryGroup() {
  return new FormGroup({
    name: new FormControl(""),
    id: new FormControl(""),
    elementId: new FormControl(-1),
    elementType: new FormControl(""),
    children: new FormArray([]),
    amount: new FormControl(1),
    visibleOffer: new FormControl(true),
    alternative: new FormControl(false),
    priceChangePercent: new FormControl(0),
    fields: new FormArray([])
  });
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

}
