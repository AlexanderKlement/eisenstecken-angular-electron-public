import { Component, Input } from "@angular/core";
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { OfferElementListElement } from "../../../../../api/openapi";
import { DefaultFlexDirective } from "ng-flex-layout";
import { MatIcon } from "@angular/material/icon";
import {
  OfferFieldElementTypePillComponent
} from "../../../offer-field-element-type-pill/offer-field-element-type-pill.component";
import OfferElementSelectorComponent from "../../../element-selector/offer-element-selector.component";

export declare type TemplateEntryGroup = {
  id: FormControl<number>,
  elementId: FormControl<number>,
  elementName: FormControl<string>,
  elementType: FormControl<string>,
  children: FormArray<FormGroup<TemplateEntryGroup>>
}

export function newEmptyTemplateEntryGroup() {
  return new FormGroup<TemplateEntryGroup>({
    id: new FormControl(-1),
    elementName: new FormControl("Element wählen"),
    children: new FormArray([]),
    elementId: new FormControl(null),
    elementType: new FormControl(null)
  });
}

@Component({
  selector: "app-template-entry-edit",
  imports: [
    ReactiveFormsModule,
    DefaultFlexDirective,
    MatIcon,
    OfferFieldElementTypePillComponent,
    OfferElementSelectorComponent
  ],
  templateUrl: "./template-entry-edit.component.html",
  styleUrl: "./template-entry-edit.component.scss"
})
export class TemplateEntryEditComponent {
  @Input() entryFormGroup: FormGroup<TemplateEntryGroup>;
  @Input() prefix: string;
  @Input() index: number;
  @Input() onDeleteElem: (index: number) => void;
  @Input() onAddNeighbour: (index: number) => void;

  open = true;

  toggleOpen() {
    this.open = !this.open;
  }

  onSetElement(val: OfferElementListElement) {
    this.entryFormGroup.patchValue({ elementId: val.id, elementType: val.elementType.name, elementName: val.name });
  }

  onAddChild() {
    this.entryFormGroup.controls.children.push(newEmptyTemplateEntryGroup());
  }

  onAddNeighbourHere(index: number) {
    this.entryFormGroup.controls.children.insert(index + 1, newEmptyTemplateEntryGroup());
  }

  onDeleteElemHere(index: number) {
    this.entryFormGroup.controls.children.removeAt(index);
  }
}
