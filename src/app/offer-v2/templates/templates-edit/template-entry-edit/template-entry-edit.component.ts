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
import { OfferElementListElement } from "../../../../../api/openapi";
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
  @Input({ transform: booleanAttribute }) parentDragging: boolean;
  @Input() draggedObject: Node | null;
  @Output() dragStart = new EventEmitter<Node | null>();
  @Output() droppedBeforeMe = new EventEmitter<number>();
  @Output() unDroppedBeforeMe = new EventEmitter<number>();
  @Output() elementDropped = new EventEmitter<FormGroup<TemplateEntryGroup>>();
  @Output() elementInserted = new EventEmitter<string>();
  @Output() elementUnInserted = new EventEmitter<void>();
  @ViewChild("header") header: ElementRef<HTMLDivElement>;
  @ViewChild("headerRow") headerRow: ElementRef<HTMLDivElement>;
  @ViewChild("placeholder") placeholder: ElementRef<HTMLDivElement>;
  @ViewChild("placeholderContainer") placeholderContainer: ElementRef<HTMLDivElement>;
  @ViewChild("droppableArea") droppableArea: ElementRef<HTMLDivElement>;
  @ViewChild("droppableAreaChild") droppableAreaChild: ElementRef<HTMLDivElement>;
  dragEnabled: boolean;
  private mousedownCoords = { x: 0, y: 0 };

  open = true;

  ngAfterViewInit() {
    document.addEventListener("mousemove", this.mouseMove.bind(this));
    document.addEventListener("mouseup", this.dragStop.bind(this));
  }

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

  private addedNode: Node | null = null;

  protected mouseEnter(inChild?: boolean) {
    if (this.draggedObject && !this.dragEnabled && !this.parentDragging) {
      this.addedNode = this.draggedObject.cloneNode(true);

      if (inChild) {
        ((this.addedNode as HTMLDivElement).childNodes[2] as HTMLSpanElement).innerText = `${this.prefix}${this.index + 1}.1`;
        this.droppableAreaChild.nativeElement.append(this.addedNode);
        this.elementInserted.emit(`${this.prefix}${this.index + 1}.1`);
      } else {
        this.droppableArea.nativeElement.attributeStyleMap.set("display", "flex");
        ((this.addedNode as HTMLDivElement).childNodes[2] as HTMLSpanElement).innerText = `${this.prefix}${this.index + 1}`;
        this.droppableArea.nativeElement.append(this.addedNode);
        this.elementInserted.emit(`${this.prefix}${this.index + 1}`);
        this.droppedBeforeMe.emit(this.index);
      }
    }
  }

  protected mouseLeave(inChild?: boolean) {
    if (this.addedNode && (this.droppableAreaChild || this.droppableArea)) {
      if (inChild) {
        this.droppableAreaChild.nativeElement.removeChild(this.addedNode);
      } else {
        this.unDroppedBeforeMe.emit(this.index);
        this.droppableArea.nativeElement.removeChild(this.addedNode);
        this.droppableArea.nativeElement.attributeStyleMap.set("display", "none");
      }
      this.elementUnInserted.emit();
      this.addedNode = null;
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
      this.elementDropped.emit(this.entryFormGroup);
    }
  }

  protected mouseDown(event: MouseEvent): void {
    event.stopPropagation();
    this.mousedownCoords = { x: event.offsetX + 46, y: event.offsetY + 16 };
    this.dragEnabled = true;
    const node = this.headerRow.nativeElement.cloneNode(true);
    this.dragStart.emit(node);
    this.placeholder.nativeElement.append(node);
    this.placeholder.nativeElement.attributeStyleMap.set("width", `${this.headerRow.nativeElement.clientWidth}px`);
    this.placeholder.nativeElement.attributeStyleMap.set("height", `${this.headerRow.nativeElement.clientHeight}px`);
    this.placeholderContainer.nativeElement.attributeStyleMap.set("display", "block");
    this.placeholderContainer.nativeElement.attributeStyleMap.set("left", `${event.clientX - this.mousedownCoords.x}px`);
    this.placeholderContainer.nativeElement.attributeStyleMap.set("top", `${event.clientY - this.mousedownCoords.y}px`);
  }

  addIndex = Infinity;

  protected droppedBeforeChild(event: number) {
    this.addIndex = event;
  }

  protected unDroppedBeforeChild() {
    this.addIndex = Infinity;
  }
}
