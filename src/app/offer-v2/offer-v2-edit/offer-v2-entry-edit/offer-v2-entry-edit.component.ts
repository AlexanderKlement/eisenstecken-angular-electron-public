import {
  AfterViewInit,
  booleanAttribute,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  Output,
  ViewChild
} from "@angular/core";
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatIcon } from "@angular/material/icon";
import {
  OfferFieldElementTypePillComponent
} from "../../offer-field-element-type-pill/offer-field-element-type-pill.component";
import { DefaultFlexDirective } from "ng-flex-layout";
import OfferElementSelectorComponent from "../../element-selector/offer-element-selector.component";
import {
  OfferElementListElement,
  OfferElementType,
  OfferFieldEnum,
  OfferLibrary,
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
import { CdkTextareaAutosize } from "@angular/cdk/text-field";
import { randomUUID } from "../../offer.util";
import { ConfirmDialogComponent } from "../../../shared/components/confirm-dialog/confirm-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { adjustInheritance, autofillInheritance } from "../../offer-inheritance-util";

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

export function mapOfferEntryToInput(grp: FormGroup<OfferEntryGroup>): OfferV2EntryInput | null {
  if (grp.get("elementType").value == "") {
    return null;
  }
  return {
    alternative: grp.get("alternative").value,
    id: grp.get("id").value,
    description: grp.get("description").value,
    elementId: grp.get("elementId").value,
    elementType: grp.get("elementType").value,
    name: grp.get("name").value,
    children: grp.controls.children.controls.map(mapOfferEntryToInput).filter(inp => !!inp),
    offertext: grp.get("offertext").value,
    price: grp.get("price").value,
    amount: grp.get("amount").value,
    fields: grp.controls.fields.controls.map(mapOfferEntryFieldToInput),
    priceSubPercent: grp.get("priceSubPercent").value,
    priceAddPercent: grp.get("priceAddPercent").value,
    visibleOffer: grp.get("visibleOffer").value
  };
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
    elementId: new FormControl(entry.elementId),
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
    MatInput,
    CdkTextareaAutosize,
    OfferElementSelectorComponent
  ],
  templateUrl: "./offer-v2-entry-edit.component.html",
  styleUrl: "./offer-v2-entry-edit.component.scss"
})
export class OfferV2EntryEditComponent implements AfterViewInit {
  private offerService = inject(OfferV2Service);
  private dialog = inject(MatDialog);
  @Input() entryGroup: FormGroup<OfferEntryGroup>;
  @Input() prefix: string;
  @Input() index: number;
  @Input() depth: number;
  @Input() selectedElements: string[];
  @Input({ transform: booleanAttribute }) parentDragging: boolean;
  @Input({ transform: booleanAttribute }) parentInvisible: boolean;
  @Input() draggedObject: Node | null;
  @Input() allElementTypes: OfferElementType[];
  @Input() allLibraries: OfferLibrary[];
  @Input() onDeleteElem: (index: number) => void;
  @Input() onCopyElem: (index: number) => void;
  @Input() onAddNeighbour: (index: number) => void;
  open = false;
  @Output() priceEvaluated = new EventEmitter<void>();
  @Output() dragStart = new EventEmitter<Node | null>();
  @Output() droppedBeforeMe = new EventEmitter<number>();
  @Output() unDroppedBeforeMe = new EventEmitter<number>();
  @Output() elementDropped = new EventEmitter<FormGroup<OfferEntryGroup>>();
  @Output() elementInserted = new EventEmitter<string>();
  @Output() elementUnInserted = new EventEmitter<void>();
  @Output() selectElem = new EventEmitter<string>();
  private waitForChildren: number = 0;


  @ViewChild("headerRow") headerRow: ElementRef<HTMLDivElement>;
  @ViewChild("header") header: ElementRef<HTMLDivElement>;
  @ViewChild("placeholder") placeholder: ElementRef<HTMLDivElement>;
  @ViewChild("placeholderContainer") placeholderContainer: ElementRef<HTMLDivElement>;
  @ViewChild("droppableArea") droppableArea: ElementRef<HTMLDivElement>;
  @ViewChild("droppableAreaChild") droppableAreaChild: ElementRef<HTMLDivElement>;
  dragEnabled: boolean;
  private mousedownCoords = { x: 0, y: 0 };

  public get elementSelected() {
    return this.selectedElements && this.entryGroup && this.selectedElements.includes(this.entryGroup.get("id").value);
  }

  ngAfterViewInit() {
    document.addEventListener("mousemove", this.mouseMove.bind(this));
    document.addEventListener("mouseup", this.dragStop.bind(this));

    if (this.entryGroup) {
      if (this.entryGroup.controls.children.length === 0) {
        priceEvaluationElementGroup(this.entryGroup);
        this.priceEvaluated.emit();
      } else {
        this.waitForChildren = this.entryGroup.controls.children.length;
      }
    }
    if (this.entryGroup.controls.elementType.value === "") {
      this.open = true;
      const input = this.headerRow.nativeElement.getElementsByTagName("input");
      if (input.length !== 0) {
        input[0].click();
      }
    }
  }

  onSearchKeyClicked(event: KeyboardEvent) {
    if (event.key === "Escape" && this.entryGroup.get("elementType").value === "") {
      this.onDeleteElem(this.index);
    }
  }

  childrenEvaluated() {
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
      autofillInheritance(this.entryGroup);
    });
  }

  onAddChild() {
    this.entryGroup.controls.children.push(newEmptyOfferEntryGroup());
  }

  onAddNeighbourHere(index: number) {
    this.entryGroup.controls.children.insert(index + 1, newEmptyOfferEntryGroup());
  }

  onCopyElemHere(index: number) {
    this.entryGroup.controls.children.insert(index + 1, mapEntryOfferEntryGroup(mapOfferEntryToInput(this.entryGroup.controls.children.at(index)), this.entryGroup.get("globalAddPercent").value));
  }

  onDeleteElemHere(index: number) {
    const child = this.entryGroup.controls.children.at(index);
    if (child.controls.children.length !== 0) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: "400px",
        data: {
          title: `Element löschen?`,
          text: `Wenn du '${child.get("description").value}' löschst, werden auch alle Kinder dieses Elements gelöscht`
        }
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.entryGroup.controls.children.removeAt(index);
        }
      });
    } else {
      this.entryGroup.controls.children.removeAt(index);
    }
  }

  protected readonly formatCurrency = formatCurrency;
  protected readonly OfferFieldEnum = OfferFieldEnum;

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
        if (this.parentDragging) {
          this.droppableArea.nativeElement.attributeStyleMap.set("border-top-color", "#f00");
          this.droppableArea.nativeElement.attributeStyleMap.set("border-right-color", "#f00");
          this.droppableArea.nativeElement.attributeStyleMap.set("border-bottom-color", "#f00");
        } else {
          this.droppableArea.nativeElement.attributeStyleMap.set("border-top-color", "#0f0");
          this.droppableArea.nativeElement.attributeStyleMap.set("border-right-color", "#0f0");
          this.droppableArea.nativeElement.attributeStyleMap.set("border-bottom-color", "#0f0");
        }
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
      this.elementDropped.emit(this.entryGroup);
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

  protected onSelectElem() {
    this.selectElem.emit(this.entryGroup.get("id").value);
  }

  protected fieldChanged() {
    this.entryGroup.controls.children.controls.forEach(adjustInheritance);
  }
}
