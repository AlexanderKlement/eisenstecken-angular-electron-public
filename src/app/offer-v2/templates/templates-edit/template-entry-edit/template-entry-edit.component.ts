import {
  AfterViewInit,
  booleanAttribute,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from "@angular/core";
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import {
  OfferElementListElement,
  OfferTemplateEntryCreatePatch,
  OfferTemplateListElement
} from "../../../../../api/openapi";
import { DefaultFlexDirective } from "ng-flex-layout";
import { MatIcon } from "@angular/material/icon";
import {
  OfferFieldElementTypePillComponent
} from "../../../offer-field-element-type-pill/offer-field-element-type-pill.component";
import OfferElementSelectorComponent from "../../../element-selector/offer-element-selector.component";
import { randomUUID } from "../../../offer.util";

export declare type TemplateEntryGroup = {
  id: FormControl<number>,
  uid: FormControl<string>,
  elementId: FormControl<number>,
  elementName: FormControl<string>,
  elementType: FormControl<string>,
  children: FormArray<FormGroup<TemplateEntryGroup>>
}

export function newEmptyTemplateEntryGroup() {
  return new FormGroup<TemplateEntryGroup>({
    id: new FormControl(-1),
    uid: new FormControl(randomUUID()),
    elementName: new FormControl("Element wählen"),
    children: new FormArray([]),
    elementId: new FormControl(null),
    elementType: new FormControl(null)
  });
}

export function mapTemplateEntryGroupFromInput(input: OfferTemplateEntryCreatePatch) {
  return new FormGroup<TemplateEntryGroup>({
    id: new FormControl(-1),
    uid: new FormControl(randomUUID()),
    elementName: new FormControl(""),
    children: new FormArray(input.children.map(mapTemplateEntryGroupFromInput)),
    elementId: new FormControl(input.elementId),
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
export class TemplateEntryEditComponent implements AfterViewInit {
  @Input() entryFormGroup: FormGroup<TemplateEntryGroup>;
  @Input() prefix: string;
  @Input() index: number;
  @Input() depth: number;
  @Input() onDeleteElem: (index: number) => void;
  @Input() onAddNeighbour: (index: number) => void;
  @Input() allElements: OfferElementListElement[] = [];
  @Input({ transform: booleanAttribute }) parentDragging: boolean;
  @Input() draggedObject: FormGroup<TemplateEntryGroup> | null;
  @Output() dragStart = new EventEmitter<FormGroup<TemplateEntryGroup>>();
  @Output() elementInserted = new EventEmitter<string>();
  @Output() elementUnInserted = new EventEmitter<void>();
  @ViewChild("header") header: ElementRef<HTMLDivElement>;
  @ViewChild("headerRow") headerRow: ElementRef<HTMLDivElement>;
  @ViewChild("placeholder") placeholder: ElementRef<HTMLDivElement>;
  @ViewChild("placeholderContainer") placeholderContainer: ElementRef<HTMLDivElement>;

  dragEnabled: boolean;
  private mousedownCoords = { x: 0, y: 0 };


  ngAfterViewInit() {
    document.addEventListener("mousemove", this.mouseMove.bind(this));
    document.addEventListener("mouseup", this.dragStop.bind(this));
  }


  onSetElement(val: OfferElementListElement | OfferTemplateListElement) {
    if ("elementType" in val) {
      this.entryFormGroup.patchValue({ elementId: val.id, elementType: val.elementType.name, elementName: val.name });
    }
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

  private addedNode = false;
  addedPosition: "before" | "after" | "child" | null = null;

  setAddedPosition(height: number, mouse: number) {
    if (mouse < (height * 0.2)) {
      this.elementInserted.emit(`${this.prefix}${this.index + 1}`);
      this.addedPosition = "before";
    } else if (mouse > (height * 0.8)) {
      this.elementInserted.emit(`${this.prefix}${this.index + 2}`);
      this.addedPosition = "after";
    } else {
      this.elementInserted.emit(`${this.prefix}${this.index + 1}.1`);
      this.addedPosition = "child";
    }
  }

  protected mouseMoveEntered(event: MouseEvent) {
    if (this.addedNode) {
      const target = event.target as HTMLDivElement;
      const height = Math.max(target.offsetHeight, 1);
      const mouse = Math.min(Math.max(0, event.offsetY), height);
      this.setAddedPosition(height, mouse);
    }
  }

  protected mouseEnter(event: MouseEvent) {
    if (this.draggedObject && !this.dragEnabled && !this.parentDragging) {
      this.addedNode = true;
      const target = event.target as HTMLDivElement;
      const height = Math.max(target.offsetHeight, 1);
      const mouse = Math.min(Math.max(0, event.offsetY), height);
      this.setAddedPosition(height, mouse);
    }
  }

  protected mouseLeave() {
    if (this.addedNode) {
      this.elementUnInserted.emit();
      this.addedPosition = null;
      this.addedNode = false;
    }
  }

  protected mouseMove(event: MouseEvent): void {
    if (this.dragEnabled) {
      this.placeholderContainer.nativeElement.attributeStyleMap.set("left", `${event.clientX - this.mousedownCoords.x}px`);
      this.placeholderContainer.nativeElement.attributeStyleMap.set("top", `${event.clientY - this.mousedownCoords.y}px`);
    }
  }


  protected dragStop(): void {
    if (this.dragEnabled) {
      this.dragEnabled = false;
      this.placeholderContainer.nativeElement.attributeStyleMap.set("display", "none");
      this.dragStart.emit(null);
    }
  }

  protected mouseDown(event: MouseEvent): void {
    event.stopPropagation();
    this.mousedownCoords = { x: event.offsetX + 46, y: event.offsetY + 16 };
    this.dragEnabled = true;
    const node = this.headerRow.nativeElement.cloneNode(true);
    this.dragStart.emit(this.entryFormGroup);
    this.placeholder.nativeElement.append(node);
    this.placeholder.nativeElement.attributeStyleMap.set("width", `${this.headerRow.nativeElement.clientWidth}px`);
    this.placeholder.nativeElement.attributeStyleMap.set("height", `${this.headerRow.nativeElement.clientHeight}px`);
    this.placeholderContainer.nativeElement.attributeStyleMap.set("display", "block");
    this.placeholderContainer.nativeElement.attributeStyleMap.set("left", `${event.clientX - this.mousedownCoords.x}px`);
    this.placeholderContainer.nativeElement.attributeStyleMap.set("top", `${event.clientY - this.mousedownCoords.y}px`);
  }
}
