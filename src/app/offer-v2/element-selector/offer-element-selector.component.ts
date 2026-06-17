import { booleanAttribute, Component, EventEmitter, inject, Input, OnInit, Output } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { OfferElementListElement, OfferV2Service } from "../../../api/openapi";
import { MatFormField, MatLabel } from "@angular/material/input";
import { AsyncPipe } from "@angular/common";
import { MtxSelect } from "@ng-matero/extensions/select";
import { concat, Observable, of, Subject } from "rxjs";
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from "rxjs/operators";
import { DefaultFlexDirective } from "ng-flex-layout";

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
    DefaultFlexDirective
  ]
})
export default class OfferElementSelectorComponent implements OnInit {

  private offerService = inject(OfferV2Service);
  @Input() value?: number;
  @Input() valueName?: string;
  @Input() label?: string;
  @Input() setValue: (val: OfferElementListElement) => void;
  @Input({ transform: booleanAttribute }) outline: boolean;
  @Input({ transform: booleanAttribute }) readonly: boolean;
  @Input({ transform: booleanAttribute }) fillWidth: boolean;
  @Output() keyClicked: EventEmitter<KeyboardEvent> = new EventEmitter();

  elementsInput$ = new Subject<string>();

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
        switchMap(term =>
          this.offerService.getOfferElementsOfferV2ElementsGet(0, term, 20).pipe(
            catchError(() => of([])), // empty list on error
            tap(() => (this.elementsLoading = false))
          )
        )
      )
    );
  }


  onChange(event: OfferElementListElement) {
    this.setValue(event);
  }

  protected onKeyUp(event: KeyboardEvent) {
    this.keyClicked.emit(event);
  }
}
