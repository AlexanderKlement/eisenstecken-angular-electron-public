import { booleanAttribute, Component, EventEmitter, inject, Input, OnInit, Output } from "@angular/core";
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
import { DefaultFlexDirective } from "ng-flex-layout";
import {
  OfferFieldElementTypePillComponent
} from "../offer-field-element-type-pill/offer-field-element-type-pill.component";

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
    MtxSelectTagTemplate
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
  private selectedElementType?: OfferElementType;
  elementsInput$ = new Subject<string>();
  searchString = "";

  elementsLoading = false;

  elements$: Observable<OfferElementListElement[]> = of([]);

  trackByFn = (item: OfferElementListElement) => item.id;

  ngOnInit() {
    this.elements$ = concat(
      this.offerService.getOfferElementsOfferV2ElementsGet(),
      this.elementsInput$.pipe(
        distinctUntilChanged(),
        tap(() => (this.elementsLoading = true)),
        debounceTime(200),
        switchMap(term => {
            this.searchString = term;
            return this.offerService.getOfferElementsOfferV2ElementsGet(0, term, 20).pipe(
              catchError(() => of([])), // empty list on error
              tap(() => (this.elementsLoading = false))
            );
          }
        )
      )
    );
  }


  onChange(event: OfferElementListElement | { name: string }) {
    if ("id" in event) {
      this.setValue.emit(event);
    } else if (this.selectedElementType) {

      this.offerService.createOfferElementOfferV2ElementPut({
        name: event.name,
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
    }
  }

  protected onKeyUp(event: KeyboardEvent) {
    this.keyClicked.emit(event);
  }

  protected onAddType(type: OfferElementType) {
    this.selectedElementType = type;
  }
}
