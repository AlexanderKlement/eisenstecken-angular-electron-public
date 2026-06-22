import { booleanAttribute, Component, EventEmitter, inject, Input, OnInit, Output, ViewChild } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import {
  OfferElementListElement,
  OfferElementType,
  OfferTemplateListElement,
  OfferV2Service,
  SchemasOfferV2OfferElementFieldSchemaOfferElementCreatePatch
} from "../../../api/openapi";
import { MatFormField, MatLabel } from "@angular/material/input";
import { MtxSelect, MtxSelectOptionTemplate, MtxSelectTagTemplate } from "@ng-matero/extensions/select";
import { take } from "rxjs/operators";
import { DefaultFlexDirective, DefaultLayoutAlignDirective, DefaultLayoutDirective } from "ng-flex-layout";
import {
  OfferFieldElementTypePillComponent
} from "../offer-field-element-type-pill/offer-field-element-type-pill.component";
import { MatIcon } from "@angular/material/icon";
import { Observable, of } from "rxjs";
import { AsyncPipe } from "@angular/common";

type CustomElement = (OfferElementListElement | OfferTemplateListElement) & {
  customId: string;
}

@Component({
  selector: "app-offer-element-selector",
  templateUrl: "./offer-element-selector.component.html",
  styleUrls: ["./offer-element-selector.component.scss"],
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MtxSelect,
    DefaultFlexDirective,
    OfferFieldElementTypePillComponent,
    MtxSelectTagTemplate,
    DefaultLayoutDirective,
    DefaultLayoutAlignDirective,
    MatIcon,
    MtxSelectOptionTemplate,
    AsyncPipe
  ]
})
export default class OfferElementSelectorComponent implements OnInit {

  private offerService = inject(OfferV2Service);
  @Input() allElementTypes: OfferElementType[];
  @Input() allElements: OfferElementListElement[];
  @Input() allTemplates: OfferTemplateListElement[];
  @Input() value?: number;
  @Input() valueName?: string;
  @Input() label?: string;
  @Input({ transform: booleanAttribute }) outline: boolean;
  @Input({ transform: booleanAttribute }) readonly: boolean;
  @Input({ transform: booleanAttribute }) fillWidth: boolean;
  @Input({ transform: booleanAttribute }) addingEnabled: boolean;
  @Input({ transform: booleanAttribute }) includeTemplates: boolean;

  @Output() setValue: EventEmitter<OfferElementListElement | OfferTemplateListElement> = new EventEmitter();
  @Output() keyClicked: EventEmitter<KeyboardEvent> = new EventEmitter();
  @ViewChild("selectChild") selectChild: MtxSelect;
  private selectedElementType?: OfferElementType;
  searchString = "";
  saveInLibrary = false;
  keepOpen = false;

  elements$: Observable<CustomElement[]> = of([]);

  trackByFn = (item: CustomElement) => item.customId;

  private createObservable(additional?: CustomElement) {
    return of((this.allElements.filter(ele => ele.id === this.value || !ele.temporary).map<CustomElement>(ele => ({
      ...ele,
      customId: `element-${ele.id}`
    }))).concat(
      this.allTemplates.map<CustomElement>(ele => ({
        ...ele,
        customId: `template-${ele.id}`
      }))
    ).concat(additional ? [additional] : []));
  }

  ngOnInit() {
    this.elements$ = this.createObservable();
  }

  searchFun(term: string, item: OfferElementListElement | OfferTemplateListElement): boolean {
    this.searchString = term;
    const clearTerm = term.trim().toLowerCase();
    if ("entry_count" in item) {
      return item.name.toLowerCase().indexOf(clearTerm) !== -1 || item.description.toLowerCase().indexOf(clearTerm) !== -1;
    } else {
      return item.name.toLowerCase().indexOf(clearTerm) !== -1 || item.elementType.name.toLowerCase().indexOf(clearTerm) !== -1;
    }
  }

  onClose() {
    if (this.keepOpen) {
      this.selectChild.open();
    }
  }

  onChange(event: OfferElementListElement | OfferTemplateListElement | { name: string }) {
    if ("id" in event) {
      this.keepOpen = false;
      this.setValue.emit(event);
    } else if (this.selectedElementType) {
      this.keepOpen = false;
      this.offerService.createOfferElementOfferV2ElementPut({
        name: event.name,
        temporary: !this.saveInLibrary,
        elementTypeId: this.selectedElementType.id,
        fields: this.selectedElementType.fields.map<SchemasOfferV2OfferElementFieldSchemaOfferElementCreatePatch>(field => {
          return {
            defaultValue: "",
            mandatory: false,
            fieldId: field.id,
            inherits: false,
            libraryId: null
          };
        })
      }).pipe(take(1)).subscribe((element) => {
        this.selectedElementType = null;
        this.elements$ = this.createObservable({
          ...element,
          customId: `element-${element.id}`
        });
        this.setValue.emit(element);
      });
    } else {
      this.keepOpen = true;
    }
  }

  protected onKeyUp(event: KeyboardEvent) {
    this.keyClicked.emit(event);
  }

  protected onAddType(type: OfferElementType) {
    this.selectedElementType = type;
  }

  protected onCheckSavInLibrary() {
    this.saveInLibrary = !this.saveInLibrary;
  }
}
