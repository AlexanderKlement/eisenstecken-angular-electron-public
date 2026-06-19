import { booleanAttribute, Component, EventEmitter, inject, Input, OnInit, Output, ViewChild } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import {
  OfferElementListElement,
  OfferElementType,
  OfferV2Service,
  SchemasOfferV2OfferElementFieldSchemaOfferElementCreatePatch
} from "../../../api/openapi";
import { MatFormField, MatLabel } from "@angular/material/input";
import { AsyncPipe } from "@angular/common";
import { MtxSelect, MtxSelectTagTemplate } from "@ng-matero/extensions/select";
import { concat, Observable, of, Subject } from "rxjs";
import { catchError, debounceTime, distinctUntilChanged, switchMap, take, tap } from "rxjs/operators";
import { DefaultFlexDirective, DefaultLayoutAlignDirective, DefaultLayoutDirective } from "ng-flex-layout";
import {
  OfferFieldElementTypePillComponent
} from "../offer-field-element-type-pill/offer-field-element-type-pill.component";
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: "app-offer-element-selector",
  templateUrl: "./offer-element-selector.component.html",
  styleUrls: ["./offer-element-selector.component.scss"],
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    AsyncPipe,
    MtxSelect,
    DefaultFlexDirective,
    OfferFieldElementTypePillComponent,
    MtxSelectTagTemplate,
    DefaultLayoutDirective,
    DefaultLayoutAlignDirective,
    MatIcon
  ]
})
export default class OfferElementSelectorComponent implements OnInit {

  private offerService = inject(OfferV2Service);
  @Input() allElementTypes: OfferElementType[];
  @Input() value?: number;
  @Input() valueName?: string;
  @Input() label?: string;
  @Input({ transform: booleanAttribute }) outline: boolean;
  @Input({ transform: booleanAttribute }) readonly: boolean;
  @Input({ transform: booleanAttribute }) fillWidth: boolean;
  @Input({ transform: booleanAttribute }) addingEnabled: boolean;
  @Output() setValue: EventEmitter<OfferElementListElement> = new EventEmitter();
  @Output() keyClicked: EventEmitter<KeyboardEvent> = new EventEmitter();
  @ViewChild("selectChild") selectChild: MtxSelect;
  private selectedElementType?: OfferElementType;
  elementsInput$ = new Subject<string>();
  searchString = "";
  saveInLibrary = false;
  keepOpen = false;
  elementsLoading = false;

  elements$: Observable<OfferElementListElement[]> = of([]);

  trackByFn = (item: OfferElementListElement) => item.id;

  ngOnInit() {
    this.elements$ = concat(
      this.offerService.getOfferElementsOfferV2ElementsGet(undefined, undefined, undefined, this.value),
      this.elementsInput$.pipe(
        distinctUntilChanged(),
        tap(() => (this.elementsLoading = true)),
        debounceTime(200),
        switchMap(term => {
            this.searchString = term;
            return this.offerService.getOfferElementsOfferV2ElementsGet(0, term, 100).pipe(
              catchError(() => of([])), // empty list on error
              tap(() => (this.elementsLoading = false))
            );
          }
        )
      )
    );
  }

  onClose() {
    if (this.keepOpen) {
      this.selectChild.open();
    }
  }

  onChange(event: OfferElementListElement | { name: string }) {
    console.log("Change:", event);
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
        this.elements$ = of([element]);
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
