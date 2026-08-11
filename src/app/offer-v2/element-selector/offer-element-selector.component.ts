import { booleanAttribute, Component, EventEmitter, inject, Input, OnInit, Output, ViewChild } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import {
  OfferElementListElement,
  OfferElementType,
  OfferTemplate,
  OfferTemplateEntryOutput,
  OfferV2Service,
  SchemasOfferV2OfferElementFieldSchemaOfferElementCreatePatch
} from "../../../api/openapi";
import { MatFormField } from "@angular/material/input";
import { MtxSelect, MtxSelectOptionTemplate, MtxSelectTagTemplate } from "@ng-matero/extensions/select";
import { take } from "rxjs/operators";
import { DefaultFlexDirective, DefaultLayoutAlignDirective, DefaultLayoutDirective } from "ng-flex-layout";
import {
  OfferFieldElementTypePillComponent
} from "../offer-field-element-type-pill/offer-field-element-type-pill.component";
import { MatIcon } from "@angular/material/icon";
import { Observable, of } from "rxjs";
import { AsyncPipe } from "@angular/common";
import { MatButton } from "@angular/material/button";

type CustomElement = (OfferElementListElement | OfferTemplate) & {
  customId: string;
}

@Component({
  selector: "app-offer-element-selector",
  templateUrl: "./offer-element-selector.component.html",
  styleUrls: ["./offer-element-selector.component.scss"],
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MtxSelect,
    DefaultFlexDirective,
    OfferFieldElementTypePillComponent,
    MtxSelectTagTemplate,
    DefaultLayoutDirective,
    DefaultLayoutAlignDirective,
    MatIcon,
    MtxSelectOptionTemplate,
    AsyncPipe,
    MatButton
  ]
})
export default class OfferElementSelectorComponent implements OnInit {

  private offerService = inject(OfferV2Service);
  @Input() allElementTypes: OfferElementType[];
  @Input() allElements: OfferElementListElement[];
  @Input() allTemplates: OfferTemplate[];
  @Input() value?: number;
  @Input({ transform: booleanAttribute }) outline: boolean;
  @Input({ transform: booleanAttribute }) readonly: boolean;
  @Input({ transform: booleanAttribute }) fillWidth: boolean;
  @Input({ transform: booleanAttribute }) addingEnabled: boolean;
  @Input({ transform: booleanAttribute }) includeTemplates: boolean;
  @ViewChild("selectInput") selectInput: MtxSelect;
  @Output() setValue: EventEmitter<OfferElementListElement | OfferTemplate> = new EventEmitter();
  @Output() keyClicked: EventEmitter<KeyboardEvent> = new EventEmitter();
  selectedElementType?: OfferElementType;
  searchString = "";
  saveInLibrary = false;

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

  templateStringRecursive(template: OfferTemplateEntryOutput): string {
    return `↳ ${template.name} ${template.children.length ? this.templateStringRecursive(template.children[0]) : ""}`;
  }

  templateString(template: OfferTemplate): string[] {
    return template.structure.filter((_, i) => i < 3).map(entry => this.templateStringRecursive(entry));
  }

  searchFun(term: string, item: OfferElementListElement | OfferTemplate): boolean {
    this.searchString = term;
    const clearTerm = term.trim().toLowerCase();
    if ("structure" in item) {
      return item.name.toLowerCase().indexOf(clearTerm) !== -1 || item.description.toLowerCase().indexOf(clearTerm) !== -1;
    } else {
      return item.name.toLowerCase().indexOf(clearTerm) !== -1 || item.elementType.name.toLowerCase().indexOf(clearTerm) !== -1;
    }
  }

  onAdd(event: PointerEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onCreateType() {
    if (this.selectedElementType) {
      this.offerService.createOfferElementOfferV2ElementPut({
        name: this.searchString,
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
        this.selectInput.close();
      });
    }
  }

  onChange(event: OfferElementListElement | OfferTemplate | { name: string }) {
    if ("id" in event && "name" in event) {
      this.setValue.emit(event);
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
