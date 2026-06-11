import { booleanAttribute, Component, inject, Input, OnInit } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { OfferElementListElement, OfferV2Service } from "../../../api/openapi";
import { MatFormField, MatLabel } from "@angular/material/input";
import { AsyncPipe } from "@angular/common";
import { MtxSelect, MtxSelectOptionTemplate } from "@ng-matero/extensions/select";
import { concat, of, Subject } from "rxjs";
import { catchError, distinctUntilChanged, switchMap, tap } from "rxjs/operators";

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
    MtxSelectOptionTemplate
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

  elementsInput$ = new Subject<string>();

  elementsLoading = false;

  elements$ = of([]);

  trackByFn = (item: OfferElementListElement) => item.id;

  ngOnInit() {
    this.elements$ = concat(
      of(this.value ? [{ name: this.valueName, id: this.value }] : []), // default items
      this.elementsInput$.pipe(
        distinctUntilChanged(),
        tap(() => (this.elementsLoading = true)),
        switchMap(term =>
          this.offerService.getOfferElementsOfferV2ElementsGet(0, term, 20).pipe(
            catchError(() => of(this.value ? [{ name: this.valueName, id: this.value }] : [])), // empty list on error
            tap(() => (this.elementsLoading = false))
          )
        )
      )
    );
  }

  onChange(event: OfferElementListElement) {
    this.setValue(event);
  }
}
